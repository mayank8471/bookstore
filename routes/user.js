const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuthentication } = require("./userAuth");
//sign-up

router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    //username should be more than 4 charactors
    if (username.length < 4)
      return res
        .status(500)
        .json({ message: "Username should be more than 4 charactors " });
    //username exist
    const existuser = await User.findOne({ username: username });
    if (existuser)
      return res.status(400).json({ message: "existing username" });
    // check email is existing
    const existemail = await User.findOne({ email: email });
    if (existemail)
      return res.status(400).json({ message: "Email Is already Existing" });

    //check password length
    if (password.length <= 6)
      return res
        .status(400)
        .json({ message: "Password length should be more than 6 charactors" });

    //encrypting password
    const hashpass = await bcrypt.hash(password, 10);
    //new user
    const newuser = User({
      username: username,
      email: email,
      password: hashpass,
      address: address,
    });
    await newuser.save();
    return res.status(200).json({ message: "user created" });
  } catch (error) {
    res.status(500).json("Internal Server error");
  }
});

//sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    //finding user
    const finduser = await User.findOne({ username: username });
    if (!finduser) return res.json({ message: "Username does not exist" })

    await bcrypt.compare(password, finduser.password, (err, data) => {
      if (data) {
        const authclaims = [
          { name: finduser.username },
          { role: finduser.role },
        ];

        const token = jwt.sign({ authclaims }, "bookStore123", {
          expiresIn: "30d",
        });
        res.status(200).json({
          message: "Sign in Sucessfully",
          id: finduser.id,
          role: finduser.role,
          token: token,
        });
      } else return res.json({ message: "Password Not Match" }).status(400);
    });
  } catch (error) {
    res.status(500).json({ message: "internal error" });
  }
});

router.get("/get-user-information", userAuthentication, async (req, res) => {
  try {
    const { id } = req.headers;

    const finduser = await User.findById(id).select("-password");
    return res.status(200).json({
      status: "succes",
      data: finduser
    });
  } catch (error) {
    res.status(500).json("Internal Server error");
  }
});
router.put("/update-address", userAuthentication, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    console.log(address);

    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "Address updated Succesfully" });
  } catch (error) {
    res.status(500).json("Internal Server error");
  }
});
module.exports = router;
