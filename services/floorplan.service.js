const FloorPlanModel = require("../models/floorplan.model");
const ProjectModel = require("../models/project.model");
const mongoose = require("mongoose");
const CustomError = require("../helpers/custom-error");
const S3Service = require("../services/aws-service");
const S3Helper = require("../helpers/s3.helper");
const ProjectService = require("../services/project.service");
const resizeImage = require("../services/image-resize-service");
const FloorplanHelper = require("../helpers/floorplan.helper");
const floorplanModel = require("../models/floorplan.model");

const doesFloorplanAlreadyExists = async (floorplanName) => {
  try {
    const floorplans = await FloorPlanModel.find({ name: floorplanName });
    return floorplans.length > 0;
  } catch (error) {
    throw error;
  }
};

const createFloorplan = async (floorplan) => {
  const createdFloorplan = await FloorPlanModel.create(floorplan);
  return createdFloorplan;
};

const findAllFloorplans = async (projectId) => {
  try {
    const project = await ProjectService.findProjectById(projectId);
    return project.floorPlans;
  } catch (error) {
    throw error;
  }
};

const findFloorplanById = async (projectId, floorplanId) => {
  try {
    const isValidId = mongoose.isValidObjectId(floorplanId);
    if (isValidId) {
      let modifiedFloorplanId = mongoose.Types.ObjectId(floorplanId);
      const project = await ProjectService.findProjectById(projectId);
      if (project) {
        // if project by given id exists, we need to check if given floorplan belongs to the project?
        const floorplans = project.floorPlans;
        const floorplanInProjectWithMatchingId = floorplans.filter(
          (plan) => plan.id == modifiedFloorplanId
        );
        if (floorplanInProjectWithMatchingId.length > 0) {
          return floorplanInProjectWithMatchingId[0];
        }
        throw new CustomError(
          404,
          `Floorplan with id:  ${floorplanId} is not found`
        );
      }
    }
    throw new CustomError(
      400,
      `Floorplan with id: ${floorplanId} is not valid`
    );
  } catch (error) {
    if (error.statusCode !== 500) {
      throw error;
    }
    throw new CustomError(
      500,
      `Internal server error: Unable to find floorplan`
    );
  }
};

const deleteFloorplanById = async (projectId, floorplanId) => {
  let modifiedFloorplanId = mongoose.Types.ObjectId(floorplanId);
  try {
    const isValidId = mongoose.isValidObjectId(floorplanId);
    if (isValidId) {
      const project = await ProjectService.findProjectById(projectId);
      if (project) {
        // if project by given id exists, we need to check if given floorplan belongs to the project?
        const floorplans = project.floorPlans;
        const floorplanInProjectWithMatchingId = floorplans.filter(
          (plan) => plan.id == modifiedFloorplanId
        );
        if (floorplanInProjectWithMatchingId.length > 0) {
          const floorplan = floorplanInProjectWithMatchingId[0];
          await floorplan.remove();
          await ProjectService.removeFloorplanFromProject(
            projectId,
            floorplanId
          );
          return;
        }
        throw new CustomError(
          404,
          `Floorplan with id:  ${floorplanId} is not found`
        );
      }
    }
    throw new CustomError(
      400,
      `Floorplan with id: ${floorplanId} is not valid`
    );
  } catch (error) {
    if (error.statusCode !== 500) {
      throw error;
    }
    throw new CustomError(
      500,
      `Internal server error: Unable to find floorplan`
    );
  }
};

const addFloorplan = async (floorplanName, projectId, floorplan) => {
  const originalFileBuffer = floorplan.buffer;
  try {
    const project = await ProjectService.findProjectById(projectId);
    if (project) {
      const floorplanExists = await doesFloorplanAlreadyExists(floorplanName);
      if (!floorplanExists) {
        // generate image buffers for thumbnail and large image
        const thumbnailImageBuffer = await resizeImage(
          originalFileBuffer,
          100,
          100
        );
        const largeImageBuffer = await resizeImage(
          originalFileBuffer,
          2000,
          2000
        );

        const allFloorplans = FloorplanHelper.generateAllFloorplanData(
          floorplanName,
          originalFileBuffer,
          thumbnailImageBuffer,
          largeImageBuffer
        );

        const allFloorplansS3Parameters =
          FloorplanHelper.generateAllFloorplanS3Params(allFloorplans);

        const floorplan = await FloorplanHelper.createFloorplanObject(
          floorplanName,
          allFloorplansS3Parameters
        );

        const floorplanModel = await createFloorplan(floorplan);
        await ProjectService.addFloorplanToProject(projectId, floorplanModel);
        return floorplanModel;
      }
      throw new CustomError(400, `Floorplan with given name already exists`);
    }
  } catch (error) {
    throw error;
  }
};

const updateFloorplan = async (
  floorplanId,
  floorplanName,
  projectId,
  floorplan
) => {
  const originalFileBuffer = floorplan.buffer;
  try {
    // if floorplan with given id does not exist, we can't update it
    const floorplanWithId = await findFloorplanById(projectId, floorplanId);
    if (floorplanWithId) {
      const floorplanExistsByGivenName = await doesFloorplanAlreadyExists(
        floorplanName
      );
      if (!floorplanExistsByGivenName) {
        // generate image buffers for thumbnail and large image
        const thumbnailImageBuffer = await resizeImage(
          originalFileBuffer,
          100,
          100
        );
        const largeImageBuffer = await resizeImage(
          originalFileBuffer,
          2000,
          2000
        );

        const allFloorplans = FloorplanHelper.generateAllFloorplanData(
          floorplanName,
          originalFileBuffer,
          thumbnailImageBuffer,
          largeImageBuffer
        );

        const allFloorplansS3Parameters =
          FloorplanHelper.generateAllFloorplanS3Params(allFloorplans);

        const floorplan = await FloorplanHelper.createFloorplanObject(
          floorplanName,
          allFloorplansS3Parameters
        );

        await floorplanModel.updateOne({ id: floorplanId }, floorplan);
        const updatedFloorplan = await findFloorplanById(
          projectId,
          floorplanId
        );
        return updatedFloorplan;
      }
      throw new CustomError(400, `Floorplan with given name already exists`);
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findAllFloorplans,
  findFloorplanById,
  addFloorplan,
  deleteFloorplanById,
  updateFloorplan,
};
