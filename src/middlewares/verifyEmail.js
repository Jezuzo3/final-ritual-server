const verifyEmail = async (req, res, next) => {
    const email = req.body.claims.email;
    const studentEmail = "@ikasle.aeg.eus";

    if (email.includes(studentEmail) || email === "oskar.calvo@aeg.eus"
        || email === "ozarate@aeg.eus" || email === "classcraft.daw2@aeg.eus") {
        console.log(`${email} is a valid email`);
        return next();
    }

    return res.status(401).send({
        status: "FAILED",
        message: "invalid email",
    });
};

exports.verifyEmail = verifyEmail;