const router = require("express").Router();
const User = require("../models/user");
const { userAuthentication } = require("./userAuth");
const books = require("../models/book");

//book added to favourite
router.put("/add-book-to-favourite", userAuthentication, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userdata = await User.findById(id);

    const isbookfavourite = userdata.favourites.includes(bookid);
    if (isbookfavourite)
      return res.status(200).json({ message: "Book already added" });

    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ message: "Book Added" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete book from favourite
router.delete(
  "/remove-book-from-favourite",
  userAuthentication,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userdata = await User.findById(id);

      const isbookfavourite = userdata.favourites.includes(bookid);
      if (isbookfavourite)
        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

      return res.status(200).json({ message: "Book Deleted" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//get favorite book
router.get("/get-favourite-book", userAuthentication, async (req, res) => {
  try {
    const { id } = req.headers

    const userdata = await User.findById(id).populate("favourites")

    const book = userdata.favourites;

    return res.json({
      status: "success",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});
module.exports = router;
