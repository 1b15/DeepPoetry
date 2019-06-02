import { Router } from 'express';
import fullPoem from './poetry/poetryModel.js';

const router = Router();

// static files
router.get('/', function (req, res) {
    res.send('TODO static files');
  })

// full poem
router.get('/poem/:start', function (req, res) {
    const response = fullPoem(decodeURIComponent(req.params.start));
    res.send(response);
  })
  
export default router;