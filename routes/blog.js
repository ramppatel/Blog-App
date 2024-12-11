const express = require("express");
const multer = require("multer");
const router = express.Router();
const Blog = require("../models/blog");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/uploads/`); // Specify your upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file
    }
});

const upload = multer({ storage: storage });

// Route to render the add blog page
router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});

// Route to handle blog submission with file upload
router.post("/", upload.single('coverImage'), async (req, res) => {
    const {title,body} = req.body; // Get the form data
    // console.log("Request Body:", body.title); // Access title from the body
    // console.log("Uploaded File:", req.file); // Access the uploaded file info

    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    // console.log("Created Blog ",blog);

    return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id",async (req,res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    // console.log("Blog ",blog);
    return res.render("blog",{
        blog,
    });
});

module.exports = router;
