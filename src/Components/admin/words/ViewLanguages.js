import React, { useEffect, useState } from "react";
import axios from "axios";
import usePageTitle from "../../../hooks/usePageTitle";
import { useNavigate } from "react-router-dom";

import FullScreenLoader from "../../FullScreenLoader";

export default function ViewLanguages() {

  usePageTitle("Languages");

  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {

    setLoading(true);

    axios
      .get(
        "http://localhost:5000/api/LearningLanguagesModel/getAllLearningLanguages"
      )
      .then(res => {

        if (res.data.status === 1) {
          setLanguages(res.data.data);
        }

      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);


  return (

    <>
      {loading && <FullScreenLoader />}

      <div className="view-word">

        <div className="view-word__card">


          {/* HEADER */}
          <div className="view-word__header">

            <button
              className="view-word__back-btn"
              onClick={() => window.history.back()}
            >
              ← Back
            </button>

            <h2>Languages</h2>

            <div />

          </div>


          {/* CONTENT */}
          <div className="view-word__content">

            {!loading && languages.length === 0 && (

              <div className="view-word__row">
                <span>No Languages Found</span>
              </div>

            )}


            {languages.map(lang => (

              <div
                key={lang._id}
                className="view-word__row"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(
                    `/admin/words/ViewChapters/${lang._id}`
                  )
                }
              >

                <span>Language</span>

                <p>{lang.english}</p>

              </div>

            ))}

          </div>

        </div>

      </div>
    </>

  );

}