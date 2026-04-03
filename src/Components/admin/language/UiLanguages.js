import { useState, useEffect } from "react";
import usePageTitle from '../../../hooks/usePageTitle';
import axios from "axios";

export default function UiLanguages() {
    usePageTitle("Supported UI Languages");

    const REACT_APP_API_URL = process.env.REACT_APP_API_URL

    const token = localStorage.getItem('token')
    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState({
        englishName: "",
        nativeName: "",
        code: "",
    });
    const [editData, setEditData] = useState({
        englishName: "",
        nativeName: "",
        code: "",
    });

    const [languages, setLanguages] = useState([null]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [popup, setPopup] = useState({
        type: "",
        data: null,
    });

    useEffect(() => {
        getAllUiLanguages();
    }, []);

    useEffect(() => {

        if (message) {

            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);

            return () => clearTimeout(timer);
        }

    }, [message]);

    const submitForm = (e) => {
        e.preventDefault();

        addUiLaunguage();

        console.log("Form Data:", formData);
        setFormData({ englishName: "", nativeName: "", code: "" });
    }

    const addUiLaunguage = async () => {
        try {
            const response = await axios.post(`${REACT_APP_API_URL}/UiLanguageModel/addUiLaunguage`, formData,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            if (response.data.status === 1) {
                setMessage(response.data.message);
                setMessageType("success");
                // Optionally, refresh the language list here
                getAllUiLanguages();
            }
            else {
                setMessage(response.data.message || "Failed to add language");
                setMessageType("error");
            }
        }
        catch (error) {

            console.error("Error adding language:", error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Server error");
            }
            setMessageType("error");
        }


    }

    const getAllUiLanguages = async () => {
        const response = await axios.get(`${REACT_APP_API_URL}/UiLanguageModel/getUiLanguage`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        );
        setLanguages(response.data.data);
    }

    const updateLanguage = async () => {
        try {
            const response = await axios.put(`${REACT_APP_API_URL}/UiLanguageModel/updateUiLanguageById/${popup.data._id}`, editData,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            if (response.data.status === 1) {
                setMessage(response.data.message);
                setMessageType("success");
                getAllUiLanguages();
                setPopup({
                    type: "",
                    data: null,
                });
            }
            else {
                setMessage(response.data.message || "Failed to update language");
                setMessageType("error");
            }
        }
        catch (error) {
            console.error("Error updating language:", error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Server error");
            }
            setMessageType("error");
        }
    }

    const deleteLanguage = async (id) => {
        try {
            const response = await axios.delete(`${REACT_APP_API_URL}/UiLanguageModel/deleteUiLanguage/${id}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            if (response.data.status === 1) {
                setMessage(response.data.message);
                setMessageType("success");
                getAllUiLanguages();
            }
            else {
                setMessage(response.data.message || "Failed to delete language");
                setMessageType("error");
            }
        } catch (error) {
            console.log(error);

            if (error.response && error.response.data) {

                setMessage(error.response.data.message);

            } else {

                setMessage("Server error");

            }
            setMessageType("error");
        }

    }

    const filterLanguages = async (value) => {

        try {

            if (!value) {
                getAllUiLanguages();
                return;
            }

            const response = await axios.get(
                `${REACT_APP_API_URL}/UiLanguageModel/filterUiLanguages`,
                {
                    params: {
                        search: value
                    },
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }

            );

            if (response.data.status === 1) {
                setLanguages(response.data.data);
            }

        } catch (error) {

            console.log(error);

        }

    };

    return (
        <>
            {message && (
                <p
                    className={`app-message ${messageType === "success" ? "success" : "error"
                        }`}
                >
                    {message}
                </p>
            )}
            <div className="ui-lang-page">

                {/* HEADER */}
                <div className="ui-lang-page__header">

                    <h2 className="ui-lang-page__title">
                        Supported UI Languages
                    </h2>

                    <div className="ui-lang-page__search">
                        <svg viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Search language..."
                            value={search}
                            onChange={(e) => {

                                const value = e.target.value;

                                setSearch(value);

                                filterLanguages(value);

                            }}
                        />
                    </div>

                </div>

                {/* ADD FORM (UI ONLY) */}
                <div className="ui-lang-page__card">

                    <h3 className="ui-lang-page__card-title">
                        Add New Language
                    </h3>

                    <div className="ui-lang-page__form">

                        <div className="ui-lang-page__field">
                            <label>Language (English)</label>
                            <input
                                type="text"
                                name="englishName"
                                placeholder="Hindi"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        englishName: e.target.value
                                    })
                                }
                                value={formData.englishName}
                            />
                        </div>

                        <div className="ui-lang-page__field">
                            <label>Language (Native)</label>
                            <input
                                type="text"
                                name="nativeName"
                                placeholder="हिंदी"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nativeName: e.target.value
                                    })
                                }
                                value={formData.nativeName}
                            />
                        </div>

                        <div className="ui-lang-page__field">
                            <label>Language Code</label>
                            <input
                                type="text"
                                name="code"
                                placeholder="hi"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value
                                    })
                                }
                                value={formData.code}
                            />
                        </div>

                        <button
                            className="ui-lang-page__btn"
                            disabled={!formData.englishName || !formData.nativeName || !formData.code}
                            onClick={submitForm}
                        >

                            Add Language
                        </button>

                    </div>

                </div>

                {/* TABLE */}
                <div className="ui-lang-page__table-wrapper">

                    <table className="ui-lang-page__table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>English Name</th>
                                <th>Native Name</th>
                                <th>Language Code</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {languages && languages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="no-data">
                                        No record found
                                    </td>
                                </tr>
                            ) :
                                (
                                    languages.map((lang, index) => (
                                        <tr>

                                            <td>{index + 1}</td>
                                            <td>{lang?.englishName}</td>
                                            <td>{lang?.nativeName}</td>
                                            <td>{lang?.code}</td>

                                            <td>
                                                <div className="ui-lang-page__actions">

                                                    <button
                                                        className="ui-lang-page__icon-btn ui-lang-page__icon-btn--edit"
                                                        onClick={() => {
                                                            setPopup({
                                                                type: "edit",
                                                                data: lang,
                                                            });

                                                            setEditData({
                                                                englishName: lang.englishName,
                                                                nativeName: lang.nativeName,
                                                                code: lang.code,
                                                            });
                                                        }}
                                                    >
                                                        <svg viewBox="0 0 24 24">
                                                            <path d="M12 20h9" />
                                                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        className="ui-lang-page__icon-btn ui-lang-page__icon-btn--delete"
                                                        onClick={() => deleteLanguage(lang._id)}
                                                    >
                                                        <svg viewBox="0 0 24 24">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6l-1 14H6L5 6" />
                                                            <path d="M10 11v6" />
                                                            <path d="M14 11v6" />
                                                            <path d="M9 6V4h6v2" />
                                                        </svg>
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    ))
                                )}
                        </tbody>

                    </table>
                </div>

                {popup.type === "edit" && (
                    <div className="ui-lang-page__card_popup">
                        <div className="ui-lang-page__popup-box">

                            <h3 className="ui-lang-page__card-title">
                                Update Language
                            </h3>

                            <div className="ui-lang-page__form">

                                <div className="ui-lang-page__field">
                                    <label>Language (English)</label>
                                    <input
                                        type="text"
                                        name="englishName"
                                        placeholder="Hindi"
                                        value={editData.englishName}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                englishName: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="ui-lang-page__field">
                                    <label>Language (Native)</label>
                                    <input
                                        type="text"
                                        name="nativeName"
                                        placeholder="हिंदी"
                                        value={editData.nativeName}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                nativeName: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="ui-lang-page__field">
                                    <label>Language Code</label>
                                    <input
                                        type="text"
                                        name="code"
                                        placeholder="hi"
                                        value={editData.code}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                code: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <button
                                    className="ui-lang-page__btn"
                                    disabled={!editData.englishName || !editData.nativeName || !editData.code}
                                    onClick={updateLanguage}
                                >
                                    Update Language
                                </button>


                                <button
                                    className="ui-lang-page__close__btn"
                                    onClick={() =>
                                        setPopup({
                                            type: "",
                                            data: null,
                                        })
                                    }
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                    </div>
                )}

            </div>

        </>
    );
}