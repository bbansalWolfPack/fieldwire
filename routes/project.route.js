const express = require("express");
const ProjectController = require("../controllers/project.controller");
const router = express.Router();
const validator = require("../validators/project.validator");

const floorplanRouter = require("./floorplan.route");

/**
 * @api {GET} /api/v1/projects Get all projects
 * @apiName Get all projects
 * @apiGroup Projects
 *
 * @apiSuccess (200) {Object} success message
 */
router.get("/", ProjectController.getAllProjects);

/**
 * @api {GET} /api/v1/projects/:id Get project
 * @apiName Get project with given id
 * @apiGroup Projects
 *
 * @apiSuccess (200) {Object} success message
 */
router.get("/:id", ProjectController.getProjectById);

/**
 * @api {post} /api/v1/projects Create project
 * @apiName Create new project
 * @apiGroup Projects
 *
 * @apiParam  {String} [name] name
 * @apiSuccess (200) {Object} success message
 */
router.post(
  "/",
  validator.validateProjectRequest,
  ProjectController.postProject
);

/**
 * @api {DELETE} /api/v1/projects/:id Delete project
 * @apiName Delete project with given ID
 * @apiGroup Projects
 *
 * @apiSuccess (200) {Object} success message
 */
router.delete("/:id", ProjectController.deleteProjectById);

/**
 * @api {PATCH} /api/v1/projects/:id PATCH Project
 * @apiName Patch project with given ID
 * @apiGroup Project
 *
 * @apiParam  {String} [name] name
 * @apiSuccess (200) {Object} success message
 */
router.patch(
  "/:id",
  validator.validateProjectRequest,
  ProjectController.patchProject
);

// nested routes for floorplans
router.use("/:id/floorplans", floorplanRouter);

module.exports = router;
