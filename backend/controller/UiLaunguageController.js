import UiLanguageModel from "../model/UiLanguageModel.js";

/// Add UI Launguage

export const addUiLaunguage = async (req, res) => {
  try {
    const newLanguage = new UiLanguageModel({
      code: req.body.code,
      englishName: req.body.englishName,
      nativeName: req.body.nativeName,
      isActive: req.body.isActive,
    });

    const saveLanguage = await newLanguage.save();

    res.status(200).json({
      status: 1,
      message: "Language Added Successfully",
      data: saveLanguage,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(409).json({
        status: 0,
        message: `${field} already exists`,
      });
    }

    console.error(error);
    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

// GET UI Languages

export const getUiLanguage = async (req, res) => {
  try {
    console.log("Fetching all UI Languages...");

    const languages = await UiLanguageModel.find().sort({ createdAt: -1 });

    console.log("Languages Found:", languages.length);

    res.status(200).json({
      status: 1,
      message: "UI Languages fetched successfully",
      data: languages,
    });
  } catch (error) {
    console.log("ERROR IN GET UI LANGUAGE:");
    console.log(error);

    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};

// DELETE UI Languages By ID

export const deleteUiLanguageById = async (req, res) => {
  try {
    console.log("Deleting ID:", req.params.id);

    const deletedLanguage = await UiLanguageModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedLanguage) {
      return res.status(404).json({
        status: 0,
        message: "Language not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Language deleted successfully",
      data: deletedLanguage,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        status: 0,
        message: "Invalid ID",
      });
    }

    console.log("Delete Error:", error);

    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};
