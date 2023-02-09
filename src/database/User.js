const User = require("../models/userModel");

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

const updateUserByEmail = async (email, changes) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $set: changes },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const getIdSocketByRol = async (rol) => {
  try {
    const user = await User.findOne({ rol: rol });
    const idSocket = user.idSocket;
    return idSocket;
  } catch (error) {
    throw error;
  }
};

const updateUserByIdSocket = async (idSocket, changes) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { idSocket: idSocket },
      { $set: changes },
      { new: true }
    );

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
  updateUserByIdSocket,
};
