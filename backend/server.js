const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./src/config/prisma');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
    try {
        const count = await prisma.user.count();
        res.json({
            status: "Online",
            database: "Conectado",
            usuarios_no_banco: count
        });
    } catch (error) {
        res.status(500).json({
            status: "Erro",
            message: "Nao consegui falar com o MySQL",
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Teste o banco aqui: http://localhost:${PORT}/health`);
});