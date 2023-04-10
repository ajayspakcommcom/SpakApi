const express = require('express');
const router = express.Router();

const controller = require('../controllers/tangerineController');

router.get('/tangerine/contact-list', controller.getContactListData);
router.post('/tangerine/add-contact', controller.addContactUs);

router.get('/tangerine/reservation-list', controller.getReservationListData);
router.post('/tangerine/add-reservation', controller.addReservation);

router.get('/tangerine/subscription-list', controller.getSubscriptionListData);
router.post('/tangerine/add-subscription', controller.addSubscription);


module.exports = router;