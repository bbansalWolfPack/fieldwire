const FloorplanService = require("../services/floorplan.service");
const FloorplanHelper = require("../helpers/floorplan.helper");
const ResponseHelper = require("../helpers/construct-response-objects");

let FloorplanController = {
  getAllFloorPlansForGivenProject: async (req, res) => {
    const projectId = req.params.id;
    try {
      const allFloorplansForGivenProject =
        await FloorplanService.findAllFloorplans(projectId);
      res
        .status(200)
        .send(
          FloorplanHelper.createAllFloorplanResponse(
            allFloorplansForGivenProject
          )
        );
    } catch (error) {
      res
        .status(error.statusCode)
        .send(ResponseHelper.getErrorResponse(error.message));
    }
  },

  getSpecificFloorplanForGivenProject: async (req, res) => {
    const floorplanId = req.params.floorplanId;
    const projectId = req.params.id;
    try {
      const result = await FloorplanService.findFloorplanById(
        projectId,
        floorplanId
      );
      let responseObject = FloorplanHelper.createFloorPlanResponse(result);
      res.status(200).send(responseObject);
    } catch (error) {
      res
        .status(error.statusCode)
        .send(ResponseHelper.getErrorResponse(error.message));
    }
  },

  deleteSpecificFloorplanForGivenProject: async (req, res) => {
    const floorplanId = req.params.floorplanId;
    const projectId = req.params.id;

    try {
      await FloorplanService.deleteFloorplanById(projectId, floorplanId);
      res
        .status(200)
        .send(
          ResponseHelper.getErrorResponse(
            `Floorplan with id: ${floorplanId} deleted Succesfully`
          )
        );
    } catch (error) {
      res
        .status(error.statusCode)
        .send(ResponseHelper.getErrorResponse(error.message));
    }
  },

  createFloorplanForGivenProject: async (req, res) => {
    const projectId = req.params.id;
    const floorplan = req.file;
    const floorplanName =
      req.body.name || floorplan.originalname.replace(/\.[^/.]+$/, "");
    if (!floorplan) {
      res.status(400).send("Floorplan missing from request body");
      return;
    } else {
      try {
        const result = await FloorplanService.addFloorplan(
          floorplanName,
          projectId,
          floorplan
        );
        res.status(200).send(FloorplanHelper.createFloorPlanResponse(result));
      } catch (error) {
        res
          .status(error.statusCode)
          .send(ResponseHelper.getErrorResponse(error.message));
      }
    }
  },

  updateFloorplanForGivenProject: async (req, res) => {
    const projectId = req.params.id;
    const floorplanId = req.params.floorplanId;
    const floorplan = req.file;
    const floorplanName =
      req.body.name || floorplan.originalname.replace(/\.[^/.]+$/, "");
    if (!floorplan) {
      res.status(400).send("Floorplan missing from request body");
      return;
    } else {
      try {
        const result = await FloorplanService.updateFloorplan(
          floorplanId,
          floorplanName,
          projectId,
          floorplan
        );
        res.status(200).send(FloorplanHelper.createFloorPlanResponse(result));
      } catch (error) {
        res
          .status(error.statusCode)
          .send(ResponseHelper.getErrorResponse(error.message));
      }
    }
  },
};

module.exports = FloorplanController;
