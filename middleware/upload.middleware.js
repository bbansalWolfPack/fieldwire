const multer = require("multer");

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
       cb(new Error("Unsupported File type"), false);
    }
}

// we only allow formats: jpeg, jpg, and png. File size is limited to 2 MB
var upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 2000000 }});

module.exports = upload;