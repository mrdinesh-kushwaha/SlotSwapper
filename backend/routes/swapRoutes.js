const express = require('express');
const router = express.Router();
const swapCtrl = require('../controllers/swapController');
const auth = require('../middleware/authMiddleware');

router.get('/swappable-slots', auth, swapCtrl.getSwappableSlots);
router.post('/swap-request', auth, swapCtrl.createSwapRequest);
router.get('/swap-requests', auth, swapCtrl.getSwapRequests);
router.post('/swap-response/:id', auth, swapCtrl.respondToSwap);

module.exports = router;
