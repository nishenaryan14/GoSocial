import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import "./comment.css";

export const Comment = ({ comment, post }) => {
  const { user: currentUser } = useContext(AuthContext);
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const [like, setLike] = useState(comment.likes ? comment.likes.length : 0);
  const [isLiked, setIsLiked] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    setIsLiked(comment.likes?.includes(currentUser._id));
  }, [currentUser._id, comment.likes, comment._id]);

  const handleLike = () => {
    try {
      axios.put(`${apiUrl}/posts/" + post._id + "/comment/like`, {
        _id: comment._id,
        userId: currentUser._id,
      });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="comment" key={comment._id}>
      <div className="commentText">
        <div className="commentorDiv">
          <div className="imgDiv">
            <img
              src={
                comment.user?.profilePicture
                  ? comment.user?.profilePicture
                  : `${PublicFolder}/person/no_avatar.jpeg`
              }
              alt={comment.user && comment.user.username}
            />
          </div>
          <p className="userName">{comment.user && comment.user.username}</p>
        </div>
        <p>{comment.content}</p>
      </div>
      <div className="commentLikes">
        <div className="likesDiv" onClick={handleLike}>
          <div className="commentLike">
            {!isLiked ? <CiHeart /> : <FaHeart />}
          </div>
        </div>
        <p className="likeScore">{like}</p>
      </div>
    </div>
  );
};
