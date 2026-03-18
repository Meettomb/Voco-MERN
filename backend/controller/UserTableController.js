import UserModel from "../model/UserModel.js";
import bcrypt from "bcrypt";
import { otpStore } from "../utils/otpStore.js";
import { sendMail } from "../utils/mailService.js";

const createUser = async ({ username, email, phoneNumber, password }) => {

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    username,
    email,
    phoneNumber,
    password: hashedPassword,
  });

  return await newUser.save();
};

export const registerUser = async (req, res) => {
  try {
    const saveUserData = await createUser(req.body);

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
        field: field,
        message: `${field} already exists`,
      });
    }

    // Validation errors
    if (error.name === "ValidationError") {
      const errors = {};

      for (let key in error.errors) {
        errors[key] = error.errors[key].message;
      }

      return res.status(400).json({
        status: 0,
        errors, // send field-wise errors
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
    const id = req.params.id;

    const oldUserPassword = await UserModel.findById(id).select("password");
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: 0,
        message: "All fields are required",
      });
    }
    if (!oldUserPassword) {
      return res.status(404).json({
        status: 0,
        message: "User Not Found",
      })
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, oldUserPassword.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        status: 0,
        message: "Old password not matched for this user",
      })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 0,
        message: "New password and confirm password do not match",
      });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatePassword = await UserModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      status: 1,
      message: "Password successfully updated",
      data: updatePassword,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid user ID",
      });
    }
    console.error(error);
    return res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
}


// ===================================================
// ===================================================
// ====================== OTP ========================
// ===================================================
// ===================================================
// ===================================================

export const sendOtp = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    // check duplicate email
    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      return res.status(409).json({
        status: 0,
        field: "email",
        message: "Email already exists",
      });
    }

    // check duplicate phone
    const phoneExist = await UserModel.findOne({ phoneNumber });
    if (phoneExist) {
      return res.status(409).json({
        status: 0,
        field: "phoneNumber",
        message: "Phone number already exists",
      });
    }

    // prevent resend before 2 min
    const existing = otpStore[email];
    if (existing && Date.now() < existing.expiresAt) {
      return res.json({
        status: 0,
        message: "Please wait before requesting new OTP",
      });
    }

    //  If expired → delete old OTP
    if (existing && Date.now() > existing.expiresAt) {
      delete otpStore[email];
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 2 * 60 * 1000,
      lastSentAt: Date.now(),
      data: { username, email, phoneNumber, password },
    };

    console.log("OTP STORE:", otpStore);

    await sendMail(
      email,
      "OTP Verification",
      `Your OTP is ${otp}. Valid for 2 minutes.`
    );

    res.json({
      status: 1,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 0,
      message: "Error sending OTP",
    });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) {
      return res.json({
        status: 0,
        message: "OTP expired",
      });
    }

    //  check expiry
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.json({
        status: 0,
        message: "OTP expired",
      });
    }

    //  check OTP
    if (parseInt(otp) !== record.otp) {
      return res.json({
        status: 0,
        message: "Invalid OTP",
      });
    }

    const { username, phoneNumber, password } = record.data;

    const savedUser = await createUser({
      username,
      email,
      phoneNumber,
      password,
    });

    // send success email
    await sendMail(
      email,
      "Registration Successful",
      "Your registration has been completed successfully."
    );

    delete otpStore[email];

    res.json({
      status: 1,
      message: "User registered successfully",
      data: savedUser,
    });

  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(409).json({
        status: 0,
        field,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};