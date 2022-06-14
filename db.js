require("dotenv").config();
var mongoose = require("mongoose");

const mongoString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fieldwire.jz5gk.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on("error", (error) => {
  console.log(`Database connection failed: ${error}`);
});

database.once("connected", () => {
  console.log("Database Connected");
});
