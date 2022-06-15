require("dotenv").config();
var mongoose = require("mongoose");

const mongoString = process.env.MONGO_STRING;
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on("error", (error) => {
  console.log(`Database connection failed: ${error}`);
});

database.once("connected", () => {
  console.log("Database Connected");
});
