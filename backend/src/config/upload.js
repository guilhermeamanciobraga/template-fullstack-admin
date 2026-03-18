const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadConfig = {
    directory: path.resolve(__dirname, '..', '..', 'uploads'),
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (request, file, callback) => {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;
            return callback(null, fileName);
        },
    }),
};

module.exports = uploadConfig;