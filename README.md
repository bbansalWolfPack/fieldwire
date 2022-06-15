# RESTful API Node Server For Fieldwire

## Quick Start

To start with the project, clone the repo and run below steps:

Clone the repo:

```bash
git clone <url>
cd fieldwire
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
touch .env
vim .env
AWS_ACCESS_KEY_ID="<UR AWS ACCESS KEY for S3>"
AWS_ACCESS_KEY_SECRET="<UR AWS ACCESS KEY SECRET for S3>"
AWS_BUCKET_NAME="<AWS BUCKET NAME>"
MONGO_STRING="<MONGO DB Database Connection String>"


# open .env and modify the environment variables (if needed)
```


## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [User workflows](#user-workflows)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Improvements](#improvements)


## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Validation**: request validation using express-validator
- **Testing**: testing basic route behaviors with help of mocha, chai and supertest
- **Error handling**: centralized error handling mechanism
- **API documentation**: open-api documentation built using Insomnia
- **Dependency management**: with npm
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Code Formatting**: using [prettier](https://prettier.io/docs/en/options.html)


## Commands

Running locally:

```bash
npm run start-development
```

Running in production:

```bash
npm run start-production
```

Testing:

```bash
# run all tests
npm run test

```


## Project Structure

```
fieldwire\
 |--api-spec\       # open-api spec yaml and index file
 |--controllers\    # Route controllers (controller layer)
 |--helpers\        # Utility classes and functions
 |--middleware\     # middleware for upload
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--test\           # Test files
 |--validators\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
 |--db.js           # Database config and connection file
 |--server.js        # App entry point
```


## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000` in your browser. This documentation page is automatically generated using the open-api spec definitions. I have also hosted the API spec on Amazon EC2 instance: [API SPEC](http://3.87.217.73:8080/)


## User Workflows

Typical user workflows are:


```#bash
* user creates new project by giving unique name.
* user add floorplan to an existing project (Only one file can be uploaded at a given time, and file can be of max 2 MB).
* user can update existing floorplan or can upload new ones
```

### API Endpoints

List of available routes:

**Project routes**:\
`GET /api/v1/projects` - Get all projects\
`GET /api/v1/projects/{projectId}` - Get project with given ID\
`POST /api/v1/project` - Create new project\
`PATCH /api/v1/project/{projectId}` - Patch project with given ID\
`DELETE /api/v1/projects/{projectId}` - Delete project with given ID

**Floorplan routes**:\
`GET /api/v1/projects/{projectId}/floorplans` - Get all floorplans for a given project ID\
`GET /api/v1/projects/{projectId}/floorplans/{floorplanId}` - Get specific floorplan for giveb project ID\
`POST /api/v1/project/{projectId}/floorplans` - Create new floorplan for given project ID\
`POST /api/v1/project/{projectId}/floorplans/{floorplanId}` - Update floorplan for given project ID\
`DELETE /api/v1/projects/{projectId}/floorplans/{floorplanId}` - Delete floorplan with given ID for given project ID


## Error Handling

Each service throws error and those are caught by controllers. For any errors not caught, we also have centralized error handling middleware.



## Validation

Request data is validated using express-validator.

The validation schemas are defined in the `src/validators` directory and are used in the routes by providing them as parameters to the `validate` middleware.


## Improvements

  * We can add better error handling
  * More test cases can be added including unit tests
  * Code optimization and re-factoring can be done
  * Use of S3 service can be optimized
  * Batch image uploads can be done by using jobs in the background
  * We can allow user to upload more than one image at a time
