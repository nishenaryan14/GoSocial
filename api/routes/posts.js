const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const NodeCache = require("node-cache");
const cache = new NodeCache();

// Middleware to cache responses
const cacheMiddleware = (req, res, next) => {
  const cacheKey = req.originalUrl; // Use the request URL as the cache key
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    console.log("Serving from cache");
    res.json(cachedResponse);
  } else {
    next(); // Proceed to the route handler if response is not cached
  }
};

//create a post
router.post("/", async (req, res) => {
  const { userId, desc, img } = req.body; // Destructure the post data
  try {
    // Create a new Post instance with the provided data
    const newPost = new Post({
      userId,
      desc,
      img, // Set the img field to the received image URL
    });
    const savedPost = await newPost.save(); // Save the new post to the database
    res.status(200).json(savedPost); // Send the saved post as a JSON response
  } catch (err) {
    res.status(500).json(err); // Handle any errors and send them as JSON response
  }
});
//update post
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete post
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like unlike post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//comments route
router.get("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
});

router.post("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = {
      userId: req.body.userId,
      content: req.body.content,
    };
    post.comments.push(newComment);
    await post.save();
    return res.status(201).json(post.comments); // Use 201 status code for resource creation
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
});

router.put("/:id/comment/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { _id, userId } = req.body; // Assuming the request body contains both commentId and userId

    const comment = post.comments.find(
      (comment) => comment._id.toString() === _id
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const likedIndex = comment.likes.indexOf(userId);
    if (likedIndex === -1) {
      // If not liked already, add user ID to likes array
      comment.likes.push(userId);
    } else {
      // If already liked, remove user ID from likes array
      comment.likes.splice(likedIndex, 1);
    }

    await post.save();
    res.status(200).json({ message: "Like status updated successfully" });
  } catch (error) {
    console.error("Error updating like status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get a post

router.get("/:id", cacheMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});
//get timeline posts
router.get("/timeline/:userId", cacheMiddleware, async (req, res) => {
  try {
    // getting current user posts
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    //multiple promises return for friends posts
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user's all posts

router.get("/profile/:username", cacheMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
