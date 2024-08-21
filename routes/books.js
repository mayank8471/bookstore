const router = require("express").Router();
const books = require("../models/book");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { userAuthentication } = require("./userAuth");

//add books
router.post("/add-books", userAuthentication, async (req, res) => {
  try {
    const { id } = req.headers;
    const checkadmin = await User.findById(id);


    if (checkadmin.role !== "admin")
      return res.status(400).json({ message: "You are Not the admin" });

    const { url, title, author, price, desc, language } = req.body;

    const newbooks = books({
      url: url,
      title: title,
      author: author,
      price: price,
      desc: desc,
      language: language,
    });
    await newbooks.save();
    return res.status(200).json({ message: "Books Added" });
  } catch (error) {
    res.status(500).json("Internal Server error");
  }
});
//update books
router.put("/update-book", userAuthentication, async (req, res) => {
  try {
    const { url, title, author, price, language } = req.body;
    const { bookid } = req.headers;


    await books.findByIdAndUpdate(bookid, {
      url: url,
      title: title,
      author: author,
      price: price,
      language: language,
    });
    return res.status(200).json({ message: "Book Updated Successfully" });
  } catch (error) {
    res.status(500).json("Internal Server error");
  }
});
//delete books
router.delete("/delete-book", userAuthentication, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await books.findByIdAndDelete(bookid);
    res.status(200).json({ message: "Books Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get all books

router.get("/get-all-books", async (req, res) => {
  try {
    const allbook = await books.find().sort({ createdAt: -1 });
    return res.json({
      status: "success",
      data: allbook,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get books limited only 4

router.get("/get-recent-books", async (req, res) => {
  try {
    const allbook = await books.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "success",
      data: allbook,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get books by id
router.get("/get-book-details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getbook = await books.findById(id);
    return res.json({
      status: "success",
      data: getbook,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
