const express = require('express');
const router = express.Router();
const eventCtrl = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/', eventCtrl.listUserEvents);
router.post('/', eventCtrl.createEvent);
router.put('/:id', eventCtrl.updateEvent);
router.delete('/:id', eventCtrl.deleteEvent);

router.patch('/:id/make-swappable', eventCtrl.makeSwappable);
router.patch('/:id/make-busy', eventCtrl.makeBusy);

module.exports = router;
