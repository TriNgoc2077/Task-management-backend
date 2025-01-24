const { generateRandomNumber } = require('../../../helpers/generate');
const User = require("../models/user.model");
const ForgotPassword = require('../models/forgot-password.model');
const { sendMail } = require('../../../helpers/sendMail');
const md5 = require('md5');
// [POST] api/v1/register
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

// [POST] api/v1/login
module.exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const existUser = await User.findOne({ email: email, deleted: false });
        if (existUser) {
            if (md5(password) !== existUser.password) {
                throw new Error('Password is incorrect !');
            }
        } else {
            throw new Error('Email already exist !');
        }
        const token = existUser.userToken;
        res.cookie('token', token);
        res.json({
            code: 200,
            message: "Login successfully !",
            token: token
        });
    } catch(error) {
        res.json({
            code: 400,
            message: error.message
        });
    }
}

//[POST] /password/forgot
module.exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email, deleted: false });
        if (!user) {
            throw new Error('User does not exist !');
        }
        const otp = generateRandomNumber(6);
        const timeExpire = 3;
        const objectForgotPassword = {
            email: email,
            otp: otp,
            expireAt: Date.now()
        }
        const recordForgotPassword = new ForgotPassword(objectForgotPassword);
        await recordForgotPassword.save();
        //send mail
        const subject = "Your OTP";
        sendMail(email, subject, user, otp);
        res.json({
            code: 200,
            message: "Sent",
        })
    } catch(error) {
        res.json({
            code: 400,
            message: error.message
        });
    }
}

//[POST] /password/otp
module.exports.otpPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const record = await ForgotPassword.findOne({ email: email, otp: otp });
        if (!record) {
            throw new Error('OTP is invalid !');
        }
        const user = await User.findOne({ email: email, deleted: false });
        const token = user.userToken;
        res.cookie('token', token);

        res.json({
            code: 200,
            message: "Verify success !",
            token: token
        })
    } catch(error) {
        res.json({
            code: 400,
            message: error.message
        });
    }
}

//[POST] /password/reset
module.exports.resetPassword = async (req, res) => {
    try {
        const token = req.body.token;
        const password = md5(req.body.password);
        const passwordConfirm = md5(req.body.passwordConfirm);
        const user = await User.findOne({ userToken: token });
        if (!user) {
            throw new Error('user does not exist !');
        }
        if (password !== passwordConfirm) {
            throw new Error('password or password confirm do not match !');
        }
        if (password == user.password) {
            throw new Error('new password cannot be the same as old password !');
        }
        await User.updateOne(
            { userToken: token },
            { password: password }
        );
        res.json({
            code: 200,
            message: "Reset password successfully !",
            token: token
        })
    } catch(error) {
        res.json({
            code: 400,
            message: error.message
        });
    }
}