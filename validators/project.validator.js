const { body } = require('express-validator');

exports.validateProjectRequest = [
    body('name', 'Project name is missing from request body').exists().isLength({max: 10})
];


