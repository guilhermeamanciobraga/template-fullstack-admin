const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
const sequelize = require('./src/config/database');
const User = require('./src/models/User');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', express.static(path.resolve(__dirname, 'uploads')));

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL conectado');

        await sequelize.sync({ alter: true });
        console.log('Tabelas sincronizadas');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminExists = await User.findOne({ where: { email: adminEmail } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await User.create({
                name: 'Admin Master',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                active: true
            });
            console.log('Usuario admin master criado');
        }
    } catch (error) {
        console.error('Erro MySQL:', error.message);
    }
};

syncDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/admin', userRoutes);

app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        const count = await User.count();
        res.json({
            status: "Online",
            database: "Conectado",
            usuarios_no_banco: count
        });
    } catch (error) {
        res.status(500).json({
            status: "Erro",
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Porta: ${PORT}`);
});