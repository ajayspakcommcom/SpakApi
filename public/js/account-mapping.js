function getKamDetails() {
    isLoaderVisible(true);
    let urlArr = window.location.href.split('/'),
        flag = isNaN(urlArr[urlArr.length - 1]),
        empId = flag ? urlArr[urlArr.length - 2] : urlArr[urlArr.length - 1]
    //console.log(flag)
    //console.log(empId)
    axios
        .get(`/employee-details/${empId}`).then((response) => {
            //console.log(response.data)
            let data = response.data[0];
            $('#kamName').html(formatText(data.firstName))
            isLoaderVisible(false);

        }).catch((err) => {
            console.log(err);
        });
}
function getMyHospitalList() {
    isLoaderVisible(true);
    let urlArr = window.location.href.split('/'),
        empId = urlArr[urlArr.length - 1];
    //console.log(empID);

    let param = {
        empId: empId
    };

    axios
        .post('/hospitals-list/', param).then((response) => {
            //console.log(response.data)
            let lists = response.data,
                listArr = [];

            lists.forEach(list => {
                listArr.push(
                    `<tr>
                    <td>${camelCaseText(list.CENTRENAME)}</td>
                    <td>${camelCaseText(list.DoctorName)}</td>
                    <td><a href="/potential-add?cid=${list.customerId}&centreName=${list.CENTRENAME}&drName=${list.DoctorName}&empId=${empId}" class="btn btn-default">View Potential</a></td>
                    <td><a href="/add-business?cid=${list.customerId}&chainAccountType=${list.chainAccountTypeId}&kamId=${parseInt(getIdFromURL())}" class="btn btn-default">View Business</a></td>
                    <td><a href="/add-competition?cid=${list.customerId}" class="btn btn-default">View Competition</a></td>
                    <td><a href="#" class="btn btn-default">View Contract</a></td>
                </tr>
                    `)
            });
            $('#centerList').append(listArr.join(''));
            isLoaderVisible(false);

        }).catch((err) => {
            console.log(err);
        });
}

