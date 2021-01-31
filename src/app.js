const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const users = [{ id: 1, email: "damian@poczta.pl", password: "secret" }];

app.get("/", (req, res) => {
  res.send("Working...");
});

app.get("/api/users", authenticante, (req, res) => {
  res.status(200).json(req.user);
});

app.post("/api/login", (req, res) => {
  //Take user input
  const email = req.body.email;
  const password = req.body.password;

  //Check if user exsist
  const user = users.filter((user) => user.email === email)[0];

  if (!user) {
    res.status(404).json({ error: "There is no user with that email" });
    return;
  }

  //Check if given password is correct
  if (user.password === password) {
    //If so, create a token
    const accessToken = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: 5,
    });

    //Send created token
    res
      .cookie("JWT", accessToken, {
        maxAge: 5000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ accessToken });
    return;
  }

  res.status(401).json({ error: "Wrong password" });
});

function authenticante(req, res, next) {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  const token = req.cookies.JWT;

  if (!token) return res.status(401).json({ error: "You must be logged in" });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token expired" });
    req.user = user;
    next();
  });
}

app.listen(3000, () => {
  console.log("Application is running on PORT 3000");
});
