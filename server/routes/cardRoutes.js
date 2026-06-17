import express from 'express';
import {
  generateCard,
  getCards,
  getCardById,
  deleteCard,
  toggleFavoriteCard,
} from '../controllers/cardController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-card', generateCard);
router.get('/cards', optionalProtect, getCards);

router.route('/cards/:id')
  .get(optionalProtect, getCardById)
  .delete(optionalProtect, deleteCard);

router.put('/cards/:id/favorite', optionalProtect, toggleFavoriteCard);

export default router;