function setupPotentialPage() {
    //    console.log('setup account mapping for potentials')
    isLoaderVisible(true);
    let urlArr = window.location.href.split('/'),
        empId = urlArr[urlArr.length - 2];
    let param = {
        empId: empId
    };

    axios
        .post(`/account-mapping/${empId}/potential-list`, param).then((response) => {
            //console.log(response.data)
            let lists = response.data,
                listArr = [],
                totalSelftCycle = 0,
                totalDonorCycle = 0,
                totalAntagonistcycles = 0,
                totalAgonistCycles = 0,
                totalIVF = 0,
                totalIUI = 0,
                totalIVFFreshPickups = 0,
                totalIVFFrozenTransfers = 0,
                percIVF_FrozenTransfers = 0,
                percIVF_FreshPickups = 0;

            console.log('Potential Approval List', lists);
            console.log('Potential Approval List', lists);

            if (lists.length > 0) {
                let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));
                lists.forEach(list => {
                    //console.log(list);

                    let chkbox = (parseInt(list.isApproved) === 1) ? `<input ${list.isApproved === false ? `checked` : ''} type='checkbox' class='chkbox' value='${list.potentialId}'  id=${list.potentialId} />` : '',
                        rejectBtn = (parseInt(list.isApproved) === 1) ? `<button type="button" class="btn btn-default btn-grad rejected-btn" data-toggle="modal" 
                        data-target="#exampleModal" 
                        data-centername="${camelCaseText(list.CENTRENAME)}" 
                        data-accountname="${camelCaseText(list.accountName)}" 
                        data-potenitalid="${list.potentialId}" 
                        data-drname="${camelCaseText(list.DoctorName)}">Reject</button>` : '';

                    if (userData.post === _POST.ZBM) {
                        chkbox = (parseInt(list.ZBMApproved) === 1) ? `<input ${list.ZBMApproved === false ? `checked` : ''} type='checkbox' class='chkbox' value='${list.potentialId}'  id=${list.potentialId} />` : '',
                            rejectBtn = (parseInt(list.ZBMApproved) === 1) ? `<button type="button" class="btn btn-default btn-grad rejected-btn" data-toggle="modal" 
                        data-target="#exampleModal" 
                        data-centername="${camelCaseText(list.CENTRENAME)}" 
                        data-accountname="${camelCaseText(list.accountName)}" 
                        data-potenitalid="${list.potentialId}" 
                        data-drname="${camelCaseText(list.DoctorName)}">Reject</button>` : '';
                    }
                    listArr.push(
                        `<tr>
                            <td>${chkbox}</td>
                            <td>${(list.accountName) ? camelCaseText(list.accountName) : ''}</td>
                            <td>${camelCaseText(list.CENTRENAME)}</td>
                            <td>${camelCaseText(list.DoctorName)}</td>
                            <td align='right'>${list.IUICycle}</td>
                            <td align='right'>${list.IVFCycle}</td>
                            <!--<td align='right'>${list.FreshPickUps}</td>-->
                            <td align='right'>${list.frozenTransfers}</td>
                            <!--<td align='right'>${list.SelftCycle}</td>-->
                            <td align='right'>${list.DonorCycles}</td>
                            <!--<td align='right'>${list.AgonistCycles}</td>-->
                            <td align='right'>${list.Antagonistcycles}</td>
                            <td> ${list.statusText == null ? approvedRejectedPendingIcon[1] : list.statusText.toLowerCase() == 'approved' ? approvedRejectedPendingIcon[0] : list.statusText.toLowerCase() == 'pending' ? approvedRejectedPendingIcon[1] : approvedRejectedPendingIcon[2]}</td>
                            <td align='right'>${rejectBtn} </td>
                        </tr>
                    `);
                    // reoprt 2
                    totalSelftCycle += parseInt(list.SelftCycle);
                    totalDonorCycle += parseInt(list.DonorCycles);

                    // reoprt 3
                    totalAntagonistcycles += parseInt(list.Antagonistcycles)
                    totalAgonistCycles += parseInt(list.AgonistCycles);


                    // report 1
                    totalIVF += parseInt(list.IVFCycle)
                    totalIUI += parseInt(list.IUICycle)
                    // report 1- sub report
                    totalIVFFreshPickups += parseInt(list.FreshPickUps)
                    totalIVFFrozenTransfers += parseInt(list.frozenTransfers)
                });
                listArr.push(`<tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>                                                  
                                <td colspan="3" class="total-dr text-right"><b>Total Doctors ${lists.length}</b></td>
                             </tr>`);
            } else {
                listArr.push(`<tr>
                <td colspan='14' align='center'> <b>No Record Found</b></td>
             </tr>`);
            }



            $('#potentialData').append(listArr.join(''));

            percIVF_FrozenTransfers = percentage(totalIVFFrozenTransfers, totalIVF);
            percIVF_FreshPickups = percentage(totalIVFFreshPickups, totalIVF);
            //console.log(totalIVF, totalIUI);
            potentialChart1(totalIVF, totalIUI, percIVF_FrozenTransfers, percIVF_FreshPickups);
            potentialChart2(totalSelftCycle, totalDonorCycle);
            potentialChart3(totalAntagonistcycles, totalAgonistCycles);
            isLoaderVisible(false);

        }).catch((err) => {
            console.log(err);
        });
}


