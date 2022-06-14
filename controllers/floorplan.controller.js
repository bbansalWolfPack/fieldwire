const FloorplanService = require('../services/floorplan.service');
const FloorplanHelper = require('../helpers/floorplan.helper');
const ResponseHelper = require('../helpers/construct-response-objects');

let FloorplanController = {
    getAllFloorPlansForGivenProject: async (req, res) => {
        const projectId = req.params.id;
        try {
            const allFloorplansForGivenProject = await FloorplanService.findAllFloorplans(projectId);
            res.send(FloorplanHelper.createAllFloorplanResponse(allFloorplansForGivenProject));
        } catch(error) {
            res.send(ResponseHelper.getErrorResponse(error.statusCode, error.message));
        }
    },

    getSpecificFloorplanForGivenProject: async (req, res) => {
        const floorplanId = req.params.floorplanId;
        const projectId = req.params.id;
        try {
            const result = await FloorplanService.findFloorplan(projectId, floorplanId);
            let responseObject = FloorplanHelper.createFloorPlanResponse(result);
            responseObject = {
                statusCode: responseObject.statusCode,
                projectId,
                data: responseObject.data
            }
            res.send(responseObject);
        } catch (error) {
            res.send(ResponseHelper.getErrorResponse(error.statusCode, error.message));
        }
    },

    deleteSpecificFloorplanForGivenProject: async (req, res) => {
        const floorplanId = req.params.floorplanId;
        const projectId = req.params.id;

        try {
            await FloorplanService.deleteFloorplanById(projectId, floorplanId);
            res.send({
                statusCode: 200,
                message: `Floorplan with id: ${floorplanId} deleted Succesfully`
            });
        } catch (error) {
            res.send(ResponseHelper.getErrorResponse(error.statusCode, error.message));
        }
    },

    createFloorplanForGivenProject: async (req, res) => {
        const projectId = req.params.id;
        const file = req.file;
        if (!file) {
            res.send(ResponseHelper.getErrorResponse(400, "Floorplan image missing from request body"));
            return;
        } else {
            try {
                const result = await FloorplanService.addFloorplan(projectId, file);
                res.send(FloorplanHelper.createFloorPlanResponse(result));
            } catch (error) {
                res.send(ResponseHelper.getErrorResponse(error.statusCode, error.message));
            }
        }
    }
}

module.exports = FloorplanController;