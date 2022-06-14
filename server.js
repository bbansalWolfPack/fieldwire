var express = require('express');
var app = require('./app');
var port = process.env.PORT || 5000;
const projectRoutes = require('./routes/project.route');
const floorplanRoutes = require('./routes/floorplan.route');
const multer = require("multer");
const ResponseHelper = require('./helpers/construct-response-objects');

app.use(express.json());

app.use('/api/v1/projects', projectRoutes);

// /* Global Error handler middleware */
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    res.send(ResponseHelper.getErrorResponse(400, 'Only one floorplan (max 2MB) can be uploaded in every request'));
  } else {
    const statusCode = err.statusCode || 500;
    res.send(ResponseHelper.getErrorResponse(statusCode, err.message));
  }
});

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

