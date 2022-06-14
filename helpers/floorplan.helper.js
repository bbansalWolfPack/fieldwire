

const createFloorPlanObject = (floorplan) => {
    return {
        id: floorplan._id,
        name: floorplan.name,
        originalImageUrl: floorplan.originalImageUrl,
        thumbnailImageUrl: floorplan.thumbnailImageUrl,
        largeSizeImageUrl: floorplan.largeSizeImageUrl
    }
}

const createFloorPlanResponse = (floorplan) => {
    return {
        statusCode: 200,
        data: createFloorPlanObject(floorplan)
    }
}


const createAllFloorplanResponse = (floorplans) => {
    const allFloorplans = [];
    floorplans.forEach(floorplan => {
        allFloorplans.push(createFloorPlanObject(floorplan));
    })

    return {
        statusCode: 200,
        data: allFloorplans
    }
}
module.exports = {
    createFloorPlanObject,
    createFloorPlanResponse,
    createAllFloorplanResponse
}