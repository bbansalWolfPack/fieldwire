const FloorPlanHelper = require("./floorplan.helper");

const createProjectObject = (project) => {
    return {
        id: project._id,
        name: project.name,
        floorPlans: project.floorPlans.map(floorplan => FloorPlanHelper.createFloorPlanObject(floorplan))
    }
}
const createProjectResponse = (project) => {
    return {
        statusCode: 200,
        data: createProjectObject(project)
    }
}

const createAllProjectsResponse = (projects) => {
    const allProjects = [];
    projects.forEach(project => {
        allProjects.push(createProjectObject(project));
    })

    return {
        statusCode: 200,
        data: allProjects
    }
}

module.exports = {
    createProjectResponse,
    createAllProjectsResponse
}