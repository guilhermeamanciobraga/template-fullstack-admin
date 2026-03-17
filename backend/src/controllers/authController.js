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
            const attempts = user.login_attempts + 1;
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

module.exports = { login };