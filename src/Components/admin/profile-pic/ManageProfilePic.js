import React, { useEffect, useState } from "react";
import FullScreenLoader from "../../FullScreenLoader";
import axios from "axios";
import usePageTitle from '../../../hooks/usePageTitle';

export default function ManageProfilePic() {
    usePageTitle("Manage Profile Pictures");
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

    // =========================
    // Get Profile Pictures
    // =========================

    const fetchProfilePics = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${REACT_APP_API_URL}/ProfilePicModel/getProfilePics`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const result = response.data;

            if (result.status === 1) {
                setImages(result.data);
            } else {
                setMessage(
                    result.message || "Failed to retrieve profile pictures."
                );
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error fetching profile pictures:", error);

            setMessage("Failed to retrieve profile pictures.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfilePics();
    }, []);

    // =========================
    // Auto Hide Message
    // =========================

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

    // =========================
    // View Image
    // =========================

    const handleView = (image) => {
        window.open(
            image.imageUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // =========================
    // Delete Popup
    // =========================

    const handleDeleteClick = (image) => {
        setSelectedImage(image);
        setShowDeletePopup(true);
    };

    const handleCancelDelete = () => {
        setShowDeletePopup(false);
        setSelectedImage(null);
    };

    // =========================
    // Confirm Delete
    // =========================

    const handleConfirmDelete = async () => {
    if (!selectedImage) return;

    try {
        setLoading(true);

        const response = await axios.delete(
            `${REACT_APP_API_URL}/ProfilePicModel/deleteProfilePic/${selectedImage._id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (response.data.status === 1) {
            setShowDeletePopup(false);
            setSelectedImage(null);

            setMessage(
                response.data.message
            );

            setMessageType("success");

            // Refresh list
            await fetchProfilePics();

        } else {
            setMessage(
                response.data.message ||
                "Failed to delete profile image."
            );

            setMessageType("error");
        }

    } catch (error) {
        console.error(
            "Error deleting profile picture:",
            error
        );

        setMessage(
            error.response?.data?.message ||
            "Failed to delete profile image."
        );

        setMessageType("error");

    } finally {
        setLoading(false);
    }
};

    return (
        <div className="manage-profile-pic">

            {loading && <FullScreenLoader />}

            {/* =========================
                Message
                ========================= */}


            <div className="manage-profile-pic-header">
                <h1>Manage Profile Pictures</h1>
                <p>
                    View and manage profile pictures uploaded to the platform.
                </p>
            </div>

            
            {message && (
                <div
                    className={`manage-profile-pic-message ${messageType}`}
                >
                    {message}
                </div>
            )}

            {/* =========================
                Image List
                ========================= */}

            <div className="manage-profile-pic-list">

                {images.map((image) => (
                    <div
                        className="manage-profile-pic-card"
                        key={image._id}
                    >

                        {/* Image */}

                        <div className="manage-profile-pic-image-wrapper">

                            <img
                                src={image.imageUrl}
                                alt="Profile"
                                className="manage-profile-pic-image"
                            />

                        </div>

                        {/* Actions */}

                        <div className="manage-profile-pic-actions">

                            {/* View */}

                            <button
                                type="button"
                                className="manage-profile-pic-view"
                                onClick={() => handleView(image)}
                                title="View image"
                                aria-label="View image"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="2.5"
                                    />
                                </svg>
                            </button>

                            {/* Delete */}

                            <button
                                type="button"
                                className="manage-profile-pic-delete"
                                onClick={() =>
                                    handleDeleteClick(image)
                                }
                                title="Delete image"
                                aria-label="Delete image"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M4 7h16" />
                                    <path d="M9 7V4h6v3" />
                                    <path d="M7 7l1 13h8l1-13" />
                                    <path d="M10 11v5" />
                                    <path d="M14 11v5" />
                                </svg>
                            </button>

                        </div>

                    </div>
                ))}

            </div>

            {/* =========================
                Empty State
                ========================= */}

            {images.length === 0 && !loading && (
                <div className="manage-profile-pic-empty">
                    No profile images found.
                </div>
            )}

            {/* =========================
                Delete Confirmation Popup
                ========================= */}

            {showDeletePopup && selectedImage && (

                <div className="manage-profile-pic-popup-overlay">

                    <div className="manage-profile-pic-popup">

                        <div className="manage-profile-pic-popup-icon">

                            <svg viewBox="0 0 24 24">
                                <path d="M4 7h16" />
                                <path d="M9 7V4h6v3" />
                                <path d="M7 7l1 13h8l1-13" />
                                <path d="M10 11v5" />
                                <path d="M14 11v5" />
                            </svg>

                        </div>

                        <h3>
                            Delete Profile Image?
                        </h3>

                        <p>
                            Are you sure you want to delete this
                            profile image? This action cannot be undone.
                        </p>

                        <div className="manage-profile-pic-popup-actions">

                            <button
                                type="button"
                                className="manage-profile-pic-cancel"
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="manage-profile-pic-confirm-delete"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}