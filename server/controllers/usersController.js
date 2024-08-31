const User = require("../model/userModel");
const brcypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "All fields are required.", status: false });
        }
        if (password.length < 8) {
            return res.json({ msg: "Password must be at least 8 characters long", status: false });
        }
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.status(400).json({ msg: "Username already used", status: false });
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(400).json({ msg: "Email already used", status: false });
        }
        const hashedPassword = await brcypt.hash(password, 10);
        const user = await User.create({
            email, username, password: hashedPassword,
        })
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ msg: "All fields are required.", status: false });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ msg: "Incorrect username or password", status: false });
        }
        const isPasswordValid = await brcypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Incorrect username or password", status: false });
        }
        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        if (!avatarImage) {
            return res.status(400).json({ msg: "Avatar image is required." });
        }
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        })
    } catch (ex) {
        next(ex)
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email", "username", "avatarImage", "_id",
        ]);
        return res.json(users);
    } catch (error) {
        next(error);
    }
}