const express = require('express');
const router = express.Router();

const controller = require('../controllers/skuController');

router.get('/sku', controller.getSkuList);
router.get('/add-sku', controller.addSku);
router.get('/sku/master-data/', controller.getMasterData);

router.post('/add-sku', controller.addUpdateSku);

router.get('/sku-list', controller.getSKUListData);

router.post('/sku/delete/:skuId', controller.deleteSkuData);

router.get('/sku-edit/:skuId', controller.addSku);
router.get('/sku-details/:skuId', controller.getSKUDetailsById);

router.post('/sku-edit/:skuId', controller.addUpdateSku);

module.exports = router;