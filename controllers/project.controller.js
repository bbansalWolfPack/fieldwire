const { validationResult } = require("express-validator");
const ProjectService = require("../services/project.service");
const ProjectHelper = require("../helpers/project.helper");
const ResponseHelper = require("../helpers/construct-response-objects");

let ProjectController = {
  getAllProjects: async (_req, res) => {
    try {
      const allProjects = await ProjectService.findAllProjects();
      res.send(ProjectHelper.createAllProjectsResponse(allProjects));
    } catch (error) {
      res.send(
        ResponseHelper.getErrorResponse(error.statusCode, error.message)
      );
    }
  },

  getProjectById: async (req, res, next) => {
    try {
      const project = await ProjectService.findProjectById(req.params.id);
      res.send(ProjectHelper.createProjectResponse(project));
    } catch (error) {
      next(error);
    }
  },

  postProject: async (req, res) => {
    const validationResults = validationResult(req);
    if (!validationResults.isEmpty()) {
      res
        .status(404)
        .send(ResponseHelper.getErrorResponse(validationResults.errors[0].msg));
      return;
    }
    const projectName = req.body.name;
    try {
      const project = await ProjectService.createAndSaveProject(projectName);
      res.send(ProjectHelper.createProjectResponse(project));
    } catch (error) {
      res
        .status(error.statusCode)
        .send(ResponseHelper.getErrorResponse(error.message));
    }
  },

  deleteProjectById: async (req, res) => {
    const projectId = req.params.id;
    try {
      await ProjectService.deleteProjectById(projectId);
      res.status(200).send({
        message: `Project with id: ${projectId} deleted Succesfully`,
      });
    } catch (error) {
      res.send(
        ResponseHelper.getErrorResponse(error.statusCode, error.message)
      );
    }
  },

  patchProject: async (req, res) => {
    const validationResults = validationResult(req);
    if (!validationResults.isEmpty()) {
      res.send(
        ResponseHelper.getErrorResponse(404, validationResults.errors[0].msg)
      );
      return;
    }
    const projectId = req.params.id;
    const newProjectName = req.body.name;

    try {
      const updatedProject = await ProjectService.patchProjectAndSave(
        projectId,
        newProjectName
      );
      res.status(200).send(ProjectHelper.createProjectResponse(updatedProject));
    } catch (error) {
      res
        .status(error.statusCode)
        .send(ResponseHelper.getErrorResponse(error.message));
    }
  },
};

module.exports = ProjectController;
