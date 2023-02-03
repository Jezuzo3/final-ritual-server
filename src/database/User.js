const User = require('../models/userModel');

const loginUser = async (newUser) => {
    try {
        const user = await User.findOne({ email: newUser.email });
        if (!user) {
            const userToInsert = new User(newUser);
            const createdUser = await userToInsert.save();
            return createdUser;
        }

        return user;
    } catch (error) {
        throw error;
    }
};

const getAcolytes = async () => {
    try {
        const acolytes = await User.find({ rol: "acolyte" });
        return acolytes;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    loginUser,
    getAcolytes
}