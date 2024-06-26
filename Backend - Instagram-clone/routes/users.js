const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require("bcryptjs");


//! users განახლება

router.put("/:id", async (req, res ) => {
    if(req.body.userId = req.params.id || req.body.isAdmin){
        if (req.body.password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                res.status(500).send(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            res.status(200).json("account has been updated!")
        } catch (error) {
            res.status(500).json(error)
        }
    }
})

//! users წაშლა

router.delete("/:id", async (req, res ) => {
    if(req.body.userId = req.params.id || req.body.isAdmin){
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("account has been deleted!");
        } catch (error) {
            res.status(500).json(error)
            
        }
    }
})


//! users წამოღება

router.get("/", async (req, res ) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({username: username})
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error);
    } 
})

//! users წამოღება ყველას

router.get("/list", async (req, res ) => {
    
    try {
        const users = await User.find({})
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error);
    } 
})

// ! follow to a user

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("User has been followed!");
        } else {
          res.status(403).send("You are not following this user!");
        }
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      res.status(403).send("You can't follow yourself!");
    }
  });  

// !  unfollow-ის თემა

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("User has been unfollowed!");
        } else {
          res.status(403).send("You are not unfollowing this user");
        }
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      res.status(403).send("You can't unfollow yourself!");
    }
  });

module.exports = router;