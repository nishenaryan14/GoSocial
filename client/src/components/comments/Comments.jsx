import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./comments.css";
import { fetchUser } from "../../apiCalls";
import { Comment } from "../comment/Comment";
import SendIcon from "@mui/icons-material/Send";

export const Comments = ({ post, toggleComments, isViewComments }) => {
  const { user: currentUser } = useContext(AuthContext);
  const ref = useRef();
  const [comments, setComments] = useState([]);
  const [isCommented, setIsCommented] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchComments = async () => {
      if (post && post._id) {
        try {
          const response = await axios.get(
            `${apiUrl}/posts/${post._id}/comment`
          );
          console.log(response.data);
          setComments(response.data);

          const userDetailsArray = await Promise.all(
            response.data.map(async (comment) => {
              try {
                const userDetails = await fetchUser(comment.userId);
                return userDetails;
              } catch (error) {
                console.error("Error fetching user details:", error);
                return null;
              }
            })
          );

          const updatedComments = response.data.map((comment, index) => {
            return {
              ...comment,
              user: userDetailsArray[index],
            };
          });

          setComments(updatedComments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      } else {
        console.log("post or post._id is not defined");
      }
    };

    fetchComments();
  }, [post, isCommented]);

  const handleSubmit = async () => {
    const comment = ref.current.value;

    const tempComment = {
      userId: currentUser._id,
      content: comment,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/posts/${post._id}/comment`,
        tempComment
      );
      setIsCommented(true);
      console.log(response.data);

      const userDetails = await fetchUser(currentUser._id);

      const newComment = {
        ...response.data,
        user: userDetails,
      };

      // Update comments with the new comment
      setComments((prevComments) => [newComment, ...prevComments]);

      ref.current.value = "";
      setIsCommented(false);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="comments">
      <div className="commentInput">
        <input
          type="text"
          ref={ref}
          key={post._id}
          onKeyDown={handleKeyPress}
          placeholder="Comment Here..."
        />
        <div className="postComment" onClick={handleSubmit}>
          <SendIcon />
        </div>

        <span className="viewComments" onClick={toggleComments}>
          View All
        </span>
      </div>

      {isViewComments && (
        <div className="commentsDiv">
          {comments.map((comment) => (
            <Comment comment={comment} post={post} key={comment._id} />
          ))}
        </div>
      )}
    </div>
  );
};
