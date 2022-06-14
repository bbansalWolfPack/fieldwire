const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FloorPlanSchema = new Schema({
    name: {
        required: true,
        type: String,
        unique: true,
    },
    originalImageUrl: String,
    thumbnailImageUrl: String,
    largeSizeImageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('FloorPlan', FloorPlanSchema)