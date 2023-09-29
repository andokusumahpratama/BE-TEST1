const express = require('express');

const dataController = require('./../controller/dataController');
const authController = require('./../controller/authController');

const router = express.Router();

router.route('/source-type').get(dataController.getSourceAttackType);
router
    .route('/source-type/:sourceCountry')
    .get(
        authController.protect, 
        authController.restrictTo('user'),
        dataController.getDataSourceAttackType
    );

router.route('/destination-type').get(dataController.getDestinationAttackType);
router.route('/destination-type/:destinationCountry').get(authController.protect, dataController.getDataDestinationAttackType);

module.exports = router;