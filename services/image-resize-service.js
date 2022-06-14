const sharp = require("sharp");

async function resizeImage(imageBuffer, width, height) {
  try {
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: width,
        height: height
      }).toBuffer();
    return resizedImageBuffer
  } catch (error) {
    throw error;
  }
}

module.exports = resizeImage;