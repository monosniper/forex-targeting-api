const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')

router.get('/balance', indexController.balance);
router.put('/balance', indexController.addBalance);

router.get('/targets', indexController.getTargets);
router.get('/targets/:id', indexController.getTarget);
router.post('/targets', indexController.buyTarget);
router.put('/targets', indexController.toggleTarget);

module.exports = router;
