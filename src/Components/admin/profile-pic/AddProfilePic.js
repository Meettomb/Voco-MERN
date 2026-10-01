import React, { useRef, useState } from "react";
function AddProfilePic() {
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    const validateFile = (file) => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!file) {
            setErrorMessage("Please select a profile image.");
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            setErrorMessage(
                "Invalid image format. Please upload JPG, PNG, or WEBP."
            );
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            setErrorMessage("Image size must be less than 5 MB.");
            return false;
        }

        return true;
    };

    const handleFile = (file) => {
        if (!validateFile(file)) {
            setSelectedFile(null);
            setPreviewUrl("");
            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const newPreviewUrl = URL.createObjectURL(file);

        setSelectedFile(file);
        setPreviewUrl(newPreviewUrl);
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (file) {
            handleFile(file);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];

        if (file) {
            handleFile(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleBrowse = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(null);
        setPreviewUrl("");
        setErrorMessage("");
        setSuccessMessage("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (!selectedFile) {
            setErrorMessage(
                "Please select a profile image before saving."
            );
            return;
        }

        try {
            /*
             * API integration goes here.
             *
             * Example:
             *
             * const formData = new FormData();
             * formData.append("profileImage", selectedFile);
             *
             * const response = await fetch(
             *   "YOUR_API_URL/api/profile/upload",
             *   {
             *     method: "POST",
             *     body: formData,
             *   }
             * );
             *
             * if (!response.ok) {
             *   throw new Error("Upload failed");
             * }
             */

            setSuccessMessage(
                "Profile picture is ready to be saved."
            );

            console.log("Selected profile image:", selectedFile);

        } catch (error) {
            setErrorMessage(
                "Something went wrong while uploading the profile picture."
            );
        }
    };

    return (
        <main className="add-profile-page">

            <div className="add-profile-container">

                <section className="add-profile-card">

                    {/* =========================
              Header
              ========================= */}

                    <div className="add-profile-header">

                        <div className="header-content">

                            <h1>
                                Add Profile Picture
                            </h1>

                            <p>
                                Upload a profile picture to personalize your account.
                            </p>

                        </div>

                    </div>


                    {/* =========================
              Form
              ========================= */}

                    <form
                        className="profile-form"
                        onSubmit={handleSubmit}
                    >

                        {/* =========================
                Upload Section
                ========================= */}

                        <div className="upload-section">

                            <div
                                className={`upload-area ${isDragging ? "dragging" : ""
                                    } ${previewUrl ? "has-preview" : ""}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >

                                {!previewUrl ? (

                                    /* =========================
                                       Empty Upload
                                       ========================= */

                                    <div className="empty-upload">

                                        <div className="upload-icon">

                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                            >

                                                <path
                                                    d="M12 16V4"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M7 9L12 4L17 9"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                <path
                                                    d="M5 20H19"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />

                                            </svg>

                                        </div>


                                        <div className="upload-text">

                                            <h2>
                                                Upload profile picture
                                            </h2>

                                            <p>
                                                Drag and drop your image here or browse
                                                from your device.
                                            </p>

                                            <span>
                                                JPG, PNG or WEBP · Maximum 5 MB
                                            </span>

                                        </div>


                                        <button
                                            type="button"
                                            className="browse-button"
                                            onClick={handleBrowse}
                                        >

                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                aria-hidden="true"
                                            >

                                                <path
                                                    d="M12 16V4"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M7 9L12 4L17 9"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />

                                                <path
                                                    d="M5 20H19"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />

                                            </svg>

                                            Browse Image

                                        </button>

                                    </div>

                                ) : (

                                    /* =========================
                                       Selected Image
                                       ========================= */

                                    <div className="selected-upload">

                                        <div className="preview-wrapper">

                                            <img
                                                src={previewUrl}
                                                alt="Profile preview"
                                            />

                                        </div>


                                        <div className="file-information">

                                            <h2>
                                                Profile picture selected
                                            </h2>

                                            <p title={selectedFile?.name}>
                                                {selectedFile?.name}
                                            </p>

                                            <span>
                                                {(
                                                    selectedFile?.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB
                                            </span>

                                        </div>


                                        <div className="image-actions">

                                            {/* Change Button */}

                                            <button
                                                type="button"
                                                className="change-button"
                                                onClick={handleBrowse}
                                            >

                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                >

                                                    <path
                                                        d="M12 20H21"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                    />

                                                    <path
                                                        d="M16.5 3.5C17.328 2.672 18.672 2.672 19.5 3.5C20.328 4.328 20.328 5.672 19.5 6.5L8 18L3 19L4 14L16.5 3.5Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                </svg>

                                                Change

                                            </button>


                                            {/* Remove Button */}

                                            <button
                                                type="button"
                                                className="remove-button"
                                                onClick={handleRemove}
                                            >

                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                >

                                                    <path
                                                        d="M4 7H20"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                    />

                                                    <path
                                                        d="M9 7V4H15V7"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                    <path
                                                        d="M7 7L8 20H16L17 7"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                    <path
                                                        d="M10 11V17"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                    />

                                                    <path
                                                        d="M14 11V17"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        strokeLinecap="round"
                                                    />

                                                </svg>

                                                Remove

                                            </button>

                                        </div>

                                    </div>

                                )}


                                {/* Hidden File Input */}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileChange}
                                    hidden
                                />

                            </div>

                        </div>


                        {/* =========================
                Error Message
                ========================= */}

                        {errorMessage && (
                            <div className="message-box error-message red">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <path
                                        d="M12 8V13"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <circle
                                        cx="12"
                                        cy="16.5"
                                        r="1"
                                        fill="currentColor"
                                    />
                                </svg>

                                <span>{errorMessage}</span>
                            </div>
                        )}


                        {/* =========================
                Success Message
                ========================= */}

                        {successMessage && (

                            <div className="message-box success-message">

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                    <path
                                        d="M8 12L10.5 14.5L16 9"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                </svg>

                                <span>
                                    {successMessage}
                                </span>

                            </div>

                        )}


                        {/* =========================
                Footer
                ========================= */}

                        <div className="form-footer">

                            <div className="upload-info">

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >

                                    <path
                                        d="M5 12C5 8.134 8.134 5 12 5C15.866 5 19 8.134 19 12C19 15.866 15.866 19 12 19"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M5 8V12H9"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                </svg>

                                <span>
                                    Supported formats: JPG, PNG and WEBP
                                </span>

                            </div>


                            {/* Save Button */}

                            <button
                                type="submit"
                                className="save-button"
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >

                                    <path
                                        d="M5 4H16L20 8V20H5V4Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M8 4V10H16V4"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinejoin="round"
                                    />

                                    <circle
                                        cx="12"
                                        cy="15"
                                        r="2"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />

                                </svg>

                                Save Profile Picture

                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </main>
    );
}

export default AddProfilePic;