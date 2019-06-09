import { Router } from 'express';
import * as poetryOutput from './poetry/poetryOutput.js';

const router = Router();

// full poem
router.get('/poem/:start', async (req, res) => {
  const response = await poetryOutput.fullPoem(decodeURIComponent(req.params.start));
  res.send(response);
})

export default router; 