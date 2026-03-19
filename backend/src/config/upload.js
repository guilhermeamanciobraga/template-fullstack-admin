const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const uploadConfig = {
    directory: path.resolve(__dirname, '..', '..', 'uploads'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const rootPath = path.resolve(__dirname, '..', '..', 'uploads');
            const folder = req.url.includes('system-images')
                ? path.resolve(rootPath, 'logo-favicon')
                : rootPath;

            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;
            return cb(null, fileName);
        },
    }),
};

module.exports = uploadConfig;