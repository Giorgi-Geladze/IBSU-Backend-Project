const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require("bcryptjs");

//! რეგისტრაცია
//? რეგისტრაცია
router.post('/register', async (req, res) => {
    try {
        const { fullname, userName, email, password, bio, profilePicture} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullname,
            userName,
            email,
            password: hashedPassword,
            bio,
            profilePicture,
        })

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        !user && res.status(404).send("user name not found!");

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )

        if(!validPassword){
            res.status(403).send("invalid password!")
        } else{
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;