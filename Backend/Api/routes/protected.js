import express from 'express';
import { getProtectedData } from '../controllers/protectedController.js';

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

router.get('/', isAuthenticated, getProtectedData);

export default router;
