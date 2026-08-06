const express = require("express");
const router = express.Router();

// index - user
router.get("/", (req, res)=>{
    res.send("Get for user!");
});

// show - user
router.get("/:id", (req, res)=>{
    res.send("Get for user id!");
});

// post - user
router.post("/", (req, res)=>{
    res.send("post for user!");
});

// delete - user
router.delete("/:id", (req, res)=>{
    res.send("delete for user!");
});


module.exports = router;