var userModel = require("../models/user");
var jwt = require("jsonwebtoken");
const userHelperFunction = require("../utils/user");
const saltRounds = 10;

const userController = {};
async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (name == undefined || email == undefined || password == undefined) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }
    const hashPassword = await userHelperFunction.hashPassword(password);

    const userEntry = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    if (userEntry?._id !== undefined) {
      const token = jwt.sign(
        { user_id: userEntry._id, email },
        process.env.TOKEN_KEY
      );
      const cloneUserEntry = { ...userEntry };
      const updatedUserEntry = cloneUserEntry._doc;
      updatedUserEntry.token = token;
      delete updatedUserEntry.password;
      delete updatedUserEntry._id;
      console.log(updatedUserEntry);

      return res
        .json({ message: "User Successfully created", data: updatedUserEntry })
        .status(200);
    } else {
      return res
        .status(400)
        .json({ message: "Error while entering in registration Database" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Something went wrong" });
  }
}

async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    if (email == undefined || password == undefined) {
      return res.status(400).json({ message: "Please provide both parameter" });
    }
    const user = await userModel.findOne({ email: email });
    if (user) {
      const userPassword = user.password;
      const compare = await userHelperFunction.comparePassword(
        password,
        userPassword
      );
      if (compare) {
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY
        );
        const updatedEntry = JSON.parse(JSON.stringify(user));
        delete updatedEntry.password;
        delete updatedEntry._id;
        updatedEntry.token = token;
        return res
          .status(200)
          .json({ message: "Login Successful", data: updatedEntry });
      } else {
        return res.status(400).json({ message: "Password don't match" });
      }
    } else {
      return res.status(400).json({ message: "No User Exist with this email" });
    }
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong" });
  }
}

const validateToken = async (req, res, next) => {
  const { user_id } = req.user;
  const userInformation = await userModel.findOne({ _id: user_id });
  const cloneUserInformation = JSON.parse(JSON.stringify(userInformation));
  delete cloneUserInformation._id;
  delete cloneUserInformation.password;
  return res.status(200).json({ data: cloneUserInformation });
};

userController.signup = signup;
userController.signin = signin;
userController.validateToken = validateToken;
module.exports = userController;
