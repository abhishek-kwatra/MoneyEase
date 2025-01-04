import express from 'express';
import passport from 'passport';
import { register, logout, isAuthenticated } from '../controllers/';

const router = express.Router();

router.post('/register', register);
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({ message: 'Logged in successfully' });
});
router.get('/logout', logout);
router.get('/authenticated', isAuthenticated);

module.exports = router;