function setmarketInsightPage() {
    isLoaderVisible(true);
    let urlArr = window.location.href.split('/'),
        empId = urlArr[urlArr.length - 2];
    let param = {
        empId: empId
    };

    axios
        .post(`/account-mapping/${empId}/market-insight-list`, param).then((response) => {

            let lists = response.data, listArr = [];
            console.log(lists);
            if (lists.length > 0) {
                lists.forEach(list => {
                    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
                        chkbox = (parseInt(list.isApproved) === 1) ? `<input ${list.isApproved === false ? `checked` : ''} type='checkbox' class='chkbox' value='${list.insightId}'  id=${list.insightId} />` : '',
                        rejectBtn = (parseInt(list.isApproved) === 1) ? `<button type="button" class="btn btn-default btn-grad rejected-btn" data-toggle="modal" data-target="#exampleModal" data-target="#exampleModal" 
                        data-centername="${camelCaseText(list.CENTRENAME)}" 
                        data-accountname="${camelCaseText(list.accountName)}" 
                        data-insightid="${list.insightId}" 
                        data-drname="${camelCaseText(list.DoctorName)}">Reject</button>` : '';
                    if (userData.post === _POST.ZBM) {
                        chkbox = (parseInt(list.ZBMApproved) === 1) ? `<input ${list.ZBMApproved === false ? `checked` : ''} type='checkbox' class='chkbox' value='${list.insightId}'  id=${list.insightId} />` : ''
                        rejectBtn = (parseInt(list.ZBMApproved) === 1) ? `<button type="button" class="btn btn-default btn-grad rejected-btn" data-toggle="modal" data-target="#exampleModal" data-target="#exampleModal" 
                        data-centername="${camelCaseText(list.CENTRENAME)}" 
                        data-accountname="${camelCaseText(list.accountName)}" 
                        data-insightid="${list.insightId}" 
                        data-drname="${camelCaseText(list.DoctorName)}">Reject</button>` : '';
                    }

                    listArr.push(
                        `<tr>
                            <td>${chkbox}</td>

                            <td>${list.accountName}</td>
                            <td>${list.CENTRENAME}</td>
                            <td>${list.DoctorName}</td>

                            <td>${(list.answerOne ? 'Yes' : 'No')}</td>
                            <td>${camelCaseText(list.AnswerTwo)}</td>
                            <td>${camelCaseText(list.answerThreeRFSH)}</td>
                            <td align='right'>${list.answerThreeHMG}</td>
                            <td align='right'>${list.answerProgesterone}</td>
                            <td align='right'>${list.answerFiveDydrogesterone}</td>
                            <td align='right'>${list.answerFiveCombination}</td>
                            <td align='right'>${list.answerFourRHCG}</td>
                            <td align='right'>${list.answerFourUHCG}</td>
                            <td align='right'>${list.answerFourAgonistL}</td>
                            <td align='right'>${list.answerFourAgonistT}</td>
                            <td align='right'>${list.answerFourRHCGTriptorelin}</td>
                            <td align='right'>${list.answerFourRHCGLeuprolide}</td>
                            <td> ${list.statusText == null ? approvedRejectedPendingIcon[1] : (list.statusText.toLowerCase() == 'approved' ? approvedRejectedPendingIcon[0] : list.statusText.toLowerCase() == 'pending' ? approvedRejectedPendingIcon[1] : approvedRejectedPendingIcon[2])}</td>
                            <td align='right'>${rejectBtn} </td>
                        </tr>
                    `);
                });

                listArr.push(`<tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>                      
                                <td></td>                      
                                <td></td>                      
                                <td colspan="3" class="total-dr text-right"><b>Total Doctors ${lists.length}</b></td>
                             </tr>`);
            } else {
                listArr.push(`<tr>
                <td colspan='15' align='center'> <b>No Record Found</b></td>
             </tr>`);
            }



            $('#marketInsightData').append(listArr.join(''));
            isLoaderVisible(false);


        }).catch((err) => {
            console.log(err);
        });
}



function approveListingPotential(mode) {
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        endPoints;

    if (parseInt(mode) === 2) {
        if ($('#txtAreaRejectReason').val() == '') {
            alert('Please enter reason to reject')
            $('#txtAreaRejectReason').focus();
            return false;
        }
        endPoints = [{
            potentialId: $('#hidPotentialId').val(),
            rbmId: parseInt(userData.empId),
            mode: mode,
            rejectReason: $('#txtAreaRejectReason') ? $('#txtAreaRejectReason').val() : ''
        }];

    }
    else {
        endPoints = $(".chkbox:checked").map(function () {
            return {
                potentialId: parseInt($(this).val()),
                rbmId: parseInt(userData.empId),
                mode: mode,
                rejectReason: $('#txtAreaRejectReason') ? $('#txtAreaRejectReason').val() : ''
            };
        }).get();
    }


    Promise.all(endPoints.map((endpoint) => axios.post('/center-potentials-approved', endpoint))).then(
        axios.spread((...allData) => {
            //console.log({ allData });
            $('#exampleModal').modal('hide')
            alert('Approved Sucessfully');
            window.top.location = window.top.location;
            //  redirect('/hospitals');
        })
    );
    return false;
}

