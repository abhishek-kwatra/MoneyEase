const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Strategy } = require("passport-local");
const session = require("express-session");
const env = require("dotenv");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const app = express();
const port = 4000;
env.config();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hash = await bcrypt.hash(password, 10);
      const result = await db.query("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *", [username, hash]);
      req.session.user = { user_id: result.rows[0].user_id };
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: 'Session save error', error: err });
        }
        console.log('Session data after registration:', req.session);
        return res.status(200).json(req.session);
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post("/creategroup", function (req, res) {
  console.log('Session data in /creategroup:', req.session);
  const userId = req.session.user ? req.session.user.user_id : null;
  console.log('User ID from session:', userId);
  if (userId) {
    res.send(`User ID from session: ${userId}`);
  } else {
    res.status(401).send('No user ID in session');
  }
});

passport.use("local", new Strategy(async function verify(username, password, cb) {
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      bcrypt.compare(password, user.password_hash, (err, valid) => {
        if (err) return cb(err);
        if (valid) return cb(null, user);
        return cb(null, false);
      });
    } else {
      return cb(null, false);
    }
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser((user, cb) => {
  cb(null, user.user_id);
});
passport.deserializeUser(async (user_id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    cb(null, result.rows[0]);
  } catch (err) {
    cb(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

