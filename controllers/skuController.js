const { response } = require('express');
const path = require('path');
const sql = require('mssql');
const dbConfig = require('./config');
let _STATUSCODE = 200;
const _allowedDesignaiton = ['ADMIN'];

exports.getSkuList = (req, res, next) => {
    res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/sku/list.html`);
};


exports.addSku = (req, res, next) => {
    res.sendFile(`${path.dirname(process.mainModule.filename)}/public/views/sku/add.html`);
};



exports.addUpdateSku = (req, res, next) => {
    // console.log('inside update employee');
    let params = Object.assign(req.params, req.body);
    addUpdateSku(params).then(result => {
        res.status(_STATUSCODE).json(result)
    })
};



function addUpdateSku(objParam) {
    // console.log('--------------------------------')
    // console.log(objParam)
    // console.log('--------------------------------')
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .input("medID", sql.Int, objParam.skuId || null)
                    .input("brandId", sql.Int, objParam.cmbBrands)
                    .input("brandGroupId", sql.Int, objParam.cmbBrandGroup)
                    .input("medicineName", sql.NVarChar, (objParam.txtSkuName))
                    .input("isDisabled", sql.Bit, (objParam.chkDisabled))
                    .input("Price", sql.Float, (objParam.txtSkuPrice))
                    .execute("USP_BSV_ADD_UPDATE_SKU")
                    .then(function (resp) {
                        //console.log(resp.recordset)
                        resolve(resp.recordset);
                        dbConn.close();
                    })
                    .catch(function (err) {
                        console.log(err);
                        dbConn.close();
                    });
            })
            .catch(function (err) {
                console.log(err);
            });
    });
};



exports.getSKUDetailsById = (req, res, next) => {
    // console.log(req.params, '--->')
    getSKUDetailsById(req.params).then((result) => {
        res.status(_STATUSCODE).json(result);
    });
};


getSKUDetailsById = (objParam) => {
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .input("skuId", sql.Int, objParam.skuId)
                    .execute("USP_GET_SKU_DETAILS_BY_ID")
                    .then(function (resp) {
                        //    console.log(resp)
                        resolve(resp.recordset[0]);
                        dbConn.close();
                    })
                    .catch(function (err) {
                        //  console.log(err);
                        dbConn.close();
                    });
            })
            .catch(function (err) {
                //console.log(err);
            });
    });
};


exports.getSKUListData = (req, res, next) => {
    // console.log('inside getSKUListData employee');
    let params = Object.assign(req.params, req.body);
    getSKUListData(params).then(result => {
        res.status(_STATUSCODE).json(result)
    })
};


getSKUListData = (objParam) => {
    //console.log('I am Here', objParam);
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .execute("USP_BSV_GET_SKU_LIST")
                    .then(function (resp) {
                        //  console.log(resp)
                        resolve(resp.recordset);
                        dbConn.close();
                    })
                    .catch(function (err) {
                        console.log(err);
                        dbConn.close();
                    });
            })
            .catch(function (err) {
                console.log(err);
            });
    });
};



exports.deleteSkuData = (req, res, next) => {
    deleteSkuData(req.params).then(result => {
        res.status(_STATUSCODE).json(result)
    })
};


deleteSkuData = (objParam) => {
    // console.log('I am Here', objParam);
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .input("skuId", sql.Int, objParam.skuId)
                    .execute("USP_DELETE_SKU")
                    .then(function (resp) {
                        let json = { success: true, msg: 'SKU deleted successfully' };
                        resolve(json);
                        dbConn.close();
                    })
                    .catch(function (err) {
                        //console.log(err);
                        dbConn.close();
                    });
            })
            .catch(function (err) {
                //console.log(err);
            });
    });
};





/************* MASTER MODULE *************/
exports.getMasterData = (req, res, next) => {
    getMasterData(req.params).then((result) => {
        res.status(_STATUSCODE).json(result);
    });
};


getMasterData = (objParam) => {
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .execute("USP_BSV_GET_SKU_MASTER_DATA")
                    .then(function (resp) {
                        resolve(resp.recordsets);
                        dbConn.close();
                    })
                    .catch(function (err) {
                        //console.log(err);
                        dbConn.close();
                    });
            })
            .catch(function (err) {
                //console.log(err);
            });
    });
};
/************* MASTER MODULE *************/