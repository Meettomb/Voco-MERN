import fs from "fs/promises";

import ProfilePic from "../model/ProfilePicModel.js";

import {
  uploadImageToGitHub,
  deleteImageFromGitHub,
} from "../services/GitHubImageService.js";

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 0,
        message: "Profile image is required",
      });
    }

    const extension = req.file.originalname
      .split(".")
      .pop()
      .toLowerCase();

    const fileName =
      `profile_${Date.now()}.${extension}`;

    const githubResult =
      await uploadImageToGitHub(
        req.file,
        fileName
      );

    const profilePic = await ProfilePic.create({
      imageUrl: githubResult.imageUrl,
    });

    // Delete temporary local image
    await fs.unlink(req.file.path);

    res.status(201).json({
      status: 1,
      message: "Profile picture uploaded successfully",
      data: profilePic,
    });

  } catch (error) {
    console.error(
      "Profile picture upload error:",
      error
    );

    // Delete temporary file if it exists
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (deleteError) {
        console.error(
          "Temporary file deletion error:",
          deleteError
        );
      }
    }

    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

export const getProfilePics = async (req, res) => {
    try {
        const profilePics = await ProfilePic.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 1,
            message: "Profile pictures retrieved successfully",
            data: profilePics,
        });

    } catch (error) {
        console.error("Error retrieving profile pictures:", error);

        res.status(500).json({
            status: 0,
            message: "Server error",
        });
    }
};

export const deleteProfilePic = async (req, res) => {
  try {
    const { id } = req.params;

    const profilePic = await ProfilePic.findById(id);

    if (!profilePic) {
      return res.status(404).json({
        status: 0,
        message: "Profile picture not found",
      });
    }

    // Delete image from GitHub
    await deleteImageFromGitHub(
      profilePic.imageUrl
    );

    // Delete record from MongoDB
    await ProfilePic.findByIdAndDelete(id);

    res.status(200).json({
      status: 1,
      message: "Profile picture deleted successfully",
    });

  } catch (error) {
    console.error(
      "Error deleting profile picture:",
      error
    );

    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};