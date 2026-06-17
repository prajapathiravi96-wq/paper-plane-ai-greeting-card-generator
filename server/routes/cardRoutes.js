import express from 'express';
import {
  generateCard,
  getCards,
  getCardById,
  deleteCard,
} from '../controllers/cardController.js';

const router = express.Router();

router.post('/generate-card', generateCard);
router.get('/cards', getCards);

router.route('/cards/:id')
  .get(getCardById)
  .delete(deleteCard);

export default router;
