const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

module.exports = {
    async index(req, res) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email', 'role', 'active', 'avatar'],
                order: [['name', 'ASC']]
            });
            return res.json(users);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar usuários' });
        }
    },

    async store(req, res) {
        const { name, email, password, role } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Formato de e-mail inválido' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'A senha deve conter no mínimo 6 caracteres.' });
        }

        try {
            const userExists = await User.findOne({ where: { email } });
            if (userExists) return res.status(400).json({ error: 'E-mail já cadastrado' });

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                name,
                email,
                password: hashedPassword,
                role,
                active: true
            });

            return res.status(201).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    },

    async updatePassword(req, res) {
        try {
            const { id } = req.params;
            const { password } = req.body;

            if (String(id) === '1') {
                return res.status(403).json({
                    error: 'A senha do administrador principal não pode ser alterada por este menu.'
                });
            }

            if (!password || password.length < 6) {
                return res.status(400).json({ error: 'A senha deve conter no mínimo 6 caracteres.' });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await user.update({ password: hashedPassword });

            return res.json({ message: 'Senha atualizada com sucesso' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar senha do usuário' });
        }
    },

    async updateStatus(req, res) {
        const { id } = req.params;
        const { active } = req.body;

        if (String(id) === '1') {
            return res.status(403).json({ error: 'O administrador principal não pode ser desativado' });
        }

        try {
            await User.update({ active }, { where: { id } });
            return res.send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao mudar status' });
        }
    },

    async delete(req, res) {
        const { id } = req.params;

        if (String(id) === '1') {
            return res.status(403).json({ error: 'O administrador principal não pode ser excluído' });
        }

        try {
            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            if (user.avatar) {
                const avatarPath = path.resolve(__dirname, '..', '..', 'uploads', user.avatar);
                if (fs.existsSync(avatarPath)) {
                    fs.unlinkSync(avatarPath);
                }
            }

            await user.destroy();

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao excluir' });
        }
    }
};