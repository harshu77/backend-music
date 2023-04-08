const jwt = require("jsonwebtoken");
require("dotenv").config();
const config = process.env;

const verifyToken = (req, res, next) => {
  console.log(req.headers);
  const authorizationHeader = req.headers["authorization"];

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  next();
};

module.exports = verifyToken;

// const auth = require("./middleware/auth");

// app.post("/welcome", auth, (req, res) => {
//   res.status(200).send("Welcome 🙌 ");
// });
