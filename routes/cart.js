const router = require("express").Router()
const { userAuthentication } = require('./userAuth')
const User = require('../models/user')

//add to cart
router.put("/add-to-cart", userAuthentication, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userdata = await User.findById(id);

    const isbookcart = userdata.cart.includes(bookid);
    if (isbookcart)
      return res.status(200).json({ message: "Book already in cart" });

    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({ message: "Book Added in cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//remove to cart
router.delete(
  "/remove-book-from-cart",
  userAuthentication,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userdata = await User.findById(id);

      const isbookcart = userdata.cart.includes(bookid);
      if (isbookcart)
        await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      return res.status(200).json({ message: "Book Removed from cart" });

    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//get all books from cart
router.get("/get-allbook-cart", userAuthentication, async (req, res) => {
  try {
    const { id } = req.headers

    const userdata = await User.findById(id).populate("cart")

    const book = userdata.cart;

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


module.exports = router