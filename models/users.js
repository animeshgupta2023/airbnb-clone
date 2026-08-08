const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// FIX FOR NODE v22+:
// 1. Import the module
const plugin = require("passport-local-mongoose");
// 2. Extract the actual function (fallback to plugin if it's an older version)
const passportLocalMongoose = plugin.default || plugin; 

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);