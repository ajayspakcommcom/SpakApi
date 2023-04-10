
const { response } = require('express');
const path = require('path');
const sql = require('mssql');
const dbConfig = require('./config');
const mailOption = require('./mail');
let _STATUSCODE = 200;

const htmlTemplate = `
    
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
<title> </title>
</head>
<body>
<div style="max-width: 700px; margin: auto; border:0px solid red;">
    <table border="0" align="center" cellpadding="0" cellspacing="0" style="width: 100%;">
        <tbody>
            <tr>
                <!--main td-->
                <td>
                    <!--logo-->
                    <table border="0" style="width: 100%; background:transparent;">
                        <tbody>
                            <tr>
                              <td align="right"><img src="img/toppatch.png" alt="Boehringer Ingelheim Logo" style="max-width:100%; height: auto;" /></td>
                            </tr>
                        </tbody>
                    </table>
                    <!--logo-->
                    <!--respect doctor -->
                     <table border="0" style="background: transparent; width:100%;">
                         <tbody>
                             <tr>
                                 <td style="padding: 15px 30px 0 30px; font-family: calibri; color: rgb(192, 0, 0); font-size: 19px;">
                                     <p style="margin:0; text-align: center;"><b><img src="img/astu.png" style="max-width:100%; height: auto;"></b></p>
                                 </td>
                             </tr>
                             <tr>
                                 <td style="padding: 10px 30px 0 30px; font-family: calibri;"><span style="font-family: calibri; color:#000;">Respected Doctor,</span></td> 
                             </tr>
                             <tr>
                                 <td style="padding: 0 30px 0 30px;">
                                     <p style="font-family: calibri; color:#000; margin-bottom:10px; text-align: justify;">
                                        Greetings from the Boehringer Ingelheim Medical Affairs team!
                                     </p>
                                     <p style="font-family: calibri; color:#000; margin-top:0px; text-align: justify;">
                                            <strong style="color:#00004d;">Astute Bytes in Cardiovascular Diabetology (ABCD)</strong> - <b>Module 2.0</b> is presented herewith for your opinion, in academic interest. Please suggest on the appropriate clinical course of action for the below case:
                                     </p> 
                                     <p>
                                         <a href="#">
                                             <img src="img/3b.png" alt="images" style="max-width:100%; height:auto;" />
                                         </a>
                                     </p>                                 
                                 </td>
                             </tr>
                             <tr>
                                <td style="padding: 0px 30px 0 30px; font-family: calibri; color: #000; font-size: 16px; background-color: #b4c6e7;">
                                    <p style="font-family: calibri; color:#00004d; margin-top:0px; text-align: justify;">
                                        <strong> Case-Study<sup>*</sup></strong>
                                     </p>  

                                     <p style="font-family: calibri; color:#000; margin-top:0px; margin-bottom: 0; text-align: justify;">
                                        A 51-year old female with a 5-year history of type 2 diabetes mellitus (T2DM) and 1-year history of hypertension, came for her routine check-up.
                                     </p> 

                                    <table border="0" align="center" cellpadding="0" cellspacing="0" style="width: 100%;">
                                        <tr>
                                            <td style="padding-right:15px; vertical-align: top; padding-top: 5px;">
                                                <p style="margin-bottom: 0;"><img src="img/checkbox.png" alt="chk" /></p>
                                            </td>
                                            <td>
                                               <p style="margin-bottom: 0;">She was overweight, and had been generally compliant to the prescribed lifestyle measures and therapy. She was receiving metformin 500mg TDS, and atorvastatin 10mg OD, and chlorthalidone 6.25mg OD. She had no specific complaints, except for fatigue, which had been observed since the past few weeks.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right:15px; vertical-align: top; padding-top: 5px;">
                                                <p style="margin-bottom: 0;"><img src="img/checkbox.png" alt="chk" /></p>
                                            </td>
                                            <td>
                                                <p style="margin-bottom: 0;">The physical examination did not reveal any abnormality. The blood-pressure was 128/76 mmHg.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right:15px; vertical-align: top; padding-top: 5px;">
                                               <p style="margin-bottom: 0;"><img src="img/checkbox.png" alt="chk" /></p>
                                            </td>
                                            <td>
                                               <p style="margin-bottom: 0;">Her present laboratory assessment demonstrated HbA1c level of 7.2%. The overall haemoglobin level was 12.5%, and the cholesterol levels were within normal range.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right:15px; vertical-align: top; padding-top: 5px;">
                                                <p style="margin-bottom: 0;"><img src="img/checkbox.png" alt="chk" /></p>
                                            </td>
                                            <td>
                                               <p style="margin-bottom:0;">The serum creatinine level was 1.1 mg/dL, reported as within normal range for an adult female. The urine albumin dipstick test was negative. These observations were similar to the previous assessments done 4-months earlier.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-right:15px; vertical-align: top; padding-top: 5px;">
                                                <p style="margin-bottom: 0;"><img src="img/checkbox.png" alt="chk" /></p>
                                            </td>
                                            <td>
                                               <p style="margin-bottom: 0;"> The eye-screening report did not suggest an evidence of diabetic retinopathy. The resting ECG report was also normal.</p>
                                            </td>
                                        </tr>
                                        
                                    </table>
                                </td>
                            </tr>                            
                         </tbody>
                     </table>
                    <!--respect doctor -->
                </td>
                <!--main td-->
            </tr>
        </tbody>
    </table>
    <!--video-->
    <p><strong style="font-family: calibri; color:#000; margin-top:0px; text-align: justify; color:#00004d;">Based on these observations, which of these clinical inferences would NOT be pertinent in the further management of this patient?</strong> </p> 
    <table border="0">
        <tbody>
            <tr>
                <td style="padding:0 30px 0 30px;">
                   <table>
                       <tr>
                           <td style="font-family: calibri; color:#000; margin-top:0px; vertical-align: top;"><b>1.</b></td>
                           <td>
                                <p style="font-family: calibri; color:#000; margin-top:0px;">
                                    More stringent HbA1c target of < 7% or < 6.5% should be attempted for this patient. The choice of the therapeutic agent should be based on this individual patient’s clinical priorities.
                                 </p>
                           </td>
                       </tr>
                       <tr>
                            <td style="font-family: calibri; color:#000; margin-top:0px; vertical-align: top;"><b>2.</b></td>
                            <td>
                                 <p style="font-family: calibri; color:#000; margin-top:0px;">
                                    The risk of cardiovascular mortality will be optimally controlled in this patient, once the HbA1c is brought to target, and the control of hypertension and dyslipidaemia is maintained.
                                  </p>
                            </td>
                        </tr>
                        <tr>
                                <td style="font-family: calibri; color:#000; margin-top:0px; vertical-align: top;"><b>3.</b></td>
                                <td>
                                     <p style="font-family: calibri; color:#000; margin-top:0px;">
                                        Cardiovascular work-up should be considered using a biomarker test and echocardiography for heart-failure assessment, with appropriate referral.
                                      </p>
                                </td>
                            </tr>
                            <tr>
                                    <td style="font-family: calibri; color:#000; margin-top:0px; vertical-align: top;"><b>4.</b></td>
                                    <td>
                                         <p style="font-family: calibri; color:#000; margin-top:0px;">
                                            The patient has chronic kidney disease, and needs appropriate intervention.
                                          </p>
                                    </td>
                                </tr>
                   </table>
                </td>
                </tr>
              <tr>
                <td style="padding:0 30px 30px 30px">                             
                    <table border="0" align="center" cellpadding="0" cellspacing="0" style="width: 100%; margin-top:12px; margin-bottom: 20px;" >
                        <tr>
                            <td>
                                    <a href="#" target="_blank" style="display: block; text-align: center;"><img src="img/2.png" alt="Click Here To View Video" style="max-width: 100%; height: auto;" alt="" /></a>
                            </td>
                            <td>
                                    <a href="#" target="_blank" style="display: block; text-align: center;"><img src="img/3.png" alt="Click Here To View Video" style="max-width: 100%; height: auto;" alt="" /></a>
                            </td>
                        </tr>
                    </table>
                    <p style="font-family: calibri; color:#000; margin-top:0px;">
                        We hope that our ABCD Module 2.0 has been of interest and pertinence to your practice. We would be happy to continue serving you through our ABCD and other academic initiatives in future
                      </p>
                   <p style="font-family: calibri; color:#000; margin-bottom: 0;">
                       <b>Sincere Regards</b>
                   </p>
                   <p style="font-family: calibri; color:#000; margin-bottom: 0px; margin-top:0;">
                       <b>Dr. Syed Kasfur Rahman</b>
                   </p>
                   <p style="font-family: calibri; color:#000; margin-bottom: 0px; margin-top:0;">
                       <b>Medical Advisor, Diabetes & Metabolism</b>
                   </p>
                   <p style="font-family: calibri; color:#000; margin-bottom: 0px; margin-top:0;">
                       <b>Boehringer Ingelheim India Pvt Ltd.</b>
                   </p>
                </td>
            </tr>
        </tbody>
    </table>
   <!--video-->
   <!--about vishwanath-->
     <table border="0" style="background: red; width: 100%; background: transparent;">
         <tbody>             
             <tr>
                <td style="padding:0 30px 0 30px;">
                    <p style="font-family: calibri; color:#000; margin-top:5px; text-align: justify; font-size: 12px;">
                        You can view our privacy policy at <a href="https://www.boehringer-ingelheim.in/data-privacy" target="_blank">https://www.boehringer-ingelheim.in/data-privacy.</a> Please submit your grievances if any, with respect to processing of Data that you have provided to Boehringer Ingelheim India Pvt. Ltd., to our designated Grievance Officer atDataProtectionGrievanceOfficer.IN@boehringer-ingelheim.com
                    </p>
                    
                    <p style="font-family: calibri; color:#000; margin-top:5px; text-align: justify; font-size: 12px;">
                        In case you come across any adverse event related to our products, please connect with the PV team immediately at PV_local_India@boehringer-ingelheim.com.
                    </p>
                    <p style="font-family: calibri; color:#000; margin-top:5px; text-align: justify; font-size: 12px;">
                        For any Therapy Area or Boehringer Ingelheim India product related query kindly contact: 
                    </p>
                    <p style="font-family: calibri; color:#000; margin-top:5px; text-align: justify; font-size: 12px;">
                        medical.query.mum@Boehringer-Ingelheim.com by email or via toll free number 1800227887
                    </p>
                    <p style="font-family: calibri; color:#000; margin-top:5px; text-align: justify; font-size: 12px;">
                        For further information please write to : Boehringer Ingelheim India Pvt Ltd, 1102, 11th Floor, Hallmark Business Plaza, Guru Nanak Hospital Road, Near Guru Nanak Hospital, Bandra East, Mumbai 400051, India.
                    </p>
                    <p style="font-family: calibri; color:#000; margin-top:5px; text-align: justify; font-size: 12px;">
                        For use of Registered medical practitioners only
                    </p>
                    <p style="font-family: calibri; color:#000; margin-top:5px; text-align: justify; font-size: 12px;">
                        Please note that the information provided is not intended to recommend or promote any off label use. Boehringer-Ingelheim India does not encourage or promote the off label usage of any of our products. Please be guided by our current locally approved prescribing information.
                    </p>
                    <p style="font-family: calibri; color:#000; margin-top:5px; text-align: justify; font-size: 12px;">
                       <a href="#" target="_blank">Unsubscribe here.</a>
                    </p>
                </td>
            </tr>
            <tr>
                <td style="text-align: right;"><p style="font-family: calibri; color:#000; font-size: 12px;">SC-IN-00077, Valid up to Jan 2020</p></td>
            </tr>
         </tbody>
     </table>
   <!--about vishwanath-->
</div>    
</body>
</html>


`;

