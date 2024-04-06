import "./post.css";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Heart } from "../animatedSvg/heart/Heart";
import EmojiPicker from "emoji-picker-react";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { Comments } from "../comments/Comments";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { Likes } from "../likes/Likes";
export default function Post({
  post,
  updatePosts,
  updateDeletedPosts,
  updateEditedPosts,
}) {
  const [lastTap, setLastTap] = useState(0);
  const [like, setLike] = useState(post.likes ? post.likes.length : 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikedTransition, setIsLikedTransition] = useState(false);
  const [user, setUser] = useState({});
  const [isDelete, setIsDelete] = useState(false);
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isEmoji, setIsEmoji] = useState(false);
  const [isViewComments, setIsViewComments] = useState(false);
  const [editedPostText, setEditedPostText] = useState(post.desc);
  const [viewLikedUser, setViewLikedUser] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setLike(post.likes ? post.likes.length : 0);
    setIsLiked(post.likes?.includes(currentUser._id));
  }, [post.likes, currentUser._id]);

  const handleLike = () => {
    try {
      axios.put("/api/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const toggleComments = () => {
    setIsViewComments(!isViewComments);
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users?userId=${post.userId}`);
        // console.log(res);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUser();
  }, [post.userId]);

  const updatePost = async (postId, userId, updatedData) => {
    try {
      const response = await axios.put(`/api/posts/${postId}`, {
        userId,
        desc: updatedData,
      });
      console.log(response.data);
      toggleEdit();
    } catch (error) {
      console.error(error);
    }
  };
  const deletePost = async (postId, userId) => {
    try {
      const response = await axios.delete(`/api/posts/${postId}`, {
        data: { userId },
      });
      updateDeletedPosts(postId);
      console.log(response.data); // Success message
    } catch (error) {
      console.log(error);
    }
  };

  const toggleOptions = (post_id) => {
    if (post_id) {
      setIsDelete(!isDelete);
    }
  };
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  const handleUpdate = async () => {
    try {
      await updatePost(post._id, user._id, editedPostText);
      updateEditedPosts(post._id);
      toggleEdit();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };
  const handleTouch = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      console.log("Double tap detected");
      handleLike();
      !isLiked && setIsLikedTransition(true);
    }
    setLastTap(now);
  };

  useEffect(() => {
    if (isLikedTransition) {
      const timeout = setTimeout(() => {
        setIsLikedTransition(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLikedTransition]);
  return (
    <>
      <div className="post">
        <div className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
              {/* <Link to={`profile/${user.username}`}> */}
              {currentUser._id === post.userId ? (
                <img
                  className="postProfileImg"
                  src={
                    user.profilePicture
                      ? currentUser.profilePicture
                      : `${PublicFolder}/person/no_avatar.jpeg`
                  }
                  alt=""
                  // onClick={() => navigate(`profile/${user.username}`)}
                />
              ) : (
                <img
                  className="postProfileImg"
                  src={
                    user.profilePicture
                      ? user.profilePicture
                      : `${PublicFolder}/person/no_avatar.jpeg`
                  }
                  alt=""
                  onClick={() => navigate(`profile/${user.username}`)}
                />
              )}
              {/* </Link> */}
              <span className="postUsername">{user.username}</span>
              <span className="postDate">
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
            {user._id === currentUser._id && (
              <div className="postTopRight">
                {!isEditing ? (
                  <div className="postTopRightOption" onClick={toggleEdit}>
                    <ModeEditOutlineIcon />
                  </div>
                ) : (
                  <div className="postTopRightOption" onClick={handleUpdate}>
                    Save
                  </div>
                )}
                <div
                  className="postTopRightOption"
                  onClick={() => toggleOptions(post._id)}
                >
                  <DeleteIcon />
                  {isDelete && (
                    <ResponsiveDialog
                      open={isDelete}
                      handleClose={() => setIsDelete(false)}
                      handleAgree={() => deletePost(post._id, user._id)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="postCenter">
            {isEditing ? (
              <>
                <div className="textArea">
                  <textarea
                    className="caption"
                    value={editedPostText}
                    onChange={(e) => setEditedPostText(e.target.value)}
                  />

                  <span onClick={() => setIsEmoji(!isEmoji)}>
                    <AddReactionIcon />
                  </span>
                </div>
                <EmojiPicker
                  emojiStyle="google"
                  open={isEmoji}
                  onEmojiClick={(selectedEmoji) => {
                    const emojiString = selectedEmoji.emoji;
                    setEditedPostText((prevText) => prevText + emojiString);
                    setIsEmoji(false);
                  }}
                />
              </>
            ) : (
              <span className="caption">{post?.desc}</span>
            )}
            {isLikedTransition && <Heart liked={isLikedTransition} />}
            <div className="postImgDiv">
              <img
                className="postImg"
                src={post.img}
                alt=""
                onClick={handleTouch}
              />
            </div>
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              <div
                className="likeIcon"
                src={`${PublicFolder}heart.png`}
                alt=""
                onClick={handleLike}
              >
                {!isLiked ? <CiHeart /> : <FaHeart />}
              </div>

              <span
                className="postLikeCounter"
                onClick={() => setViewLikedUser(!viewLikedUser)}
              >
                {like} people loved it
              </span>
              {viewLikedUser && <Likes likes={post.likes} />}
            </div>
            <div className="postBottomRight">
              <Comments
                post={post}
                user={user}
                toggleComments={toggleComments}
                isViewComments={isViewComments}
              />
              {/* <span className="postCommentText">{post.comment} comments</span> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ResponsiveDialog({ open, handleClose, handleAgree }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{"Delete Post?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this post?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleAgree} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
