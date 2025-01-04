const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Strategy } = require("passport-local");
const session = require("express-session");
const env = require("dotenv");
const GoogleStrategy = require("passport-google-oauth2");
const multer = require("multer");
const vision = require("@google-cloud/vision");
const path = require("path");

const app = express();
const port = 4000||process.env.PORT;
app.use(express.json());
env.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 86400000,
      secure: false,
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "Lax", // Set to 'None' and secure to true if using HTTPS
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const saltRounds = 10;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// db.query("Select * from users", (err, res) => {
//   if (err) {
//     console.log("Error executing query, err.stack");
//   } else {
//     quiz = res.rows;
//   }
// });

app.get("/user_details", async(req, res)=>{
  try{
    const user_id = req.session.user.user_id;
  const result = await db.query(`Select username, userinfo, username2, contact_number from users where user_id = $1`,[user_id]);
  res.json(result.rows);
  }catch(err){
    res.status(500).send("An error occurred while fetching user details");
  }
})

app.get("/get_transaction", async (req, res) => {
  try {
    const userId = req.session.user.user_id; // Use query parameter or default to 2
    const result = await db.query(
      `SELECT es.user_id,u1.userinfo AS Receiver ,u2.userinfo AS Borrower, es.amount, e.paid_by,es.expense_split_id, e.description, e.created_at, 
       u2.userinfo AS paid_by_username, e.amount as total_amount,es.settled,
       CASE
           WHEN es.user_id = $1 AND e.paid_by != $1 THEN 'You owe ' || u2.username 
           WHEN e.paid_by = $1 AND es.user_id != $1 THEN  u1.username || ' owes you '
       END AS transaction_message,
       CASE
           WHEN es.user_id = $1 AND e.paid_by != $1 THEN 'borrowing'
           WHEN e.paid_by = $1 AND es.user_id != $1 THEN 'lending'
       END AS transaction_type
       FROM expense_splits es
       JOIN expenses e ON es.expense_id = e.expense_id
       JOIN users u1 ON es.user_id = u1.user_id
       JOIN users u2 ON e.paid_by = u2.user_id
       WHERE (es.user_id = $1 OR e.paid_by = $1)
        AND e.paid_by != es.user_id`,
      [userId]
    );
    // Return the result as JSON
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("An error occurred while fetching transactions.");
  }
});

app.post("/register", async (req, res) => {
  // console.log(req.body);  
  const { username, password , userinfo, username2, contact_number} = req.body;

  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (checkResult.rows.length > 0) {
      // console.log("already found");
      return res.status(400).json({ message: "User already exists" });
    } else {
      const hash = await bcrypt.hash(password, 10);
      const result = await db.query(
        "INSERT INTO users (username, password_hash, userinfo, username2, contact_number) VALUES ($1, $2, $3, $4, $5) RETURNING * ",
        [username, hash, userinfo, username2, contact_number]
      );
      req.login(result.rows[0].username, function (user, error) {
        if (error) {
          return res.status(500).json({
            message: error || "Something happened",
            message: error.message || "Server error",
          });
        }
        const user_id = result.rows[0];
        req.session.user = user_id;
        req.session.save((err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Session save error", error: err });
          }
          user.isAuthenticated = true;
          const s = req.session.data;
          console.log(s);
          return res.status(200).json(user);
          // return res.json(user);
        });
      });
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      // console.log("got hthth");
      // setState((prevState) => ({
      //   ...prevState,
      //   success: false,
      //   error: err.response.data.message,
      // }));
      navigate("/login"); // navigate to login page if user already exists
    }
    //  else {
    //   setState((prevState) => ({
    //     ...prevState,
    //     error: err.message,
    //     success: false,
    //   }));
    // }
  }
});

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (error, user, info) {
    if (error) {
      return res.status(500).json({
        message: error || "Something happened",
        error: error.message || "Server error",
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "Authentication failed",
        error: info ? info.message : "Invalid credentials",
      });
    }

    req.logIn(user, function (error) {
      if (error) {
        return res.status(500).json({
          message: error || "Something happened",
          error: error.message || "Server error",
        });
      }
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Session save error", error: err });
        }
        // console.log("Session data after login:", req.session);
        return res.status(200).json(user);
      });
    });
  })(req, res, next);
});

