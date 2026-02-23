import UserModel from '../model/UserModel.js';

export const registerUser = async (req, res) => {
    try {
        const newUser = new UserModel({
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password
        })

        const saveUserData = await newUser.save()

        res.status(200).json({
            status: 1,
            message: "Data Inserted Successfully",
            data: saveUserData
        })
    }
    catch (error) {

        // Duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(409).json({
                status: 0,
                message: `${field} already exists`
            });
        }

        // Validation errors
        if (error.name === "ValidationError") {
            return res.status(400).json({
                status: 0,
                message: error.message
            });
        }

        console.error(error);
        res.status(500).json({
            status: 0,
            message: "Server error"
        });
    }
}

export const getUserData = async (req, res) => {
    try {
        const users = await UserModel.find();

        res.status(200).json({
            status: 1,
            message: "All users fetched successfully",
            data: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 0,
            message: "Server error"
        });
    }
};

export const getUserDataById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 0,
                message: "User not found"
            });
        }

        res.status(200).json({
            status: 1,
            message: "User data fetched successfully",
            data: user
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                status: 0,
                message: "Invalid user ID"
            });
        }

        console.error(error);
        res.status(500).json({
            status: 0,
            message: "Server error"
        });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                status: 0,
                message: "User not found"
            });
        }

        res.status(200).json({
            status: 1,
            message: "User deleted successfully",
            data: deletedUser
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                status: 0,
                message: "Invalid user ID"
            });
        }

        console.error(error);
        res.status(500).json({
            status: 0,
            message: "Server error"
        });
    }
};