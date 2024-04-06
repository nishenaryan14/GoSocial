import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { CheckCircleOutline } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
export default function Share({ updatePosts }) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [isPosted, setIsPosted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [postContext, setPostContext] = useState(false);

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    setPostContext(true);
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      img: null, // Initially set to null
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      try {
        const response = await axios.post("/upload", data);
        // console.log(response);
        newPost.img = response.data; // Set the img field to the received image URL
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.post("/posts", newPost);
      desc.current.value = "";
      setFile(null);
      setLoading(false);
      setIsPosted(true);
      updatePosts(newPost);
    } catch (err) {
      setError(true);
      setLoading(false);
      console.log(err);
    } finally {
      setPostContext(false);
      setTimeout(() => {
        setIsPosted(false);
        setError(false);
      }, 3000);
    }
  };

  return (
    <>
      <div className="alertBox">
        {loading && <CircularProgress />}
        {isPosted && (
          <Alert
            iconMapping={{
              success: <CheckCircleOutline fontSize="inherit" />,
            }}
          >
            Yeaahh!....u have made a post
          </Alert>
        )}
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Can't share your post ...try again
          </Alert>
        )}
      </div>
      <div className="share">
        <div className="shareWrapper">
          <div className="shareTop">
            <img
              className="shareProfileImg"
              src={
                user?.profilePicture
                  ? user.profilePicture
                  : PF + "person/no_avatar.jpeg"
              }
              alt=""
            />
            <input
              placeholder={"What's in your mind " + user.username + "?"}
              className="shareInput"
              ref={desc}
            />
          </div>
          <hr className="shareHr" />
          {!postContext && file && (
            <div className="shareImgContainer">
              <img
                className="shareImg"
                src={URL.createObjectURL(file)}
                alt=""
              />
              <Cancel
                className="shareCancelImg"
                onClick={() => setFile(null)}
              />
            </div>
          )}

          <form className="shareBottom" onSubmit={submitHandler}>
            <div className="shareOptions">
              <label htmlFor="file" className="shareOption">
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo or Video</span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
              <div className="shareOption">
                <Label htmlColor="blue" className="shareIcon" />
                <span className="shareOptionText">Tag</span>
              </div>
              <div className="shareOption">
                <Room htmlColor="green" className="shareIcon" />
                <span className="shareOptionText">Location</span>
              </div>
              <div className="shareOption">
                <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
                <span className="shareOptionText">Feelings</span>
              </div>
            </div>
            <button className="shareButton" type="submit">
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
