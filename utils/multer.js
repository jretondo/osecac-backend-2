const path = require('path');
const multer = require('multer');

const uploadFile = (folderDest) => {

    const storage = multer.diskStorage({
        destination: folderDest,
        filename: (req, file, cb) => {
            cb(null, file.fieldname);
        }
    })
    const upload = multer({
        storage,
    }).any();

    return upload
}

module.exports = uploadFile