function approveListingMarketInsight(mode) {
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")), endPoints;

    if (parseInt(mode) === 2) {
        if ($('#txtAreaRejectReason').val() == '') {
            alert('Please enter reason to reject')
            $('#txtAreaRejectReason').focus();
            return false;
        }
        endPoints = [{
            insightId: $('#hidInsightId').val(),
            rbmId: parseInt(userData.empId),
            mode: mode,
            rejectReason: $('#txtAreaRejectReason') ? $('#txtAreaRejectReason').val() : ''
        }];

    }
    else {
        endPoints = $(".chkbox:checked").map(function () {
            return {
                insightId: parseInt($(this).val()),
                rbmId: parseInt(userData.empId),
                mode: mode,
                rejectReason: $('#txtAreaRejectReason') ? $('#txtAreaRejectReason').val() : ''
            };
        }).get();
    }


    Promise.all(endPoints.map((endpoint) => axios.post('/center-market-insight-approved', endpoint))).then(
        axios.spread((...allData) => {
            //console.log({ allData });
            $('#exampleModal').modal('hide')
            alert('Approved Sucessfully');
            window.top.location = window.top.location;
            //  redirect('/hospitals');
        })
    );

    return false;
}

/********************* */
function setupBusinessPage() {

    let urlArr = window.location.href.split('/'),
        empId = urlArr[urlArr.length - 2],
        param = {
            empId: empId
        };

    axios
        .post(`/account-mapping/${empId}/business-list`, param).then((response) => {
            //  console.log(response.data[0])
            let lists = response.data[0],
                listArr = [];
            if (lists.length > 0) {
                console.log(lists);
                lists.forEach(list => {
                    // console.log(list)
                    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
                        chkbox = (parseInt(list.isApproved) === 1) ? `<input ${list.isApproved === false ? `checked` : ''} type='checkbox' class='chkbox' value='${list.hospitalId}'  id=${list.hospitalId} />` : '',
                        rejectBtn = (parseInt(list.isApproved) === 1) ? `<button type="button " class="btn btn-default btn-grad rejected-btn" data-toggle="modal" 
                    data-target="#exampleModal" 
                    data-centername="${camelCaseText(list.CENTRENAME)}" 
                    data-accountname="${camelCaseText(list.accountName)}" 
                    data-potenitalid="${list.hospitalId}" 
                    data-drname="${camelCaseText(list.DoctorName)}">Reject</button>` : '';

                    if (userData.post === _POST.ZBM) {
                        chkbox = (parseInt(list.ZBMApproved) === 1) ? `<input ${list.ZBMApproved === false ? `checked` : ''} type='checkbox' class='chkbox' value='${list.hospitalId}'  id=${list.hospitalId} />` : '',
                            rejectBtn = (parseInt(list.ZBMApproved) === 1) ? `<button type="button " class="btn btn-default btn-grad rejected-btn" data-toggle="modal" 
                    data-target="#exampleModal" 
                    data-centername="${camelCaseText(list.CENTRENAME)}" 
                    data-accountname="${camelCaseText(list.accountName)}" 
                    data-potenitalid="${list.hospitalId}" 
                    data-drname="${camelCaseText(list.DoctorName)}">Reject</button>` : '';
                    }
                    listArr.push(
                        `<tr>
                            <td>${chkbox}</td>
                            <td>${(list.accountName) ? camelCaseText(list.accountName) : ''}</td>
                            <td>${camelCaseText(list.CENTRENAME)}</td>
                            <td>${camelCaseText(list.DoctorName)}</td>
                            <td align='right'>${list.brandGroup1}</td>
                            <td align='right'>${list.brandGroup2}</td>
                            <td align='right'>${list.brandGroup3}</td>
                            <td align='right'>${list.brandGroup4}</td>
                            <td align='right'>${list.brandGroup5}</td>
                            <td align='right'>${list.brandGroup6}</td>
                            <td align='right'>${list.brandGroup7}</td>
                            <td align='right'>${list.brandGroup8}</td>
                            <td align='right'>${list.brandGroup9}</td>
                            <td align='right'>${list.brandGroup10}</td>
                            <td> ${list.statusText == null ? approvedRejectedPendingIcon[1] : list.statusText.toLowerCase() == 'approved' ? approvedRejectedPendingIcon[0] : list.statusText.toLowerCase() == 'pending' ? approvedRejectedPendingIcon[1] : approvedRejectedPendingIcon[2]}</td>
                            <td align='right'>${rejectBtn} </td>
                        </tr>
                    `);
                });

                listArr.push(`<tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>                      
                                <td></td>                      
                                <td colspan="3" class="total-dr text-right"><b>Total Doctors ${lists.length}</b></td>
                             </tr>`);
            }
            else {
                listArr.push(`<tr>
                <td colspan='14' align='center'> <b>No Record Found</b></td>
             </tr>`);
            }


            $('#potentialData').append(listArr.join(''));
            // generate data for the graph
            drawBusinessChartWithData(response.data[1]);
            getAllBusinessReportWithData(response.data[2])


        }).catch((err) => {
            console.log(err);
        });
}


