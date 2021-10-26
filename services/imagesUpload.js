require('dotenv').config();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const s3 = new aws.S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('bad file extension'));
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = path.basename(file.originalname);
      const extension = path.extname(file.originalname);
      cb(null, `${path.basename(fileName, extension)}-${Date.now()}${extension}`);
    },
  }),
  fileFilter: fileFilter,
});

const uploadImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'secImages' }
]);

module.exports = {
  upload,
  uploadImages,
};
