const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')

router.post('/users', indexController.login);

router.get('/balance', indexController.balance);
router.put('/balance', indexController.addBalance);

router.get('/targets', indexController.getTargets);
router.get('/targets/:id', indexController.getTarget);
router.delete('/targets/:id', indexController.deleteTarget);
router.post('/targets', indexController.buyTarget);
router.post('/pre-targets', indexController.preTarget);
router.put('/targets', indexController.toggleTarget);

module.exports = router;