function approveListingBusiness(mode) {
    //ƒconsole.log('approve selected Listing');
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        endPoints;
    if (parseInt(mode) === 2) {
        if ($('#txtAreaRejectReason').val() == '') {
            alert('Please enter reason to reject')
            $('#txtAreaRejectReason').focus();
            return false;
        }
        endPoints = [{
            customerId: parseInt($('#hidPotentialId').val()),
            rbmId: parseInt(userData.empId),
            mode: mode,
            rejectReason: $('#txtAreaRejectReason') ? $('#txtAreaRejectReason').val() : ''
        }];
    }
    else {
        endPoints = $(".chkbox:checked").map(function () {
            return {
                //centerId: parseInt($(this).val()),
                customerId: parseInt($(this).val()),
                rbmId: parseInt(userData.empId),
                mode: mode,
                rejectReason: $('#txtAreaRejectReason') ? $('#txtAreaRejectReason').val() : ''

            };
        }).get();
    }

    Promise.all(endPoints.map((endpoint) => axios.post('/center-business-tracker-approved', endpoint))).then(
        axios.spread((...allData) => {
            //console.log({ allData });
            $('#exampleModal').modal('hide')
            alert('record updated Sucessfully');
            window.top.location = window.top.location;
            //  redirect('/hospitals');
        })
    );
    return false;
}

function setupRateContractPage() {
    isLoaderVisible(true)
    let urlArr = window.location.href.split('/'),
        empId = urlArr[urlArr.length - 2],
        param = {
            empId: empId
        };

    axios
        .post(`/account-mapping/${empId}/rate-contract-list`, param).then((response) => {
            // console.log('Ram', response.data[0])
            let lists = response.data[0],
                listArr = [];
            lists.forEach(list => {
                listArr.push(
                    ` <tr>
                <td><input type="checkbox" class="chkbox" title="${list.RateContractStatus}" value="${list.customerId}_${list.CatAccountId}" id="${list.customerId}" ${list.RateContractStatus === 'Approved' ? 'checked' : ''}></td>
                <td>${formatText(list.accountName)}</td>
                <td>${formatText(list.CENTRENAME)}</td>
                <td>${formatText(list.DoctorName)}</td>
                <td>${list.RateContractStatus.toLowerCase() == 'approved' ? approvedRejectedPendingIcon[0] : list.RateContractStatus.toLowerCase() == 'approval pending' ? approvedRejectedPendingIcon[1] : approvedRejectedPendingIcon[2]}</td>
                <td><a href="/update-rc/?customerAccountId=${list.aid}&customerid=${list.customerId}&CatAccountId=${list.CatAccountId}&rbmid=${empId}"> ${(list.CatAccountId > 0) ? `View` : ``}</a>
                ${(list.SKUDetails === 0 && list.CatAccountId > 0) ? `| SKU Price list awaiting` : ``}
                ${(list.SKUDetails > 0 && list.CatAccountId > 0) ? `| <a href='/customer-contract-add/${list.CatAccountId}'>View SKU Price list</a>` : ``}
                
                </td>
            </tr>
            `)
            });
            $('#centerList').append(listArr.join(''));
            isLoaderVisible(false);
            // generate data for the graph
            // drawBusinessChartWithData(response.data[1]);
            // getAllBusinessReportWithData(response.data[2])


        }).catch((err) => {
            console.log(err);
        });
}

