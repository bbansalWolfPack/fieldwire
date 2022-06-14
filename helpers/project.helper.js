const FloorPlanHelper = require("./floorplan.helper");

const createProjectObject = (project) => {
  return {
    id: project._id,
    name: project.name,
    floorPlans: project.floorPlans.map((floorplan) =>
      FloorPlanHelper.createFloorPlanObject(floorplan)
    ),
  };
};
const createProjectResponse = (project) => {
  return {
    project: createProjectObject(project),
  };
};

const createAllProjectsResponse = (projects) => {
  const allProjects = [];
  projects.forEach((project) => {
    allProjects.push(createProjectObject(project));
  });

  return {
    projects: allProjects,
  };
};

module.exports = {
  createProjectResponse,
  createAllProjectsResponse,
};
