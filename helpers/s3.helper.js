const generateS3Params = (fileName, fileBuffer) => {
    return {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}-${fileName}`,
        Body: fileBuffer,
        ACL: "public-read-write",
        ContentType: "image/jpeg"
    }
}

module.exports = {
    generateS3Params 
}