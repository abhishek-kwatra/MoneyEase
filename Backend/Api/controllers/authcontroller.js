// import bcrypt from "bcrypt.js";
// import db from "../config/database";

// const saltRounds = 10;

// export const register = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const checkResult = await db.query("SELECT * FROM users WHERE EMAIL = $!", [
//       email,
//     ]);
//     if (checkResult.rows.length > 0) {
//       res.redirect("/login");
//     } else {
//       bcrypt.hash(passsword, saltRounds, async (err, hash) => {
//         if (err) {
//           console.error("Error hashing password:", err);
//           res.status(500).send({ message: "Error registering user" });
//         } else {
//           await db.query(
//             "INSERT INTO users (username, password) VALUES ($1, $2)",
//             [email, hashedPassword]
//           );
//           res.status(201).send({ message: "User registered successfully" });
//         }
//       });
//     }
//   } catch (err) {
//     res.status(500).send({ message: "Error registering user" });
//   }
// };

// export const logout = (req, res) => {
//     req.logout((err) => {
//       if (err) {
//         return res.status(500).send({ message: 'Error logging out' });
//       }
//       res.send({ message: 'Logged out successfully' });
//     });
//   };
  
//   export const isAuthenticated = (req, res) => {
//     if (req.isAuthenticated()) {
//       res.send({ isAuthenticated: true, user: req.user });
//     } else {
//       res.send({ isAuthenticated: false });
//     }
//   };
