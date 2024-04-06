import { useEffect, useState } from "react";
import { fetchUser } from "../../apiCalls";
import "./likes.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Avatar } from "@mui/material";

export const Like = ({ like }) => {
  const [likedUser, setLikedUser] = useState("");

  useEffect(() => {
    const fetchLikeUser = async (id) => {
      try {
        const res = await fetchUser(id);
        setLikedUser(res);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchLikeUser(like);
  }, [like]);

  return (
    // <div className="userLikeDiv">
    // </div>
    <ListItem>
      <Avatar
        alt={likedUser.username}
        src={likedUser.profilePicture}
        sx={{ width: 24, height: 24 }}
      />

      <p className="likedUser">{likedUser.username}</p>
    </ListItem>
  );
};

export const Likes = ({ likes }) => {
  return (
    <div className="likesParent">
      <List>
        {likes?.map(
          (
            like,
            index // Add key prop to each Like component
          ) => (
            <Like key={index} like={like} />
          )
        )}
      </List>
    </div>
  );
};
