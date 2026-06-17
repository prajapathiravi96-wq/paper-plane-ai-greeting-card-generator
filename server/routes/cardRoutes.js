import express from 'express';
import {
  generateCard,
  getCards,
  getCardById,
  deleteCard,
  toggleFavoriteCard,
} from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-card', generateCard);
router.get('/cards', protect, getCards);

router.route('/cards/:id')
  .get(protect, getCardById)
  .delete(protect, deleteCard);

router.put('/cards/:id/favorite', protect, toggleFavoriteCard);

export default router;
