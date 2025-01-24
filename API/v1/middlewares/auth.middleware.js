const User = require("../models/user.model");
module.exports.requireAuth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const userToken = req.headers.authorization.split(' ')[1];
            //req.header have header include: bearer GmHuJv86Aqis6mJklTRP
            const user = await User.findOne({ userToken: userToken, deleted: false }).select("-password");
            if (!user) {
                throw new Error('invalid token !');
            }
            req.user = user;
            next();
        } else {
            throw new Error('Token does not exist !');
        }
    } catch(error) {
        res.json({
            code: 400,
            message: error.message
        });
    }
}