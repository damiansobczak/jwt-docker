const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const users = [{ id: 1, email: "damian@poczta.pl", password: "secret" }];

app.get("/", (req, res) => {
  res.send("Witam");
});

app.get("/api/users", authenticante, (req, res) => {
  res.send(req.user);
});

app.post("/api/login", (req, res) => {
  //Pobierz dane
  const email = req.body.email;
  const password = req.body.password;

  //Sprawdź czy istnieje user
  const user = users.filter((user) => user.email === email)[0];

  if (!user) {
    console.log("Nie ma uzytkownika");
    res.sendStatus(404);
    return;
  }

  //Sprawdź czy podał dobre hasło
  if (user.password === password) {
    //Utwórz token
    const accessToken = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: 10,
    });
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: 525600,
      }
    );
    //Wyślij token
    res.send({ accessToken, refreshToken });
    return;
  }

  console.log("Błędne hasło");
  res.sendStatus(401);
});

function authenticante(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log("User zautentykowany!");
    next();
  });
}

app.listen(3000, () => {
  console.log("Application is running on PORT 3000, hello");
});