app.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({
        message: "Logout failed",
        error: err.message || "Server error",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "Session destruction failed",
          error: err.message || "Server error",
        });
      }
      res.clearCookie("connect.sid", { path: "/" }); // Domain is not usually necessary unless you explicitly set it
      // console.log("User logged out successfully");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

app.get("/user_profile", async(req, res)=>{
  const{username, userinfo, username2, contact_number} = req.session.user;
  return res.status('200').json({username, userinfo, username2, contact_number} );
});

app.get("/api/friends", async (req, res) => {
  const username = req.query.query;
  if (!username) {
    return res
      .status(400)
      .send({ error: "Username query parameter is required" });
  }

  try {
    const result = await db.query(
      "SELECT username FROM users WHERE username ILIKE $1",
      [`%${username}%`]
    );
    res.send(result.rows);
  } catch (err) {
    console.error("Error querying database", err);
    res.status(500).send({ error: "Server error" });
  }
});

app.post("/creategroup", async (req, res) => {
  const grpname = req.body.group;
  const userId = req.session.user.user_id;
  const usernames = req.body.usernames;

  // Manual validation
  if (!grpname || typeof grpname !== "string" || grpname.length > 100) {
    return res.status(400).json({ error: "Invalid group name" });
  }
  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    const existingGroupResult = await db.query(
      "SELECT group_id FROM groups WHERE group_name = $1",
      [grpname]
    );

    let groupId;
    if (existingGroupResult.rows.length > 0) {
      groupId = existingGroupResult.rows[0].group_id;
    } else {
      // Insert new group into database
      // console.log("Creating new group");
      const groupResult = await db.query(
        "INSERT INTO groups (group_name, created_by) VALUES ($1, $2) RETURNING group_id",
        [grpname, userId]
      );
      groupId = groupResult.rows[0].group_id;
    }

    // Check if current user is already in group_members
    console.log("Checking if current user is already in group_members");
    const existingMemberResult = await db.query(
      "SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, userId]
    );

    if (existingMemberResult.rows.length === 0) {
      // console.log("Adding current user to group_members");
      await db.query(
        "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
        [groupId, userId]
      );
    } else {
      console.log("Current user is already a member of the group");
    }

    // Validate and add other users
    const invalidUsernames = [];
    for (const username of usernames) {
      // console.log(`Validating user: ${username}`);
      const userResult = await db.query(
        "SELECT user_id FROM users WHERE username = $1",
        [username]
      );

      if (userResult.rows.length > 0) {
        const userToAddId = userResult.rows[0].user_id;
        // console.log(`Checking if user ${username} is already in group_members`);
        const existingUserInGroup = await db.query(
          "SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2",
          [groupId, userToAddId]
        );

        if (existingUserInGroup.rows.length === 0) {
          // console.log(`User ${username} found, adding to group_members`);
          await db.query(
            "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
            [groupId, userToAddId]
          );
        } else {
          console.log(`User ${username} is already a member of the group`);
        }
      } else {
        // console.log(`User ${username} not found, adding to invalidUsernames`);
        invalidUsernames.push(username);
      }
    }

    if (invalidUsernames.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid usernames: ${invalidUsernames.join(", ")}` });
    }

    // Respond with success
    // console.log("Group created/updated successfully");
    res
      .status(201)
      .json({ message: "Group created/updated successfully", groupId });
  } catch (error) {
    // Handle errors
    console.error("Error creating/updating group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createfriend", async (req, res) => {
  try {
    // Ensure user_id1 is always the smaller ID
    const user_id1 = req.session.user.user_id;
    const response = await db.query(
      "SELECT user_id FROM users WHERE username = $1",
      [req.body.friend_name]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user_id2 = response.rows[0].user_id;

    // Swap user_id1 and user_id2 if needed to satisfy the constraint
    const [firstUser, secondUser] =
      user_id1 < user_id2 ? [user_id1, user_id2] : [user_id2, user_id1];

    // Check if the friendship already exists
    const friendshipCheck = await db.query(
      `SELECT 1 FROM friendships WHERE (user_id1 = $1 AND user_id2 = $2) OR (user_id1 = $2 AND user_id2 = $1)`,
      [firstUser, secondUser]
    );

    if (friendshipCheck.rows.length > 0) {
      return res.status(400).json({
        error: `${req.body.friend_name} is already a friend of yours`,
      });
    }

    // Insert the new friendship if it does not exist
    await db.query(`INSERT INTO friendships (user_id1, user_id2) VALUES ($1, $2)`,
      [firstUser, secondUser]
    );

    res.status(200).json({
      message: `Friendship created between ${req.session.user.username} and ${req.body.friend_name}`,
    });
  } catch (err) {
    console.error("Error creating friendship:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get_groups", async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const result = await db.query(
      "SELECT g.group_id, g.group_name, g.created_by FROM groups g JOIN group_members gm ON g.group_id = gm.group_id where gm.user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    return [];
  }
});
app.get("/get_friends", async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    // Query to get friends where the current user is either user_id1 or user_id2
    const result = await db.query(
      `SELECT 
         CASE 
           WHEN user_id1 = $1 THEN user_id2
           ELSE user_id1
         END AS friend_id
       FROM friendships 
       WHERE user_id1 = $1 OR user_id2 = $1`,
      [userId]
    );

    const usernames = [];

    // Fetch usernames for each friend
    for (const row of result.rows) {
      const friendId = row.friend_id;

      const users = await db.query(
        "SELECT user_id, username FROM users WHERE user_id = $1",
        [friendId]
      );

      if (users.rows.length > 0) {
        usernames.push(users.rows[0]);
      }
    }

    // Return the list of friends as JSON
    res.json(usernames);
  } catch (err) {
    // console.log("Error fetching friends:", err);
    res.status(500).send("An error occurred while fetching friends.");
  }
});

app.get("/get_group_members", async (req, res) => {
  const groupId = req.query.group_id;
  try {
    const result = await db.query(
      //changed gm.joined_at added here
      `SELECT u.username , u.user_id, gm.joined_at, u.userinfo 
       FROM users u
       JOIN group_members gm ON gm.user_id = u.user_id
       WHERE gm.group_id = $1 AND u.user_id != $2`,
      [groupId, req.session.user.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching group members:", err);
    res.status(500).json({ error: "Failed to fetch group members" });
  }
});
app.get("/get_group_expenses", async (req, res) => {
  // const { group_id } = req.params;
  const group_id = req.query.group_id; 
  try {
    const result = await db.query(
      `SELECT 
          e.expense_id,
          e.created_at AS expense_date,
          u.username AS paid_by,
          u.userinfo,
          e.description,
          e.amount
       FROM expenses e
       JOIN users u ON e.paid_by = u.user_id
       JOIN expense_groups eg ON e.expense_id = eg.expense_id
       WHERE eg.group_id = $1
       ORDER BY e.created_at DESC`,
      [group_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching group expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    // console.log("485", req.body); 
    if(req.body.paidby.username === "You"){   
      req.body.paidby.user_id = req.session.user.user_id;
    }
    // console.log( "489",req.session.user.user_id); 
    // console.log( "490",req.body); 

    const expenseId = await db.query(
      `INSERT INTO expenses (description, amount, paid_by, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING expense_id`,
      [req.body.description, req.body.amount, req.body.paidby.user_id]
    );

    // Helper function to get users in a group
    async function getUsersInGroup(groupId) {
      const result = await db.query(
        `SELECT u.user_id, u.username
           FROM group_members gm
           JOIN users u ON gm.user_id = u.user_id
           WHERE gm.group_id = $1`,
        [groupId]
      );
      return result.rows; // Returns an array of users in the group
    }

    // Store unique users using a Set
    let usersToSplitWith = new Set();

    // Add individual friends
    req.body.personName.forEach((payee) => {
      if(payee.username === 'You'){
        payee.user_id = req.session.user.user_id;
      }
      if (payee.type === "friend") {
        usersToSplitWith.add(payee.user_id);
      }
    });

    // Add users from groups
    for (const payee of req.body.personName) {
      if (payee.type === "group") {
        const groupUsers = await getUsersInGroup(payee.group_id);
        groupUsers.forEach((user) => {
          usersToSplitWith.add(user.user_id);
        });
      }
    }

    // Add the payer to the split
    if (!usersToSplitWith.has(req.body.paidby.user_id)) {
      usersToSplitWith.add(req.body.paidby.user_id);
    }
    

    // Calculate the split amount
    const splitAmount = req.body.amount / usersToSplitWith.size;

    // Insert into expense_splits table
    for (const user_id of usersToSplitWith) {
      const amountToInsert =
        user_id === req.body.paidby.user_id ? -splitAmount : splitAmount;
      // console.log(533, user_id, amountToInsert);
      
      await db.query(
        `INSERT INTO expense_splits (expense_id, user_id, amount)
         VALUES ($1, $2, $3)`,
        [expenseId.rows[0].expense_id, user_id, amountToInsert]
      );
    }

    // Insert into expense_groups if any groups were involved
    for (const payee of req.body.personName) {
      if (payee.type === "group") {
        await db.query(
          `INSERT INTO expense_groups (expense_id, group_id)
           VALUES ($1, $2)`,
          [expenseId.rows[0].expense_id, payee.group_id]
        );
      }
    }

    res.status(200).json({ message: "Expense added and split successfully" });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/settle", async (req, res) => {
  const amount = req.body.amount;
  const userIdToSettleWith = req.body.personId;
  const currentUserId = req.session.user.user_id;

  try {
    // Fetch outstanding transactions where the current user owes the specified user
    // const outstandingTransactions = await db.query(
    //   `SELECT es.expense_split_id, es.amount, e.paid_by, e.expense_id
    //    FROM expense_splits es
    //    JOIN expenses e ON es.expense_id = e.expense_id
    //    WHERE es.user_id = $1 AND e.paid_by = $2 AND es.amount > 0 AND es.settled = false
    //    ORDER BY es.amount ASC`,
    //   [currentUserId, userIdToSettleWith]
    // );
    const outstandingTransactions = await db.query(
      `WITH potential_matches AS (
        SELECT 
          es.expense_split_id, 
          es.amount, 
          e.paid_by, 
          e.expense_id
        FROM expense_splits es
        JOIN expenses e ON es.expense_id = e.expense_id
        WHERE es.user_id = $1 AND e.paid_by = $2 AND es.amount > 0 AND es.settled = false
      ),
      closest_match AS (
        SELECT * 
        FROM potential_matches
        WHERE amount >= $3
        ORDER BY amount ASC
        LIMIT 1
      )
      SELECT * 
      FROM closest_match
      UNION
      SELECT *
      FROM potential_matches
      WHERE amount < $3
      ORDER BY amount DESC
      LIMIT 1;
      `,
      [currentUserId, userIdToSettleWith, amount]
    );
    // console.log(outstandingTransactions);

    let remainingAmount = parseFloat(amount).toFixed(2);
    remainingAmount = parseFloat(remainingAmount);
    let requiredmore = 0;

    for (const transaction of outstandingTransactions.rows) {
      if (remainingAmount >= transaction.amount) {
        remainingAmount -= transaction.amount;
        // Mark the transaction as settled
        await db.query(
          `UPDATE expense_splits 
           SET settled = true 
           WHERE expense_split_id = $1`,
          [transaction.expense_split_id]
        );
        await db.query(
          `INSERT INTO settlements (expense_id, expense_split_id, amount, paid_by, paid_to)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            transaction.expense_id,
            transaction.expense_split_id,
            transaction.amount,
            currentUserId,
            userIdToSettleWith,
          ]
        );
      } else {
        requiredmore = transaction.amount - remainingAmount;
        // If the remaining amount does not fully cover the current transaction, stop the process
        break;
      }
    }
    // If there is any amount left after settling, and it's less than the smallest transaction, return an error
    if (remainingAmount > 0) {
      return res.status(400).json({
        error: `Settlement amount does not match any outstanding balances exactly. Remaining amount: ${remainingAmount.toFixed(
          2
        )} & Required More:${requiredmore.toFixed(2)} `,
      });
    }

    // Add an entry to the settlement table indicating this settlement
    res.status(200).json({ message: "Settlement successful!" });
  } catch (error) {
    console.error("Error settling transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const client = new vision.ImageAnnotatorClient({
<<<<<<< HEAD
=======
<<<<<<< HEAD
  keyFilename: path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS), // Use the correct environment variable
});

console.log("681",process.env.GOOGLE_APPLICATION_CREDENTIALS)  
const upload = multer({ storage: multer.memoryStorage() });
app.post("/api/ocr", upload.single("image"), async (req, res) => {
  
=======
>>>>>>> c739667 (Adding project)
  keyFilename: path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS), // Replace with the path to your JSON key file
});
const upload = multer({ storage: multer.memoryStorage() });
app.post("/api/ocr", upload.single("image"), async (req, res) => {
<<<<<<< HEAD
=======
>>>>>>> f882e97458762fd49ab363b163e05e728630aab5
>>>>>>> c739667 (Adding project)
  try {
    const fileBuffer = req.file.buffer;

    // Call Vision API to detect text
    const [result] = await client.textDetection(fileBuffer);
    const fullText = result.fullTextAnnotation.text;

<<<<<<< HEAD
    //console.log("Detected Text:", fullText);
=======
<<<<<<< HEAD
    console.log("Detected Text:", fullText);
=======
    //console.log("Detected Text:", fullText);
>>>>>>> f882e97458762fd49ab363b163e05e728630aab5
>>>>>>> c739667 (Adding project)

    // Extract the total amount
    const totalLine = fullText
      .split("\n")
      .find((line) => line.toLowerCase().includes("total"));

    const amountMatch = totalLine?.match(/\d+\.\d{2}/);

    res.json({
      total: amountMatch ? amountMatch[0] : "No total detected",
    });
  } catch (error) {
    console.error("Error in Vision API:", error);
    res.status(500).json({ error: "Failed to process the image" });
  }
});

app.get("/settle", async (req, res) => {
  const userId = req.session.user.user_id;
  try {
    // Single query to get both amounts using SUM
    const { rows } = await db.query(
      `SELECT 
          COALESCE(SUM(CASE WHEN paid_by = $1 THEN amount ELSE 0 END), 0) AS amount_spent,
          COALESCE(SUM(CASE WHEN paid_to = $1 THEN amount ELSE 0 END), 0) AS amount_received
       FROM settlements`,
      [userId]
    );

    const { amount_spent, amount_received } = rows[0];

    res.json({
      amount_spent,
      amount_received,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Just check for this in express-session module
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.status(401).json({ message: "Unauthorized" });
// };

// Your other routes here...

// app.get("/secrets", isAuthenticated, (req, res) => {
//   res.json({ message: "This is a secret page!" });
// });

app.get("/secrets", (req, res) => {
  req.redirect("/secrets");
});

app.get(
  "/auth/google",
  passport.authenticate("google", 
  { scope: ["profile", "email"] }),
  // (req,res)=>{
  // return "23";
  // }    
);

app.get(
  "/auth/google/success",
  // console.log(674),  
  passport.authenticate("google", {
    successRedirect: "/auth/success121",
    failureRedirect: "http://localhost:3000/login",
  }),
);

app.get("/auth/success121", (req, res)=>{
  return res.status(200).json({message: "User logged in successfully"});
});
app.post("/auth/google/user_details", async (req, res) => {
  // console.log(688);  
  try {
    const profile = req.body.profile; // Ensure profile is sent in the request body
    if (!profile || !profile.email) {
      return res.status(400).json({ error: "Invalid profile data" });
    }

    // Check if user exists
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [profile.email] // Use the email from the profile
    );
    // console.log("703", result.rows);

    if (result.rows.length === 0) {
      // Insert new user
      const newUser = await db.query(
        "INSERT INTO users (username, password_hash, userinfo, username2, contact_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [profile.email, "google", profile.given_name, profile.family_name, "1234567891"]
      );

      req.session.user = newUser.rows[0];
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res
            .status(500)
            .json({ message: "Session save error", error: err });
        }
        return res
          .status(200)
          .json({ message: "New user created", user: newUser.rows[0] });
      });
    } else {
      // User already exists
      req.session.user = result.rows[0];
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res
            .status(500)
            .json({ message: "Session save error", error: err });
        }
        return res
          .status(200)
          .json({ message: "User already exists", user: result.rows[0] });
      });
    }
  } catch (error) {
    console.error("Error in /auth/google/user_details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query(
        "SELECT * FROM users WHERE username = $1 ",
        [username]
      );
      if (result.rows.length > 0) {
        const user = result.rows[0];
        // console.log(user);
        const storedHashedPassword = user.password_hash;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            //Error with password check
            console.error("Error comparing passwords:", err);
            return cb(err, null);
          } else {
            if (valid) {
              //Passed password check
              return cb(null, user);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/success",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // console.log(profile);        
        const result = await db.query(
          "SELECT * FROM users WHERE username = $1 ",
          [profile.emails[0].value]
        );
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "Insert into users (username, password_hash) VALUES ($1, $2)",
            [profile.email, "google"]
          );
          cb(null, newUser.rows[0]);
        } else {
          //Already existing user
          cb(null, result.rows[0]);
        }
      } catch (err) {
        cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.user_id);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen({ port });
