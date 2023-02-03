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

const updateUserByEmail = async (email, changes) => {
    try {
        const updatedUser = await User.updateUserByEmail(email, changes);
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

const getIdSocketByRol = async (rol) => {
    try {
        const idSocket = await User.getIdSocketByRol(rol);
        return idSocket;
    } catch (error) {
        throw error;
    }
};

const updateUserByIdSocket = async (idSocket, changes) => {
    try {
        const updatedUser = await User.updateUserByIdSocket(idSocket, changes);
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    loginUser,
    getAcolytes,
    updateUserByEmail,
    getIdSocketByRol,
    updateUserByIdSocket
}