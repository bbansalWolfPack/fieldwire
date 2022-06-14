var express = require("express");
var app = require("./app");
var port = process.env.PORT || 3000;
const projectRoutes = require("./routes/project.route");
const multer = require("multer");

app.use(express.static("api-spec"));
app.use(express.json());

app.use("/api/v1/projects", projectRoutes);

// /* Global Error handler middleware */
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send(err.message);
  } else {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send(err.message);
  }
});

app.listen(port, function () {
  console.log("Express server listening on port " + port);
});
