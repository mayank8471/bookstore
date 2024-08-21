const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors())
app.use(express.json());
require("./conn/conn");
require("dotenv").config();

const Books = require("./routes/books");
const favourite = require("./routes/favourites");
const user = require("./routes/user");
const Cart = require("./routes/cart")
const Order = require("./routes/order")

app.use("/api/v1/", user);
app.use("/api/v1/", Books);
app.use("/api/v1/", favourite);
app.use("/api/v1/", Cart);
app.use("/api/v1/", Order);

app.listen(process.env.PORT, () => {
  console.log(`Server Strated at Port : ${process.env.PORT}`);
});
