import { Router } from 'express';
import * as poetryModel from './poetry/poetryModel.js';

const router = Router();

// full poem
router.get('/poem/:start', async (req, res) => {
  const response = await poetryModel.fullPoem(decodeURIComponent(req.params.start));
  res.send(response);
})

export default router; 