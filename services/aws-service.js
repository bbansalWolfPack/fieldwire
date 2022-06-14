const Aws = require("aws-sdk");

const s3 = new Aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
});

const uploadFile = async (params) => {
  try {
    return s3.upload(params).promise();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  uploadFile,
};
