const S3Helper = require("../helpers/s3.helper");
const S3Service = require("../services/aws-service");

const createFloorPlanObject = (floorplan) => {
  return {
    id: floorplan._id,
    name: floorplan.name,
    originalImageUrl: floorplan.originalImageUrl,
    thumbnailImageUrl: floorplan.thumbnailImageUrl,
    largeSizeImageUrl: floorplan.largeSizeImageUrl,
  };
};

const createFloorPlanResponse = (floorplan) => {
  return {
    floorplan: createFloorPlanObject(floorplan),
  };
};

const createAllFloorplanResponse = (floorplans) => {
  const allFloorplans = [];
  floorplans.forEach((floorplan) => {
    allFloorplans.push(createFloorPlanObject(floorplan));
  });

  return {
    floorplans: allFloorplans,
  };
};

const generateAllFloorplanData = (
  originalFloorplanName,
  originalFloorplanBuffer,
  thumbnailImageBuffer,
  largeImageBuffer
) => {
  return {
    originalImage: {
      fileName: originalFloorplanName,
      fileBuffer: originalFloorplanBuffer,
    },

    thumbnailImage: {
      fileName: `thumbnail-${originalFloorplanName}`,
      fileBuffer: thumbnailImageBuffer,
    },
    largeImage: {
      fileName: `large-${originalFloorplanName}`,
      fileBuffer: largeImageBuffer,
    },
  };
};

const generateAllFloorplanS3Params = (allFloorplanData) => {
  return {
    originalImageParams: S3Helper.generateS3Params(
      allFloorplanData.originalImage.fileName,
      allFloorplanData.originalImage.fileBuffer
    ),
    thumbnailImageParams: S3Helper.generateS3Params(
      allFloorplanData.thumbnailImage.fileName,
      allFloorplanData.thumbnailImage.fileBuffer
    ),
    largeImageParams: S3Helper.generateS3Params(
      allFloorplanData.largeImage.fileName,
      allFloorplanData.largeImage.fileBuffer
    ),
  };
};

const createFloorplanObject = async (
  originalFileName,
  allFloorplansS3Parameters
) => {
  return {
    name: originalFileName,
    originalImageUrl: (
      await S3Service.uploadFile(allFloorplansS3Parameters.originalImageParams)
    ).Location,
    thumbnailImageUrl: (
      await S3Service.uploadFile(allFloorplansS3Parameters.thumbnailImageParams)
    ).Location,
    largeSizeImageUrl: (
      await S3Service.uploadFile(allFloorplansS3Parameters.largeImageParams)
    ).Location,
  };
};

module.exports = {
  createFloorPlanObject,
  createFloorPlanResponse,
  createAllFloorplanResponse,
  generateAllFloorplanData,
  generateAllFloorplanS3Params,
  createFloorplanObject,
};
