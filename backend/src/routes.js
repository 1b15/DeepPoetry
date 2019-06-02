import { Router } from 'express';
import * as poetryModel from './poetry/poetryModel.js';

const router = Router();

poetryModel.init()

// static files
router.get('/', function (req, res) {
  res.send('TODO static files');
})

// full poem
router.get('/poem/:start', async (req, res) => {
  const response = await poetryModel.fullPoem(decodeURIComponent(req.params.start));
  res.send(response);
})

export default router;