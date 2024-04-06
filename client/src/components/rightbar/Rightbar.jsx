import "./rightbar.css";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";
import { ads } from "../../dummyData";
import { Users } from "../../dummyData";
export default function Rightbar({ user }) {
  const onlineFriends = Users.filter((friend) => friend.id !== 1);
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser, user]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/api/users/friends/" + user?._id);
        setFriends(friendList.data);
      } catch (error) {
        console.log(error);
      }
    };
    const interval = setInterval(() => {
      setAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 4000);

    getFriends();

    return () => clearInterval(interval);
  }, [user]);

  const handleFollowClick = async () => {
    try {
      if (followed) {
        await axios.put("/api/users/" + user._id + "/unfollow", {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put("/api/users/" + user._id + "/follow", {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.log(error);
    }
    setFollowed(!followed);
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img
            className="birthdayImg"
            src={`${PublicFolder}gift.jpeg`}
            alt=""
          />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <div className="rightbarAdDiv">
          <img
            className="rightbarAd"
            src={`${PublicFolder + ads[adIndex].photo}`}
            alt=""
          />
        </div>

        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {onlineFriends.map((user) => {
            return <Online key={user.id} user={user} />;
          })}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <div className="profileRightBarParent">
        <div className="profileRightBarTop">
          {user.username !== currentUser.username && (
            <button
              className="rightbarFollowButton"
              onClick={handleFollowClick}
            >
              {followed ? "Unfollow" : "Follow"}
              {followed ? <Remove /> : <Add />}
            </button>
          )}
          <div className="rightbarInfo">
            <h4 className="rightbarTitle">User Information Title</h4>
            <div className="rightbarInfoItem">
              <span className="rightbarInfoKey">City:</span>
              <span className="rightbarInfoValue">
                {user.city || "unknown"}
              </span>
            </div>
            <div className="rightbarInfoItem">
              <span className="rightbarInfoKey">From:</span>
              <span className="rightbarInfoValue">
                {user.from || "unknown"}
              </span>
            </div>
            <div className="rightbarInfoItem">
              <span className="rightbarInfoKey">Relationship:</span>
              <span className="rightbarInfoValue">
                {user.relationship === 1
                  ? "Single"
                  : user.relationship === 2
                  ? "Married"
                  : user.relationship === 3
                  ? "it's Complicated"
                  : "unknown"}
              </span>
            </div>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => {
            return (
              <Link
                key={friend._id}
                to={"/profile/" + friend.username}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={
                      friend.profilePicture
                        ? friend.profilePicture
                        : PublicFolder + "person/no_avatar.jpeg"
                    }
                    alt=""
                    className="rightbarFollowingImage"
                  />
                  <span className="rightbarFollowingName">
                    {friend.username}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper"></div>
      {user ? <ProfileRightbar /> : <HomeRightbar />}
    </div>
  );
}
