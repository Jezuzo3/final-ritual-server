const User = require('../database/User');

const loginUser = async (newUser) => {
    try {
        const createdUser = User.loginUser(newUser);
        return createdUser;
    } catch (error) {
        throw error;
    }
};

const getAcolytes = async () => {
    try {
        const acolytes = await User.getAcolytes();
        return acolytes;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    loginUser,
    getAcolytes
}