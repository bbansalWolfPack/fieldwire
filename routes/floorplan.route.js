const express = require('express');
const router = express.Router({mergeParams: true});
const upload = require('../middleware/upload.middleware');
const validator = require('../validators/project.validator');
const FloorplanController = require('../controllers/floorplan.controller');

/**
* @api {GET} /api/v1/projects/:id/floorplans Get all floorplans for a given project
* @apiName Get all floorplans
* @apiGroup Floorplans
*
* @apiSuccess (200) {Object} success message
*/
router.get('/', FloorplanController.getAllFloorPlansForGivenProject);

/**
* @api {GET} /api/v1/projects/:id/floorplans/:floorplanId Get specific floorplan for a given project
* @apiName Get specific floorplan
* @apiGroup Floorplans
*
* @apiSuccess (200) {Object} success message
*/
router.get('/:floorplanId', FloorplanController.getSpecificFloorplanForGivenProject);

/**
* @api {DELETE} /api/v1/projects/:id/floorplans/:floorplanId Delete specific floorplan for a given project
* @apiName Delete specific floorplan
* @apiGroup Floorplans
*
* @apiSuccess (200) {Object} success message
*/
router.delete('/:floorplanId', FloorplanController.deleteSpecificFloorplanForGivenProject);

/**
* @api {POST} /api/v1/projects/:id/floorplans Add floorplan for a given project
* @apiName Add floorplan
* @apiGroup Floorplans
* Note: We can upload multiple too use upload.any.
* @apiSuccess (200) {Object} success message
*/
router.post('/', upload.single('file'), FloorplanController.createFloorplanForGivenProject)

/**
* @api {PATCH} /api/v1/projects/:id/floorplans/:floorplanId Update floorplan
* @apiName Update floorplan
* @apiGroup Floorplans
* @apiSuccess (200) {Object} success message
*/
router.post('/', upload.single('file'), FloorplanController.createFloorplanForGivenProject)


module.exports = router;