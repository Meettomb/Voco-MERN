import UserModel from "../model/UserModel.js";
import bcrypt from "bcrypt";
import { otpStore } from "../utils/otpStore.js";
import { emailChangeStore } from "../utils/emailChangeStore.js";
import { sendMail } from "../utils/mailService.js";
import generateToken from "../utils/jwtUtils.js";
import { sendOTP } from "../utils/smsService.js";


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
    const users = await UserModel.find().populate("learningLanguages");

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
    const user = await UserModel
      .findById(req.params.id)
      .populate("learningLanguages");

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

export const updateUserActiveStatus = async (req, res) => {
  try {

    const { isActive } = req.body;

    if (typeof isActive === "undefined") {
      return res.status(400).json({
        status: 0,
        message: "isActive is required",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { isActive: isActive },
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
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      data: updatedUser,
    });

  } catch (error) {

    console.error("updateUserActiveStatus error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid user ID",
      });
    }

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

    const users = await UserModel
      .find({ isActive: true })

      .populate("learningLanguages");

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


export const searchUsers = async (req, res) => {
  try {

    const { keyword } = req.query;

    if (!keyword) {
      return res.status(200).json({
        status: 1,
        message: "No keyword",
        data: [],
      });
    }

    const users = await UserModel.find({
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phoneNumber: { $regex: keyword, $options: "i" } },
      ],
    })

      .populate("learningLanguages");

    res.status(200).json({
      status: 1,
      message: "Users found",
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


export const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;

    // 🔒 Authorization (user can update only self)
    if (req.user.id !== id) {
      return res.status(403).json({
        status: 0,
        message: "Unauthorized access",
      });
    }

    const existingUser = await UserModel.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        status: 0,
        message: "User not found",
      });
    }

    //  Prevent updating restricted fields
    const restrictedFields = ["password", "role", "email"];
    restrictedFields.forEach(field => delete req.body[field]);

    //  Empty body check
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 0,
        message: "No valid fields provided for update",
      });
    }

    //  Reset phone verification if changed
    if (
      req.body.phoneNumber &&
      req.body.phoneNumber !== existingUser.phoneNumber
    ) {
      req.body.phoneNumberVerified = false;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    ).populate("learningLanguages");

    return res.status(200).json({
      status: 1,
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error) {

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: 0,
        message: error.message,
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        status: 0,
        message: `${field} already exists`,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid user ID",
      });
    }

    console.error(error);
    return res.status(500).json({
      status: 0,
      message: "Internal server error",
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

    //  Authorization check
    if (req.user.id !== id) {
      return res.status(403).json({
        status: 0,
        message: "Unauthorized access",
      });
    }

    const oldUserData = await UserModel.findById(id);
    if (!oldUserData) {
      return res.status(404).json({
        status: 0,
        message: "User Not Found",
      });
    }

    // Empty check
    if (!req.body.username && !req.body.phoneNumber && !req.body.learningLanguages) {
      return res.status(400).json({
        status: 0,
        message: "No data provided for update",
      });
    }

    //  Dynamic update object
    const updateData = {};

    if (req.body.username) {
      updateData.username = req.body.username;
    }


    const incomingPhone = req.body.phoneNumber?.trim();
    const oldPhone = oldUserData.phoneNumber?.trim();
    if (req.body.phoneNumber) {
      updateData.phoneNumber = incomingPhone;
    }

    if (req.body.learningLanguages) {
      updateData.learningLanguages = req.body.learningLanguages;
    }


    const isPhoneChanged =
      incomingPhone && incomingPhone !== oldPhone;

    const isNotVerified = oldUserData.phoneNumberVerified === false;

    if (isPhoneChanged || isNotVerified) {

      const phoneToVerify = (req.body.phoneNumber || oldUserData.phoneNumber).trim();

      if (!/^\d{10}$/.test(phoneToVerify)) {
        return res.status(400).json({
          status: 0,
          message: "Invalid phone number format"
        });
      }

      const key = `${id}_${phoneToVerify}`;
      const existing = otpStore[key];

      if (existing && Date.now() > existing.expiresAt) {
        delete otpStore[key];
      }

      if (existing && Date.now() - existing.lastSentAt < 60000) {
        return res.json({
          status: 0,
          message: "Please wait before requesting new OTP",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);

      otpStore[key] = {
        otp,
        expiresAt: Date.now() + 2 * 60 * 1000,
        lastSentAt: Date.now(),
        data: {
          username: req.body.username || oldUserData.username,
          phoneNumber: phoneToVerify,
          learningLanguages: req.body.learningLanguages || oldUserData.learningLanguages
        },
      };
      const formattedPhone = `+91${phoneToVerify}`;

      const smsResponse = await sendOTP(formattedPhone, "otp", otp);

      if (smsResponse.status === 0) {
        return res.status(500).json({
          status: 0,
          message: "Failed to send OTP. Try again.",
        });
      }
      return res.status(200).json({
        status: 2,
        message: "Phone verification required",
        tempData: otpStore[key].data

      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: 1,
      message: "Data Updated Successfully",
      data: updatedUser
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: 0,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid User ID",
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(409).json({
        status: 0,
        message: `${field} already exists`,
      });
    }

    console.error(error);
    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
    });
  }
};
export const verifyPhoneOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phoneNumber, otp } = req.body;

    const key = `${userId}_${phoneNumber}`;
    const record = otpStore[key];

    //  No OTP found
    if (!record) {
      return res.status(400).json({
        status: 0,
        message: "No OTP request found",
      });
    }

    //  Expired
    if (Date.now() > record.expiresAt) {
      delete otpStore[key];
      return res.status(400).json({
        status: 0,
        message: "OTP expired",
      });
    }

    //  Wrong OTP
    if (otp !== record.otp.toString()) {
      return res.status(400).json({
        status: 0,
        message: "Invalid OTP",
      });
    }

    //  OTP correct → update user
    const updateData = {
      ...record.data,
      phoneNumberVerified: true,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    // cleanup
    delete otpStore[key];

    return res.status(200).json({
      status: 1,
      message: "Phone verified and data updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 0,
      message: "Internal Server Error",
    });
  }
};

