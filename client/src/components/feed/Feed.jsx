import React, { Suspense, useContext, useEffect, useState } from "react";
import { List } from "react-virtualized"; // Import List component from react-virtualized
import { Skeleton } from "@mui/material";
import LocalSeeIcon from "@mui/icons-material/LocalSee";
import { fetchPosts } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
const SkeletonPost = () => {
  return (
    <div className="skeleton">
      <Skeleton variant="circular" animation="wave" width={40} height={40} />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={530}
        height={250}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={530}
        height={80}
      />
    </div>
  );
};

const Feed = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [postUpdated, setPostUpdated] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchPosts(username, user._id);
        const sortedPosts = res?.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        });
        setPosts(sortedPosts);
        setPostUpdated(false);
      } catch (error) {
        console.error("Error fetching and sorting posts:", error);
      }
    };

    fetchData();
  }, [username, user._id, postUpdated]);

  const updatePosts = (newPost) => {
    if (newPost) {
      setPosts((posts) => [newPost, ...posts]);
      setPostUpdated(true);
    }
  };

  const updateEditedPosts = (newPost) => {
    if (newPost) {
      setPostUpdated(true);
    }
  };

  const updateDeletedPost = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
  };

  const rowRenderer = ({ index, key, style }) => {
    const post = posts[index];

    return (
      <div key={key} style={style} className="postList">
        <Suspense fallback={<SkeletonPost />}>
          <Post
            post={post}
            updateDeletedPosts={updateDeletedPost}
            updatePosts={updatePosts}
            updateEditedPosts={updateEditedPosts}
          />
        </Suspense>
      </div>
    );
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && (
          <Share updatePosts={updatePosts} />
        )}
        {posts.length === 0 ? (
          <div className="noPost">
            <div className="noPostImg">
              <LocalSeeIcon sx={{ width: 56, height: 56 }} />
            </div>
            <div className="noPostText">No Post Yet</div>
          </div>
        ) : (
          <div className="listContainer">
            <List
              width={530}
              height={800}
              className="list"
              rowCount={posts.length}
              rowHeight={630}
              rowRenderer={rowRenderer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
