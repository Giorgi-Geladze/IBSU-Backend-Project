const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

// ! create post

router.post("/", async(req, res) => {
    const newPost = await new Post(req.body)
    try {
        constsavedPost = await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).send(error)
    }
})

// ! update post

router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId || isAdmin) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("The post has been updated!");
      } else {
        res.status(403).json("You can update only your post!");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

// ! delete post

router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId || isAdmin) {
        await post.deleteOne();
        res.status(200).json("The post has been deleted!");
      } else {
        res.status(403).json("You can delete only your post!");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

// ! get post

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ! get all posts with timeline

router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({userId: currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId})
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).send(err);
    }
});

//! get user's all posts

router.get("/profile/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).send(err);
    }
});


//! likes and dislikes

router.put("/:id/like", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.likes.includes(req.body.userId)) {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("the post has been unliked");
      } else {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("the post has been liked");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = router;