export const updateUserPasswordById = async (req, res) => {
  try {
    const id = req.params.id;

    // ✅ SINGLE DB CALL
    const user = await UserModel.findById(id).select("password email");

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: 0,
        message: "All fields are required",
      });
    }

    if (!user) {
      return res.status(404).json({
        status: 0,
        message: "User Not Found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        status: 0,
        message: "Old password not matched for this user",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 0,
        message: "New password and confirm password do not match",
      });
    }

    // ✅ Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    // ✅ SEND MAIL (CORRECT VARIABLE)
    try {
      if (user.email) {
        await sendMail(
          user.email,
          "Password Updated Successfully",
          "passwordUpdate"
        );
      }
    } catch (mailError) {
      console.error("Mail failed:", mailError.message);
    }

    return res.status(200).json({
      status: 1,
      message: "Password successfully updated",
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

    return res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

export const updateUserPreferencesById = async (req, res) => {
    try {
        const { id } = req.params;
        const { emailNotifications, reminderTime } = req.body;

        // Validate User ID
        if (!id) {
            return res.status(400).json({
                status: 0,
                message: "User ID is required",
            });
        }

        // Validate emailNotifications
        if (
            emailNotifications !== undefined &&
            typeof emailNotifications !== "boolean"
        ) {
            return res.status(400).json({
                status: 0,
                message: "emailNotifications must be a boolean value",
            });
        }

        // Validate reminderTime
        if (
            reminderTime !== undefined &&
            reminderTime !== null &&
            typeof reminderTime !== "string"
        ) {
            return res.status(400).json({
                status: 0,
                message: "reminderTime must be a string or null",
            });
        }

        // Prepare update object
        const updateData = {};

        if (emailNotifications !== undefined) {
            updateData.emailNotifications = emailNotifications;
        }

        if (reminderTime !== undefined) {
            updateData.reminderTime = reminderTime;
        }

        // Nothing to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: 0,
                message: "No preference data provided",
            });
        }

        // Update user preferences
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("emailNotifications reminderTime");

        // User not found
        if (!updatedUser) {
            return res.status(404).json({
                status: 0,
                message: "User not found",
            });
        }

        return res.status(200).json({
            status: 1,
            message: "User preferences updated successfully",
            data: updatedUser,
        });

    } catch (error) {
        console.error("Update User Preferences Error:", error);

        return res.status(500).json({
            status: 0,
            message: "Internal Server Error",
        });
    }
};
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

    await sendMail(
      email,
      "OTP Verification",
      "otp",
      otp
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
        message: "No OTP request found for this email",
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
      "success",
      null
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




export const Login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await UserModel.findOne({ email: email })

    if (!email) {
      return res.status(400).json({
        status: 0,
        message: "Email is required"
      })
    }

    if (!password) {
      return res.status(200).json({
        status: 0,
        message: "Password is required"
      })
    }

    if (!userData) {
      return res.status(400).json({
        status: 0,
        message: "User not found"
      })
    }

    const Match = await bcrypt.compare(password, userData.password)

    if (!Match) {
      return res.status(401).json({
        status: 0,
        message: "Invalid password"
      })
    }


    const token = generateToken(userData);
    return res.status(200).json({
      status: 1,
      message: "Login Done ",
      data: {
        _id: userData._id,
        email: userData.email,
        role: userData.role,
        token: token
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 0,
      message: "Internal Server Error"
    })
  }

}


