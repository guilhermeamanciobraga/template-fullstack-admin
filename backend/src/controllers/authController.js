const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Resend } = require('resend');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const sanitizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ where: { email: sanitizedEmail } });

        if (!user) {
            return res.status(401).json({ message: 'E-mail não cadastrado' });
        }

        if (!user.active) {
            return res.status(403).json({
                message: 'Sua conta está desativada. Entre em contato com o administrador.'
            });
        }

        if (user.lock_until && user.lock_until > new Date()) {
            const timeLeft = Math.ceil((user.lock_until - new Date()) / (60 * 1000));
            return res.status(403).json({
                message: `Conta bloqueada. Tente novamente em ${timeLeft} minutos.`
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const attempts = (user.login_attempts || 0) + 1;
            const remaining = 5 - attempts;
            let updateData = { login_attempts: attempts };

            if (attempts >= 5) {
                updateData.lock_until = new Date(Date.now() + 60 * 60 * 1000);
                updateData.login_attempts = 0;
                await user.update(updateData);
                return res.status(403).json({ message: 'Limite de tentativas atingido. Bloqueado por 1 hora.' });
            }

            await user.update(updateData);
            return res.status(401).json({
                message: `Senha incorreta. Você tem apenas mais ${remaining} ${remaining === 1 ? 'tentativa' : 'tentativas'} antes de bloquear.`
            });
        }

        await user.update({ login_attempts: 0, lock_until: null });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const avatar_url = user.avatar
            ? `${process.env.APP_URL || 'http://localhost:3001'}/files/${user.avatar}`
            : null;

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar_url
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (String(id) === '1') {
            return res.status(403).json({ message: 'A senha do administrador principal não pode ser alterada.' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'A senha deve conter no mínimo 6 caracteres.' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await user.update({ password: hashedPassword });

        return res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao atualizar senha do usuário' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'name', 'email', 'role', 'avatar']
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const userJson = user.toJSON();
        userJson.avatar_url = user.avatar
            ? `${process.env.APP_URL || 'http://localhost:3001'}/files/${user.avatar}`
            : null;

        res.json(userJson);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
};

const updateProfile = async (req, res) => {
    try {
        if (req.userId === 1) {
            return res.status(403).json({
                message: 'Permissão negada. Os dados do Administrador Master não podem ser alterados.'
            });
        }

        const { name, currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (name) {
            user.name = name;
        }

        if (newPassword) {
            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'A nova senha deve ter no mínimo 6 caracteres.' });
            }

            if (!currentPassword) {
                return res.status(400).json({ message: 'A senha atual é obrigatória para definir uma nova' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'A senha atual está incorreta' });
            }

            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).json({ message: 'A nova senha não pode ser igual à senha atual' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        const avatar_url = user.avatar
            ? `${process.env.APP_URL || 'http://localhost:3001'}/files/${user.avatar}`
            : null;

        res.json({
            message: 'Perfil atualizado com sucesso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar_url
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
};

const updateAvatar = async (req, res) => {
    try {
        if (req.userId === 1) {
            return res.status(403).json({
                message: 'O avatar do Administrador Master não pode ser alterado.'
            });
        }

        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (user.avatar) {
            const oldAvatarPath = path.resolve(__dirname, '..', '..', 'uploads', user.avatar);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        user.avatar = req.file.filename;
        await user.save();

        const avatar_url = `${process.env.APP_URL || 'http://localhost:3001'}/files/${user.avatar}`;

        res.json({
            message: 'Avatar atualizado com sucesso',
            avatar_url
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao processar upload' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'O e-mail é obrigatório para prosseguir.' });
        }

        const sanitizedEmail = email.trim().toLowerCase();

        if (sanitizedEmail === 'admin@admin.com') {
            return res.status(403).json({
                message: 'Não é possível redefinir a senha do administrador master do sistema.'
            });
        }

        const user = await User.findOne({ where: { email: sanitizedEmail } });

        if (!user) {
            return res.status(404).json({ message: 'Este e-mail não foi encontrado em nossa base de dados.' });
        }

        if (user.id === 1) {
            return res.status(403).json({
                message: 'Não é possível redefinir a senha do administrador master do sistema.'
            });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        await user.update({
            password_reset_token: token,
            password_reset_expires: expires
        });

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: sanitizedEmail,
                subject: 'Recuperação de Senha - eByte',
                html: `
                    <div style="font-family: sans-serif; color: #113247; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #113247; border-bottom: 2px solid #0D6EFD; padding-bottom: 10px;">eByte - Sistemas de Informação</h2>
                        <p style="font-size: 16px;">Olá, <strong>${user.name}</strong>.</p>
                        <p style="font-size: 16px;">Recebemos uma solicitação para redefinir a senha da sua conta no sistema <strong>eByte</strong>.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" 
                               style="display: inline-block; background-color: #113247; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
                               Redefinir Minha Senha
                            </a>
                        </div>
                        <p style="color: #666; font-size: 14px; background-color: #F8FAFB; padding: 10px; border-radius: 4px;">
                            ⚠️ Este link é válido por 1 hora.
                        </p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #999; text-align: center;">Se você não solicitou isso, ignore este e-mail.</p>
                    </div>
                `
            });

            return res.status(200).json({
                message: 'Instruções enviadas com sucesso! Verifique sua caixa de entrada.'
            });
        } catch (mailError) {
            console.error('Erro no envio do e-mail:', mailError);
            return res.status(500).json({
                message: 'Erro ao enviar o e-mail de recuperação. Tente novamente em instantes.'
            });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Erro interno ao processar a recuperação. Tente novamente mais tarde.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'O token de recuperação é obrigatório.' });
        }

        const user = await User.findOne({
            where: {
                password_reset_token: token
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou já utilizado.' });
        }

        if (new Date() > user.password_reset_expires) {
            return res.status(400).json({ message: 'O link de recuperação expirou. Solicite um novo.' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'A senha deve conter no mínimo 6 caracteres.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await user.update({
            password: hashedPassword,
            password_reset_token: null,
            password_reset_expires: null,
            login_attempts: 0,
            lock_until: null
        });

        return res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno ao redefinir a senha.' });
    }
};

module.exports = {
    login,
    getProfile,
    updateProfile,
    updateAvatar,
    updateUserPassword,
    forgotPassword,
    resetPassword
};