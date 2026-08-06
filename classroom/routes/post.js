const express = require("express");
const router = express.Router();

// posts
// index - post
router.get("/", (req, res)=>{
    res.send("Get for posts!");
});

// show - post
router.get("/:id", (req, res)=>{
    res.send("Get for posts id!");
});

// post - post
router.post("/", (req, res)=>{
    res.send("post for posts!");
});

// delete - post
router.delete("/:id", (req, res)=>{
    res.send("delete for posts!");
});

module.exports = router;