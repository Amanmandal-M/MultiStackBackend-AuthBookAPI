const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Models Location
const userModel = require("../models/user_model");

module.exports.registerController = async (req, res) => {
  try {
    const { name, email, contactNo, password, role } = req.body;
    const saltRounds = 10;

    if (
      name === "" ||
      email === "" ||
      contactNo === "" ||
      password === "" ||
      role === ""
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "The request is missing required parameters.",
      });
    }

    const isPresent = await userModel.findOne({ email });

    if (isPresent) {
      return res.status(400).json({
        error: "Bad Request",
        message: "User already exists",
      });
    }

    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        return res.status(500).json({
          error: "Internal Server Error",
          message: "An error occurred while hashing the password.",
        });
      }

      const data = new userModel({
        name,
        email,
        contactNo,
        password: hash,
        role,
        updatedAt:null
      });

      data
        .save()
        .then(() => {
          res.status(201).json({
            message: "User registered successfully",
            data: {
              name: data.name,
              email: data.email,
              contactNo: data.contactNo,
              role: data.role,
            },
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: "Internal Server Error",
            message: "An error occurred while saving the user.",
          });
        });
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred.",
    });
  }
};

module.exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "" || password === "") {
      return res.status(400).json({
        error: "Bad Request",
        message: "The request is missing required parameters.",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found.",
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Internal Server Error",
          message: "An error occurred while comparing passwords.",
        });
      }

      if (!result) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid credentials.",
        });
      }

      const payload = {
        userId: user._id,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.NORMAL_KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          contactNo: user.contactNo,
          role: user.role,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred.",
    });
  }
};
