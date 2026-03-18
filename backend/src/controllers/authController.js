const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'E-mail não cadastrado' });
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

        res.json({
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'name', 'email', 'role']
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (name) {
            user.name = name;
        }

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'A senha atual é obrigatória para definir uma nova' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'A senha atual está incorreta' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        res.json({
            message: 'Perfil atualizado com sucesso',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
};

module.exports = { login, getProfile, updateProfile };