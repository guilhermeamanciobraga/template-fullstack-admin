const SystemImage = require('../models/SystemImage');
const fs = require('fs');
const path = require('path');

class SystemImageController {
    async store(req, res) {
        const { type } = req.params;
        const { filename: pathName } = req.file;

        if (!['logo', 'favicon'].includes(type)) {
            return res.status(400).json({ error: 'Tipo de imagem inválido.' });
        }

        try {
            const existingImage = await SystemImage.findOne({ where: { type } });

            if (existingImage) {
                const oldFilePath = path.resolve(__dirname, '..', '..', 'uploads', 'logo-favicon', existingImage.path);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                existingImage.path = pathName;
                await existingImage.save();
                return res.json(existingImage);
            }

            const newImage = await SystemImage.create({
                type,
                path: pathName,
            });

            return res.json(newImage);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao salvar imagem no sistema.' });
        }
    }

    async index(req, res) {
        try {
            const images = await SystemImage.findAll();
            return res.json(images);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar imagens.' });
        }
    }
}

module.exports = new SystemImageController();