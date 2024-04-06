import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import "./profile.css";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";

export default function Profile() {
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [dp, setDp] = useState("");
  const [previewProfilePicture, setPreviewProfilePicture] = useState(null);
  const username = useParams().username;
  const imgRef = useRef(null);
  const { user: currentUser } = useContext(AuthContext);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/?username=${username}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUser();
  }, [username]);

  const handleClick = () => {
    setIsEditing(!isEditing);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
    setPreviewProfilePicture(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const requestData = {
        userId: currentUser._id,
        profilePicture: null,
      };
      if (profilePicture) {
        const data = new FormData();
        const fileName = Date.now() + profilePicture.name;
        data.append("name", fileName);
        data.append("file", profilePicture);
        try {
          const response = await axios.post("/upload", data);
          requestData.profilePicture = response.data;
          currentUser.profilePicture = requestData.profilePicture;
          setDp(requestData.profilePicture);
        } catch (err) {
          console.log(err);
        }
      }
      const response = await axios.put(`/users/${user._id}`, requestData, {});

      console.log("Profile picture updated:", response.data);
      setProfilePicture(null);
      setPreviewProfilePicture(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <>
      <div className="profile">
        {currentUser._id === user._id && (
          <div className="editOption" onClick={handleClick}>
            {!isEditing ? <FaUserEdit /> : <p onClick={handleSubmit}>Save</p>}
          </div>
        )}

        <div className="profileRight">
          <img
            className="profileCoverImg"
            src={
              user.coverPicture
                ? user.coverPicture
                : `https://gosocial001.s3.ap-south-1.amazonaws.com/noCover.jpeg`
            }
            alt=""
          />
          <div className="profileRightTop">
            <div className="profileCover">
              {currentUser._id === user._id ? (
                <img
                  className="profileUserImg"
                  src={
                    previewProfilePicture ||
                    // dp ||
                    currentUser.profilePicture ||
                    `${PublicFolder}/person/no_avatar.jpeg`
                  }
                  alt=""
                />
              ) : (
                <img
                  className="profileUserImg"
                  src={
                    previewProfilePicture ||
                    // dp ||
                    user.profilePicture ||
                    `${PublicFolder}/person/no_avatar.jpeg`
                  }
                  alt=""
                />
              )}

              {isEditing && (
                <>
                  <label className="editBtn" htmlFor="imgUpload">
                    <MdModeEditOutline />
                  </label>
                  <input
                    type="file"
                    id="imgUpload"
                    ref={imgRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div
            className={`profileRightBottom ${
              isTabletOrMobile && "mobileProfile"
            }`}
          >
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