function approveRateContract() {
    //ƒconsole.log('approve selected Listing');
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        param = {
            accountID: parseInt(getQueryStringValue('CatAccountId')),
            zbmId: parseInt(userData.empId),
        };
    axios
        .post(`/center-rate-contract-approved`, param).then((response) => {
            //console.log(response.data[0])
            redirect(`/account-mapping/${getQueryStringValue('rbmid')}/rate-contract-list`)
        }).catch((err) => {
            console.log(err);
        });
    return false;
}

function showApprovalOnZBMLevel() {
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));

    if (userData.post.toLowerCase() === 'zbm') {
        $('.showApprove').removeClass('none');
        $('[type="submit"]').hide();
    }
}

showApprovalOnZBMLevel();



function setupCompetitionPage() {

    isLoaderVisible(true);

    let urlArr = window.location.href.split('/'),
        empId = urlArr[urlArr.length - 2],
        param = {
            empId: empId
        };

    axios
        .post(`/account-mapping/${empId}/competition-list`, param).then((response) => {
            //console.log(response.data)
            let lists = response.data[0],
                brandList = response.data[1],
                listArr = [];

            lists.forEach(list => {
                // console.log((list));
                let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
                    chkbox = (parseInt(list.isApproved) === 1) ? `<input ${list.isApproved === false ? `checked` : ''} type='checkbox' class='chkbox' value='${list.centerId}_${list.month}_${list.year}'  id=${list.centerId} />` : '',
                    rejectBtn = (parseInt(list.isApproved) === 1) ? `<button type="button " class="btn btn-default btn-grad rejected-btn" data-toggle="modal" 
                data-target="#exampleModal" 
                data-centername="${camelCaseText(list.CENTRENAME)}" 
                data-accountname="${camelCaseText(list.accountName)}" 
                data-centerid="${list.centerId}" 
                data-month="${list.month}" 
                data-year="${list.year}" 
                data-drname="${camelCaseText(list.DoctorName)}">Reject</button>` : '';
                // console.log(rejectBtn)
                if (userData.post === _POST.ZBM) {
                    chkbox = (parseInt(list.isApproved) === 1) ? `<input ${list.isApproved === false ? `checked` : ''} type='checkbox' class='chkbox' value='${list.centerId}_${list.month}_${list.year}'  id=${list.centerId} />` : '';
                }

                //console.log(list);
                //console.log(list.DoctorName);
                //console.log(brandList.filter(x => x.centerId == list.centerId));
                //console.log(getCompetitorSku(brandList, list.centerId));

                listArr.push(
                    `<tr>
                        <td>${chkbox}</td>
                        <td>${(list.accountName) ? camelCaseText(list.accountName) : ''}</td>
                        <td>${camelCaseText(list.CENTRENAME)}</td>
                        <td>${camelCaseText(list.DoctorName)}</td>
                        <td>${getCompetitorSku(brandList, list.centerId, 'FOLIGRAF')}</td>
                        <td>${getCompetitorSku(brandList, list.centerId, 'HUMOG')}</td>
                        <td>${getCompetitorSku(brandList, list.centerId, 'ASPORELIX')}</td>
                        <td>${getCompetitorSku(brandList, list.centerId, 'R-HUCOG')}</td>
                        <td>${getCompetitorSku(brandList, list.centerId, 'AGOTRIG')}</td>
                        <td>${getCompetitorSku(brandList, list.centerId, 'MIDYDROGEN')}</td>
                        <td> ${list.statusText == null ? approvedRejectedPendingIcon[1] : list.statusText.toLowerCase() == 'approved' ? approvedRejectedPendingIcon[0] : list.statusText.toLowerCase() == 'pending' ? approvedRejectedPendingIcon[1] : approvedRejectedPendingIcon[2]}</td>
                        <!--<td><a href='/add-competition?cid=${list.centerId}&kamid=${empId}'>View Details</a> </td>-->
                        <td align='right'>${rejectBtn} </td>
                    </tr>
                `);
            });

            listArr.push(`<tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>    
                            <td></td>
                            <td></td>
                            <td></td>                                                                
                            <td></td>                                                                
                            <td class="total-dr text-right" colspan="3"><b>Total Doctors ${lists.length}</b></td>
                         </tr>`);
            $('#competitionData').append(listArr.join(''));

            // <td>
            //    ${list.isApproved == 1 ? `<a href='/add-competition?cid=${list.centerId}&kamid=${empId}&mode=reject' class="btn btn-default btn-grad rejected-btn">Reject</a>` : ''} 
            // </td>
            // generate data for the graph
            //drawBusinessChartWithData(response.data[1]);
            // getAllBusinessReportWithData(response.data[2])

            isLoaderVisible(false);
        }).catch((err) => {
            console.log(err);
        });
}

