const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.js");
const usersRoutes = require("./routes/users.js");
const postRoutes = require("./routes/posts.js");

const port = 5000;


dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE);
        console.log("connectr to mongoDB");
    } catch (error) {
        console.log(error);
    }
};

app.use(express.json());
app.use(morgan("common"));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/posts", postRoutes);

app.listen(port, () => {
    connect();
    console.log("server is running on port "+ port);
});