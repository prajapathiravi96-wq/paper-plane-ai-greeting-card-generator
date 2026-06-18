import express from 'express';
import {
  generateCard,
  generateMemoryCard,
  getCards,
  getCardById,
  deleteCard,
  toggleFavoriteCard,
} from '../controllers/cardController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-card', generateCard);
router.post('/generate-memory-card', generateMemoryCard);
router.get('/cards', optionalProtect, getCards);

router.route('/cards/:id')
  .get(optionalProtect, getCardById)
  .delete(optionalProtect, deleteCard);

router.put('/cards/:id/favorite', optionalProtect, toggleFavoriteCard);

export default router;
