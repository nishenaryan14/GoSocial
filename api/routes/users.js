const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  console.log("req.body.userId:", req.body.userId);
  console.log("req.params.id:", req.params.id);
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});
//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (username) {
      user = await User.findOne({ username: username });
    } else {
      // If neither userId nor username is provided, return an error
      return res
        .status(400)
        .json({ message: "User ID or username is required" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const followingFriends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    const followerFriends = await Promise.all(
      user.followers.map((friendId) => {
        return User.findById(friendId);
      })
    );

    const friendMap = new Map();

    // Add following friends to the map
    followingFriends.forEach((friend) => {
      friendMap.set(friend._id.toString(), friend);
    });

    // Add follower friends to the map
    followerFriends.forEach((friend) => {
      friendMap.set(friend._id.toString(), friend);
    });

    // Extract unique friends from the map
    const friendList = [...friendMap.values()];

    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
});
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user have unfollowed this user");
      } else {
        res.status(403).json("you don't follow this user!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can't unfollow yourself");
  }
});
module.exports = router;
