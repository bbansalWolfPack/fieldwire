const request = require("supertest");
const { expect } = require("chai");
require("dotenv").config();

const app = require("../server");

/*
  Covering basic tests
*/

let idOfProjectCreated = "";

const newProject = {
  name: "Raleigh",
};

const invalidProject = {
  name1: "Raleigh",
};

const updatedProjectName = {
  name: "Durham",
};

before(function (done) {
  this.timeout(3000);
  setTimeout(done, 2000);
});

describe("POST Project", () => {
  it("should create new project", (done) => {
    request(app)
      .post("/api/v1/projects")
      .send(newProject)
      .expect(200)
      .then((res) => {
        idOfProjectCreated = res._body.project.id;
        expect(res.status).to.be.eql(200);
        expect(res._body.project.name).to.be.eql(newProject.name);
        done();
      })
      .catch((err) => done(err));
  });

  it("should not create new project, bad request error", (done) => {
    request(app)
      .post("/api/v1/projects")
      .send(invalidProject)
      .expect(400)
      .then((res) => {
        expect(res.status).to.be.eql(400);
        done();
      })
      .catch((err) => done(err));
  });
});

describe("GET Projects", () => {
  it("should get all projects", (done) => {
    request(app)
      .get("/api/v1/projects")
      .expect(200)
      .then((res) => {
        expect(res.status).to.be.eql(200);
        done();
      })
      .catch((err) => done(err));
  });

  it("should get specific project", (done) => {
    request(app)
      .get(`/api/v1/projects/${idOfProjectCreated}`)
      .expect(200)
      .then((res) => {
        expect(res.status).to.be.eql(200);
        done();
      })
      .catch((err) => done(err));
  });

  it("should show 404, resource not found error for invalid project id", (done) => {
    request(app)
      .get(`/api/v1/projects/63a9495cc1444e9d051ac7d5`)
      .expect(404)
      .then((res) => {
        expect(res.status).to.be.eql(404);
        done();
      })
      .catch((err) => done(err));
  });
});

describe("PATCH Project", () => {
  it("should update project name", (done) => {
    request(app)
      .patch(`/api/v1/projects/${idOfProjectCreated}`)
      .send(updatedProjectName)
      .expect(200)
      .then((res) => {
        expect(res.status).to.be.eql(200);
        expect(res._body.project.name).to.be.eql(updatedProjectName.name);
        done();
      })
      .catch((err) => done(err));
  });
});

describe("Delete Project", () => {
  it("should show 404 for invalid project id", (done) => {
    request(app)
      .delete("/api/v1/projects/63a9495cc1444e9d051ac7d5")
      .expect(404)
      .then((res) => {
        expect(res.status).to.be.eql(404);
        done();
      })
      .catch((err) => done(err));
  });

  it("should delete actual project", (done) => {
    request(app)
      .delete(`/api/v1/projects/${idOfProjectCreated}`)
      .expect(200)
      .then((res) => {
        expect(res.status).to.be.eql(200);
        done();
      })
      .catch((err) => done(err));
  });
});
