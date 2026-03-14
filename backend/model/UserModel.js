import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is Required"],
        trim: true,
        minlength: [3, "Username must be at least 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address"
        ]
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone Number is Required"],
        unique: true,
        trim: true,
        match: [
            /^\d{10}$/,
            "Phone number must be exactly 10 digits"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    uiSupportLangauge: {
        type: String,
        default: "English"
    },
    learningLanguages: {
        type: [String],   // array of strings
        default: []       // not required
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })


const userData = mongoose.model("user_table", userSchema);

export default userData;