//mailOption.MailOptions({ subject: 'Sending Email using Node.js', html: htmlTemplate });

exports.getContactListData = (req, res, next) => {
    let params = Object.assign(req.params, req.body);
    getContactListData(params).then(result => {
        res.status(_STATUSCODE).json(result)
    })
};

getContactListData = (objParam) => {
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .execute("USP_TANGERINE_GET_CONTACT_US_LIST")
                    .then(function (resp) {
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

exports.addContactUs = (req, res, next) => {
    let params = Object.assign(req.params, req.body);
    addContactUs(params).then(result => {
        res.status(_STATUSCODE).json(result)
    })
};

function addContactUs(objParam) {
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .input("Name", sql.NVarChar, objParam.Name)
                    .input("Email", sql.NVarChar, objParam.Email)
                    .input("Mobile", sql.NVarChar, (objParam.Mobile))
                    .input("Website", sql.NVarChar, (objParam.Website))
                    .input("Comment", sql.NVarChar, (objParam.Comment))
                    .execute("USP_TANGERINE_ADD_CONTACT_US")
                    .then(function (resp) {
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

exports.getReservationListData = (req, res, next) => {
    let params = Object.assign(req.params, req.body);
    getReservationListData(params).then(result => {
        res.status(_STATUSCODE).json(result)
    })
};

getReservationListData = (objParam) => {
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .execute("USP_TANGERINE_GET_RESERVATION_LIST")
                    .then(function (resp) {
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

exports.addReservation = (req, res, next) => {
    let params = Object.assign(req.params, req.body);
    addReservation(params).then(result => {
        res.status(_STATUSCODE).json(result)
    })
};

function addReservation(objParam) {
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .input("Name", sql.NVarChar, objParam.Name)
                    .input("Mobile", sql.NVarChar, objParam.Mobile)
                    .input("Date", sql.NVarChar, (objParam.Date))
                    .input("Time", sql.NVarChar, (objParam.Time))
                    .execute("USP_TANGERINE_ADD_RESERVATION")
                    .then(function (resp) {
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

exports.getSubscriptionListData = (req, res, next) => {
    let params = Object.assign(req.params, req.body);
    getSubscriptionListData(params).then(result => {
        res.status(_STATUSCODE).json(result)
    })
};

getSubscriptionListData = (objParam) => {
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .execute("USP_TANGERINE_GET_SUBSCRIPTION_LIST")
                    .then(function (resp) {
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

exports.addSubscription = (req, res, next) => {
    let params = Object.assign(req.params, req.body);
    addSubscription(params).then(result => {
        res.status(_STATUSCODE).json(result)
    })
};

function addSubscription(objParam) {
    return new Promise((resolve) => {
        var dbConn = new sql.ConnectionPool(dbConfig.dataBaseConfig);
        dbConn
            .connect()
            .then(function () {
                var request = new sql.Request(dbConn);
                request
                    .input("Email", sql.NVarChar, objParam.Email)
                    .execute("USP_TANGERINE_ADD_SUBSCRIPTION")
                    .then(function (resp) {
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



