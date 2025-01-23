const User = require("../models/user.model");
const md5 = require('md5');
// [GET] api/v1/register
module.exports.register = async (req, res) => {
    try {
        const existUser = await User.findOne({ email: req.body.email, deleted: false });
        if (existUser) {
            throw new Error('User already exist !');
        }
        req.body.password = md5(req.body.password);
        const user = new User({
            fullName: req.body.email,
            email: req.body.email,
            password: req.body.password
        })
        await user.save();
        const token = user.userToken;
        res.cookie('token', token);
        res.json({
            code: 200,
            message: "Create account successfully !",
            token: token
        });
    } catch(error) {
        res.json({
            code: 400,
            message: error.message
        });
    }
}