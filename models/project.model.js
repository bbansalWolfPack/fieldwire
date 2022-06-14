const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FloorPlanModel = require('../models/floorplan.model');

const ProjectSchema = new Schema({
    name: {
        required: true,
        type: String,
        unique: true
    },
    floorPlans:[{
        type: Schema.Types.ObjectId,
        ref: "FloorPlan"
    }]
}, { timestamps: true })

// middleware to delete in cascade fashion
ProjectSchema.pre('remove', function(next) {
    const floorplans = this.floorPlans;
    floorplans.forEach(plan => FloorPlanModel.find({id: plan.id}).remove().exec()); 
    next();
});

module.exports = mongoose.model('Project', ProjectSchema)