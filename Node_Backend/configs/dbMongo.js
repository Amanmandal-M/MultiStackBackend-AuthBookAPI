const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
dotenv.config();

module.exports.dbConnection = async () => {
  try {
    return mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(colors.red(error.message));
  }
};