function getCompetitorSku(brandList, centerId, brandName) {
    let filterData = brandList.filter(x => x.centerId == centerId && x.brandName == brandName), html = [];
    for (let item of filterData) {
        html.push(`
                <div class="comp-sku"><span>${item.name} : </span><b>${item.businessValue}</b></div>
            `);
    }
    return html.join('');
}

function isRcBtnVisible() {
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));
    if (userData.post.toLowerCase() == 'zbm') {
        $('#hrfRateContract').removeClass('hide');
    }
}

/** COMPETITION LISTING */
function approveListingCompetition() {

    //ƒconsole.log('approve selected Listing');
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));

    var endPoints = $(".chkbox:checked").map(function () {
        let month, year, customerId, arr;
        arr = $(this).val().split('_')
        return {

            //centerId: parseInt($(this).val()),
            hospitalId: parseInt(arr[0]),
            rbmId: parseInt(userData.empId),
            month: parseInt(arr[1]),
            year: parseInt(arr[2]),
            mode: 0,
            rejectReason: null
        };
    }).get();
    Promise.all(endPoints.map((endpoint) => axios.post('/center-competition-approved/', endpoint))).then(
        axios.spread((...allData) => {
            //console.log({ allData });
            alert('Approved Sucessfully')
            //  redirect('/hospitals');
            location.reload();
        })
    );
    return false;
}


function approveListingRC() {
    //ƒconsole.log('approve selected Listing');
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));

    var endPoints = $(".chkbox:checked").map(function () {
        let arr;
        arr = $(this).val().split('_')
        return {
            CATID: parseInt(arr[1]),
            ZbmId: parseInt(userData.empId),
        };
    }).get();
    Promise.all(endPoints.map((endpoint) => axios.post('/center-rate-contract-approved', endpoint))).then(
        axios.spread((...allData) => {
            //console.log({ allData });
            alert('Approved Sucessfully')
            //  redirect('/hospitals');
        })
    );
    return false;
}


function competitionRejected(mode) {
    //console.log('approved me Clicked competition');
    if (parseInt(mode) === 2) {
        if ($('#txtAreaRejectReason').val() == '') {
            alert('Please enter reason to reject')
            $('#txtAreaRejectReason').focus();
            return false;
        }
    }

    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        param = {
            hospitalId: $('#hidHospitalId').val(),
            rbmId: parseInt(userData.empId),
            year: $('#hidYear').val(),
            month: $('#hidMonth').val(),
            // kamid: parseInt(getQueryStringValue('kamid')),
            mode: mode,
            rejectReason: $('#txtAreaRejectReason') ? $('#txtAreaRejectReason').val() : ''
        }

    axios
        .post('/center-competition-approved/', param).then((response) => {
            //   console.log(response.data[0])
            if (response.data.length > 0) {
                let res = response.data[0];

                if (res.success === 'true') {
                    console.log('sssss');
                    // //console.log(`account-mapping/${parseInt(getQueryStringValue('kamid'))}/competition-list`)
                    // redirect(`account-mapping/${parseInt(getQueryStringValue('kamid'))}/competition-list`);
                    location.reload();

                    // @TODO: THIS NEED TO CHANGE
                }
            }

        }).catch((err) => {
            console.log(err);
        });
    return false;
}