const userService = require("../services/userService");

const loginUser = async (req, res) => {
  const { body } = req;

  if (!body.claims.name || !body.claims.email) {
    return res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'name', 'email'",
      },
    });
  }

  const newUser = {
    name: body.claims.name,
    email: body.claims.email,
    avatar: body.claims.picture,
    rol:
      body.claims.email === "oskar.calvo@aeg.eus"
        ? "mortimer"
        : body.claims.email === "ozarate@aeg.eus"
        ? "villain"
        : body.claims.email === "classcraft.daw2@aeg.eus"
        ? "joshua"
        : "acolyte",
    userState: null,
    idSocket: null,
  };

  try {
    const createdUser = await userService.loginUser(newUser);
    const resObj = {
      user: createdUser,
    };
    if (createdUser.rol === "mortimer" || createdUser.rol === "villain") {
      const acolytes = await userService.getAcolytes();
      resObj.acolytes = acolytes;
    }
    res.status(201).send({ status: "OK", data: resObj });
  } catch (error) {
    res.status(error?.status || 500).send({
      status: "FAILED",
      message: "Error al realizar la petición:",
      data: { error: error?.message || error },
    });
  }
};

module.exports = {
  loginUser,
};
