const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.get("/sigin", (req,res) => {
    return res.render("sigin");
});


router.get("/signup",(req,res) => {
    return res.render("signup");
});

router.get("/signin",(req,res) => {
    return res.render("signin");
});


router.post("/signup", async (req,res) => {
    const {fullName, email, password} = req.body;
    const result = await User.create({
        fullName,
        email,
        password,
    });

    // console.log("Created User ",result);

    return res.redirect("/");
});

router.post("/signin", async (req,res) => {
    try{
        const {email,password} = req.body;
        const token = await User.matchPasswordAndGenerateToken(email,password);

        // console.log("token ",token);
        return res.cookie("token",token).redirect("/");
    }
    catch(err){
        return res.render("signin",{
            error: "Invalid Email or Password",
        });
    }
});



module.exports = router;