const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Models Location
const { userModel } = require("../models/user_model");

// Node Mailer Location
const { sendEmail } = require("../nodemailer/sendingEmails");

module.exports.registerController = async (req, res) => {
  try {
    const { name, email, contactNo, password, role } = req.body;
    const saltRounds = 10;

    const requiredFields = {
      name,
      email,
      contactNo,
      password,
      role,
    };
    const missingFields = [];

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value === "") {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: `The following fields are missing: ${missingFields.join(", ")}.`,
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
        updatedAt: null,
      });

      data
        .save()
        .then(() => {
          sendEmail({
            email: email,
            body: `<h1 style="color:blue;text-align:center">Welcome in Books NodeJs Backend Services</h1>
                   <div style="display:block;margin:auto;text-align:center">
                     Welcome ${name} in Books Services. Now go and login now.
                   </div>
                  `,
          });
          res.status(201).json({
            success: true,
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

    const requiredFields = {
      email,
      password,
    };
    const missingFields = [];

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value === "") {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: `The following fields are missing: ${missingFields.join(", ")}.`,
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
        email: user.email,
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