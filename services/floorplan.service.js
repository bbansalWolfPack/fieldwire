const FloorPlanModel = require('../models/floorplan.model');
const ProjectModel = require('../models/project.model');
const mongoose = require('mongoose');
const CustomError = require('../helpers/custom-error');
const S3Service = require('../services/aws-service');
const S3Helper = require('../helpers/s3.helper');
const ProjectService = require('../services/project.service');
const resizeImage = require('../services/image-resize-service');

const createFloorplan = async (floorplan) => {
    const createdFloorplan = await FloorPlanModel.create(floorplan);
    return createdFloorplan;
}

const findAllFloorplans = async (projectId) => {
    let project;
    try {
        const id = mongoose.Types.ObjectId(projectId);
        project = await ProjectModel.findById(id).populate('floorPlans');
        return project.floorPlans;
    } catch(error) {
        if (!project) {
            throw new CustomError(404, `Invalid Project id: ${projectId}`);
        }
        throw new CustomError(500, `Unable to find floorplans for project with id: ${projectId}`);
    }
}

const findFloorplan = async (projectId, floorplanId) =>  {
    let project;
    let floorplan;
    let modifiedProjectId =  mongoose.Types.ObjectId(projectId);
    let modifiedFloorplanId = mongoose.Types.ObjectId(floorplanId);
    let floorplanExists = true;
    try {
        project = await ProjectModel.findById(modifiedProjectId).populate('floorPlans');
        if (project) {
            floorplanExists = project.floorPlans.filter(plan => plan.id == modifiedFloorplanId).length > 0;
            if (floorplanExists) {
                floorplan = await FloorPlanModel.findById(modifiedFloorplanId);
                if (floorplan) {
                    return floorplan;
                }
                throw "invalid request";
            }
            throw "invalid request";
        }
        throw "invalid request";
    } catch (error) {
        if (!project) {
            throw new CustomError(400, `Invalid Project id: ${projectId}`);
        }
        if (!floorplanExists) {
            throw new CustomError(400, `Floorplan with id: ${floorplanId} does not exist for given project id: ${projectId}`);
        }
        if (!floorplan) {
            throw new CustomError(400, `Invalid Floorplan id: ${floorplanId}`);
        }
        throw new CustomError(500, `Unable to find floorplan with id: ${floorplanId}`);
    }
}

const deleteFloorplanById = async (projectId, floorplanId) => {
    let project;
    let floorplan;
    let modifiedProjectId =  mongoose.Types.ObjectId(projectId);
    let modifiedFloorplanId = mongoose.Types.ObjectId(floorplanId);
    let floorplanExists = true;

    try {
        project = await ProjectModel.findById(modifiedProjectId).populate('floorPlans');
        if (project) {
            floorplanExists = project.floorPlans.filter(plan => plan.id == modifiedFloorplanId).length > 0;
            if (floorplanExists) {
                floorplan = await FloorPlanModel.findById(modifiedFloorplanId);
                if (floorplan) {
                    // first delete the floorplan
                    // second update project and remove floorplan reference
                    await floorplan.remove();
                    await ProjectService.removeFloorplanFromProject(projectId, floorplanId);
                    return;
                }
                throw "invalid request";
            }
            throw "invalid request";
        }
        throw "invalid request";
    } catch (error) {
        if (!project) {
            throw new CustomError(400, `Invalid Project id: ${projectId}`);
        }
        if (!floorplanExists) {
            throw new CustomError(400, `Floorplan with id: ${floorplanId} does not exist for given project id: ${projectId}`);
        }
        if (!floorplan) {
            throw new CustomError(400, `Invalid Floorplan id: ${floorplanId}`);
        }
        throw new CustomError(500, `Unable to delete floorplan with id: ${floorplanId}`);
    }
}

const addFloorplan = async (projectId, originalFile) => {
    const originalFileName = originalFile.originalname;
    const originalFileBuffer = originalFile.buffer;
    const thumbnailImageName = `thumbnail-${originalFileName}`;
    const largeSizeImageName = `large-${originalFileName}`;

    const id = mongoose.Types.ObjectId(projectId);
    let project;
    let existingFloorplan;
    try {
        project = await ProjectModel.findById(id).populate('floorPlans');
        if (project) {
            existingFloorplan = await FloorPlanModel.find({ name: originalFileName });
            if (existingFloorplan.length == 0) {
                const thumbnailImageBuffer = await resizeImage(originalFileBuffer, 100, 100);
                const largeImageBuffer = await resizeImage(originalFileBuffer, 2000, 2000);
                const originalImageParams = S3Helper.generateS3Params(originalFileName, originalFileBuffer);
                const thumbnailImageParams = S3Helper.generateS3Params(thumbnailImageName, thumbnailImageBuffer);
                const largeImageParams = S3Helper.generateS3Params(largeSizeImageName, largeImageBuffer);
                const floorplan = {
                    name: originalFileName,
                    originalImageUrl: (await S3Service.uploadFile(originalImageParams)).Location,
                    thumbnailImageUrl: (await S3Service.uploadFile(thumbnailImageParams)).Location,
                    largeSizeImageUrl: (await S3Service.uploadFile(largeImageParams)).Location
                };
                const floorplanModel = await createFloorplan(floorplan);
                await ProjectService.addFloorplanToProject(projectId, floorplanModel);
                return floorplanModel;
            } else {
                throw "invalid request";
            }
        }
    } catch (error) {
        if (!project) {
            throw new CustomError(400, `Invalid Project id: ${projectId}`);
        }
        if (existingFloorplan.length > 0) {
            throw new CustomError(400, `Floorplan already exists and is tied to a project`);
        }
        throw new CustomError(500, `Unable to add floorplan for project with id: ${projectId}`);
    }
}

module.exports = {
    findAllFloorplans,
    findFloorplan,
    addFloorplan,
    deleteFloorplanById
}