const ProjectModel = require("../models/project.model");
const mongoose = require("mongoose");
const CustomError = require("../helpers/custom-error");

const addFloorplanToProject = async (projectId, floorplan) => {
  await ProjectModel.findByIdAndUpdate(
    projectId,
    { $push: { floorPlans: floorplan._id } },
    { new: true, useFindAndModify: false }
  );
};

const removeFloorplanFromProject = async (projectId, floorplanId) => {
  await ProjectModel.updateOne(
    { id: projectId },
    { $pull: { floorPlans: floorplanId } }
  );
};

const createAndSaveProject = async (projectName) => {
  try {
    const result = await ProjectModel.create({
      name: projectName,
    });
    return result;
  } catch (error) {
    const errorMessage =
      error.code === 11000
        ? `Project by name ${projectName} already exists`
        : error.message;
    const statusCode = error.code === 11000 ? 404 : 500;
    throw new CustomError(statusCode, errorMessage);
  }
};

const findAllProjects = async () => {
  try {
    return ProjectModel.find().populate("floorPlans");
  } catch (error) {
    throw new CustomError(
      500,
      `Internal server error: Unable to find projects`
    );
  }
};

const findProjectById = async (projectId) => {
  try {
    const isValidId = mongoose.isValidObjectId(projectId);
    if (isValidId) {
      const result = await ProjectModel.findById(projectId).populate(
        "floorPlans"
      );
      if (result) {
        return result;
      }
      throw new CustomError(404, `Project with id: ${projectId} is not found`);
    }
    throw new CustomError(400, `Project with id: ${projectId} is invalid`);
  } catch (error) {
    if (error.statusCode !== 500) {
      throw error;
    }
    throw new CustomError(500, `Internal Server Error: Unable to find project`);
  }
};

const deleteProjectById = async (projectId) => {
  try {
    const project = await ProjectModel.findById(projectId);
    if (project) {
      project.remove();
    } else {
      throw new CustomError(
        404,
        `Project with id: ${projectId} does not exist`
      );
    }
  } catch (error) {
    throw new CustomError(500, `Error deleting project: ${error.message}`);
  }
};

const patchProjectAndSave = async (projectId, newProjectName) => {
  try {
    const result = await ProjectModel.findByIdAndUpdate(
      projectId,
      { name: newProjectName },
      { new: true }
    ).populate("floorPlans");
    if (result) {
      return result;
    }
    throw new CustomError(404, `Project with id: ${projectId} does not exist`);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      throw new CustomError(400, `Invalid project ID`);
    }
    if (error.statusCode !== 500) {
      throw error;
    }
    throw new CustomError(500, `Error updating project: ${error.message}`);
  }
};

module.exports = {
  createAndSaveProject,
  findAllProjects,
  findProjectById,
  deleteProjectById,
  patchProjectAndSave,
  addFloorplanToProject,
  removeFloorplanFromProject,
};
