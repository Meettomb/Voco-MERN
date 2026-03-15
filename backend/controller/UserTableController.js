import UserModel from "../model/UserModel.js";
import bcrypt from "bcrypt"

export const registerUser = async (req, res) => {
  try {
    const hasedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new UserModel({
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: hasedPassword,
    });

    const saveUserData = await newUser.save();

    res.status(200).json({
      status: 1,
      message: "Data Inserted Successfully",
      data: saveUserData,
    });
  } catch (error) {
    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(409).json({
        status: 0,
        message: `${field} already exists`,
      });
    }

    // Validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: 0,
        message: error.message,
      });
    }

    console.error(error);
    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

export const getUserData = async (req, res) => {
  try {
    const users = await UserModel.find();

    res.status(200).json({
      status: 1,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

export const getUserDataById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid user ID",
      });
    }

    console.error(error);
    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "User deactivated successfully",
      data: updatedUser,
    });

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid user ID",
      });
    }

    console.error(error);

    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

export const updateUserRoleById = async (req, res) => {
  try {

    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        status: 0,
        message: "Role is required",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { role: role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "User role updated successfully",
      data: updatedUser,
    });

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid user ID",
      });
    }

    console.error(error);

    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

export const getActiveUsers = async (req, res) => {
  try {

    const users = await UserModel.find({ isActive: true });

    res.status(200).json({
      status: 1,
      message: "Active users fetched successfully",
      data: users,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};


// ===================================================
// ===================================================
// ==================== Profile ======================
// ===================================================
// ===================================================
// ===================================================

export const updateUserPersonalDetailById = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if user exists/ Get old data for validation
    const oldUserData = await UserModel.findById(id);
    if (!oldUserData) {
      return res.status(404).json({
        status: 0,
        message: "User Not Found",
      })
    }
    const updateData = {
      username: req.body.username,
      phoneNumber: req.body.phoneNumber,
      learningLanguages: req.body.learningLanguages,
    }

    // If phone number is being updated, reset phone verification status
    if (req.body.phoneNumber && req.body.phoneNumber !== oldUserData.phoneNumber) {
      updateData.phoneNumberVerified = false; // reset phone verification if phone number is changed
    }
    const updateUserPersonalDetailById = await UserModel.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    );


    if (!updateUserPersonalDetailById) {
      res.status(404).json({
        status: 0,
        message: "User Not Found",
      })
    }
    res.status(200).json({
      status: 1,
      message: "Data Update Successfully",
      data: updateUserPersonalDetailById
    })

  }
  catch (error) {
    // Validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: 0,
        message: error.message,
      });
    }
    else if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid User ID",
      })
    }
    else if (error.name === "MongoError" && error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(409).json({
        status: 0,
        message: `${field} already exists`,
      });
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(409).json({
        status: 0,
        message: `${field} already exists`,
      });
    }
    else {
      console.log(error)
    }
  }
};

export const updateUserPasswordById = async (req, res) => {
  try {

  }
  catch (error) {}
}