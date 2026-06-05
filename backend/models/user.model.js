const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: { type: string, unique: [true, "username already taken"], required: true },
    email: { type: string, unique: [true, "Email already taken"], required: [true, "email is required"] },
    password: {
        type: string,
        required: [true, "password is required"]
    }
})

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;