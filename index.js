const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions"); // ✅ ADD THIS

require("./config/passport")(passport); 

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);
app.use("/api/transactions", transactionRoutes); // ✅ ADD THIS

mongoose.connect("mongodb://localhost:27017/Finance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.listen(5000, () => {
  console.log("Backend server running on http://localhost:5000");
});
