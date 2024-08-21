const jwt = require("jsonwebtoken");

const userAuthentication = (req, res, next) => {
  const authheader = req.headers["authorization"];
  const token = authheader.split(" ")[1];
  if (token == null) return res.json({ message: "Token Exxpired" }).status(400);

  jwt.verify(token, "bookStore123", (err, data) => {
    if (err)
      return res.status(400).json({ message: "invalid token, token Expired" });
    req.user = data;
    next();
  });
};
module.exports = { userAuthentication };
