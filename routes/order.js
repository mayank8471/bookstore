const router = require("express").Router()
const { userAuthentication } = require('./userAuth')
const Order = require('../models/order')
const User = require('../models/user')

router.post("/place-order", userAuthentication, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;
    for (const orderdata of order) {
      const newOrder = Order({ user: id, books: orderdata._id })
      const neworderfordb = await newOrder.save()
      await User.findByIdAndUpdate(id, {
        $push: { order: neworderfordb._id }
      })
      await User.findByIdAndUpdate(id, { $pull: { cart: orderdata._id } })
    }
    return res.json({
      status: "success",
      message: "Order Placed succcesfully"
    })
  } catch (error) {
    return res.status(500).json({ message: "internal Error" })
  }
})

router.get("/get-order-history", userAuthentication, async (req, res) => {
  try {
    const { id } = req.headers
    const userdata = await User.findById(id).populate({
      path: "order",
      populate: { path: "books" }
    })

    const orderdata = userdata.order.reverse()
    return res.json({
      status: "succes",
      data: orderdata
    })
  } catch (error) {
    return res.status(500).json({ message: "internal Error" })
  }
})

router.get("/get-all-order", userAuthentication, async (req, res) => {
  try {

    const order = await Order.find().populate({
      path: "books"
    })
      .populate({
        path: "user"
      })
      .sort({ createdAt: -1 })


    return res.json({
      status: "success",
      data: order
    })
  } catch (error) {
    return res.status(500).json({ message: "internal Error" })
  }
})

router.put("/update-status/:id", userAuthentication, async (req, res) => {
  try {
    const { id } = req.params

    await Order.findByIdAndUpdate(id, { status: req.body.status })
    return res.json({
      status: 'success',
      message: "Order status changed"
    })
  } catch (error) {
    return res.status(500).json({ message: "internal Error" })
  }
})

module.exports = router;