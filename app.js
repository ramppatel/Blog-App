// Required Modules

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/users");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const { checkForAuthentication } = require("./middlewares/auth");
const Blog = require("./models/blog");
const PORT = process.env.PORT || 8001;

mongoose.connect(process.env.MONGO_URL)
        .then((err) =>  console.log("MongoDB Connected !!!"));

const app = express();

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

// Middelware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve("./public")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req,res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
})

app.get("/logout",(req,res) => {
    res.clearCookie("token").redirect("/");
});

app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.listen(PORT,()=>{
    console.log("Server is Started at PORT : ",PORT);
});