// ===================================================
export const requestEmailChange = async (req, res) => {
    try {
        const { id } = req.params;
        const { newEmail } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 0,
                message: "User ID is required",
            });
        }

        if (!newEmail) {
            return res.status(400).json({
                status: 0,
                message: "New email is required",
            });
        }

        const normalizedEmail = newEmail.trim().toLowerCase();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                status: 0,
                message: "Invalid email address",
            });
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                status: 0,
                message: "User not found",
            });
        }

        // Don't allow same email
        if (user.email.toLowerCase() === normalizedEmail) {
            return res.status(400).json({
                status: 0,
                message: "New email is same as current email",
            });
        }

        // Check whether new email is already registered
        const existingUser = await UserModel.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                status: 0,
                message: "This email is already registered",
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Generate secure verification token
        const crypto = await import("crypto");

        const verificationToken =
            crypto.randomBytes(32).toString("hex");

        // Store verification data
        emailChangeStore[id] = {
            oldEmail: user.email,
            newEmail: normalizedEmail,

            otp,

            otpExpiresAt:
                Date.now() + 2 * 60 * 1000,

            verificationToken,

            tokenExpiresAt:
                Date.now() + 15 * 60 * 1000,

            newEmailVerified: false,
        };

        // Send OTP to OLD email
        await sendMail(
            user.email,
            "Verify Your Email Change",
            "emailChangeOtp",
            otp
        );

        // Create verification link for NEW email
        const verificationLink =
            `${process.env.FRONTEND_URL}/verify-email-change?token=${verificationToken}`;

        // Send link to NEW email
        await sendMail(
            normalizedEmail,
            "Verify your new LearnVoco email address",
            "emailChangeLink",
            verificationLink
        );

        return res.status(200).json({
            status: 1,
            message:
                "Verification instructions have been sent to your old and new email addresses",
        });

    } catch (error) {

        console.error(
            "Request Email Change Error:",
            error
        );

        return res.status(500).json({
            status: 0,
            message: "Internal Server Error",
        });
    }
};

export const verifyEmailChange = async (req, res) => {

    try {

        const { token, otp } = req.body;

        if (!token || !otp) {
            return res.status(400).json({
                status: 0,
                message: "Verification token and OTP are required",
            });
        }

        // Find pending email change
        const entry = Object.entries(emailChangeStore)
            .find(
                ([, data]) =>
                    data.verificationToken === token
            );

        if (!entry) {
            return res.status(400).json({
                status: 0,
                message: "Invalid or expired verification link",
            });
        }

        const [userId, data] = entry;

        // Check link expiration
        if (Date.now() > data.tokenExpiresAt) {

            delete emailChangeStore[userId];

            return res.status(400).json({
                status: 0,
                message: "Verification link has expired",
            });
        }

        // Check OTP expiration
        if (Date.now() > data.otpExpiresAt) {

            delete emailChangeStore[userId];

            return res.status(400).json({
                status: 0,
                message: "OTP has expired",
            });
        }

        // Check OTP
        if (otp !== data.otp) {

            return res.status(400).json({
                status: 0,
                message: "Invalid OTP",
            });
        }

        // Make sure new email still isn't registered
        const existingUser = await UserModel.findOne({
            email: data.newEmail,
        });

        if (
            existingUser &&
            existingUser._id.toString() !== userId
        ) {

            delete emailChangeStore[userId];

            return res.status(409).json({
                status: 0,
                message: "This email is already registered",
            });
        }

        // Update email
        const updatedUser =
            await UserModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        email: data.newEmail,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedUser) {

            delete emailChangeStore[userId];

            return res.status(404).json({
                status: 0,
                message: "User not found",
            });
        }

        // Delete pending verification
        delete emailChangeStore[userId];

        return res.status(200).json({
            status: 1,
            message: "Email address updated successfully",
            data: {
                email: updatedUser.email,
            },
        });

    } catch (error) {

        console.error(
            "Verify Email Change Error:",
            error
        );

        return res.status(500).json({
            status: 0,
            message: "Internal Server Error",
        });
    }
};


// ==================================================

export const uploadProfilePicture = async (req, res) => {
  
}