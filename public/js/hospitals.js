function getCustomerList() {
    isLoaderVisible(true);
    let myKamId = parseInt(getIdFromURL()),
        userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        param = {
            empId: isNaN(myKamId) ? userData.empId : myKamId,
            method: 'getHospitalList'
        },
        urlArr = window.location.href.split('/'),
        flag = isNaN(urlArr[urlArr.length - 1]),
        empId = flag ? urlArr[urlArr.length - 2] : urlArr[urlArr.length - 1]

    axios
        .get(`/employee-details/${empId}`).then((response) => {
            console.log(response.data)
            let data = response.data[0];
            $('#kamName').html(formatText(data.firstName))
        }).catch((err) => {
            console.log(err);
        });


    console.log(userData);

    if (userData.post.toString().toLowerCase() == 'kam') {
        setTimeout(() => {
            if (document.getElementsByClassName('addNewCustomer')[0]) {
                document.getElementsByClassName('addNewCustomer')[0].classList.add('hide');
            }

            if (document.querySelector('#customerList')) {
                document.querySelector('#customerList').classList.add('hide-action');
            }

        }, 1000);
    }

    if (userData.post.toString().toLowerCase() == 'rbm' || userData.post.toString().toLowerCase() == 'zbm') {
        setTimeout(() => {

            if (document.getElementById('customerApproved')) {
                document.getElementById('customerApproved').classList.add('hide');
            }
            $('#customerList').addClass('hide-is-approved-rbm-zbm');
        }, 4000);
    }

    axios
        .post(_URL._CUSTOMER_LIST, param).then((response) => {
            console.log('Customer Data', response.data);
            populateDataTable(response.data);
            isLoaderVisible(false);
        }).catch((err) => {
            console.log(err);
        });
}


function populateDataTable(data) {

    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));

    $("#customerList").DataTable().clear();
    $("#customerList1").DataTable().clear();
    var length = data.length;
    if (length == 0) {
        $("#customerList").DataTable().clear();
        $("#customerList1").DataTable().clear();
    } else {
        var i = 1;


        if (userData.post.toLowerCase() != 'rbm' || userData.post.toLowerCase() != 'zbm') {
            data.forEach(item => {
                $('#customerList').dataTable().fnAddData([
                    `<input type="checkbox" ${item.IsApproved === 'Yes' ? `Checked` : ''}>`,
                    camelCaseText(item.accountName),
                    camelCaseText(item.CENTRENAME),
                    camelCaseText(item.DoctorName),
                    item.specialtyType,
                    item.mobile,
                    item.email,
                    `${item.Address1} ${item.Address2} <br> ${item.City}, ${item.stateName} <br> ${item.PinCode}`,
                    item.ChemistMapped,
                    item.ChainStatusName,
                    isEmployeeCenterList(item)
                ]);
            });
        }

        if (userData.post.toLowerCase() == 'rbm' || userData.post.toLowerCase() == 'zbm') {
            data.forEach(item => {
                $('#customerList1').dataTable().fnAddData([
                    camelCaseText(item.accountName),
                    camelCaseText(item.CENTRENAME),
                    camelCaseText(item.DoctorName),
                    item.specialtyType,
                    item.VisitType,
                    item.City
                ]);
            });
        }
    }
}

function isEmployeeCenterList(obj) {
    let path = window.location.pathname.substr(1);
    if (path == 'customers') {
        return `<a href="/customer-edit/${obj.customerId}" class="edit-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21,12a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4h6a1,1,0,0,0,0-2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM6,12.76V17a1,1,0,0,0,1,1h4.24a1,1,0,0,0,.71-.29l6.92-6.93h0L21.71,8a1,1,0,0,0,0-1.42L17.47,2.29a1,1,0,0,0-1.42,0L13.23,5.12h0L6.29,12.05A1,1,0,0,0,6,12.76ZM16.76,4.41l2.83,2.83L18.17,8.66,15.34,5.83ZM8,13.17l5.93-5.93,2.83,2.83L10.83,16H8Z"/></svg></a> <a href='javascript:void(0)' onclick='DeleteCustomer(${obj.customerId},"${obj.CENTRENAME}");return false;' class='${obj.customerId} delete-icon' title='${obj.CENTRENAME}'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 58.67"><defs><style>.cls-1{fill:#00b4c8;}</style></defs><title>Asset 25</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M61.33,5.33H48V2.67A2.66,2.66,0,0,0,45.33,0H18.67A2.66,2.66,0,0,0,16,2.67V5.33H2.67a2.67,2.67,0,0,0,0,5.34H8v40a8,8,0,0,0,8,8H48a8,8,0,0,0,8-8v-40h5.33a2.67,2.67,0,1,0,0-5.34ZM50.67,50.67A2.67,2.67,0,0,1,48,53.33H16a2.67,2.67,0,0,1-2.67-2.66v-40H50.67Z"/><path class="cls-1" d="M24,45.33a2.67,2.67,0,0,0,2.67-2.66V21.33a2.67,2.67,0,0,0-5.34,0V42.67A2.67,2.67,0,0,0,24,45.33Z"/><path class="cls-1" d="M40,45.33a2.67,2.67,0,0,0,2.67-2.66V21.33a2.67,2.67,0,0,0-5.34,0V42.67A2.67,2.67,0,0,0,40,45.33Z"/></g></g></svg></a>`
    } else {
        return `<a href="/customer-edit/${obj.customerId}?editMode=false&kamId=${parseInt(getIdFromURL())}" title="${obj.customerId}">View Profile</a>`
    }
}


function getCustomerDetails() {

    if (getQueryStringValue('editMode') == 'false') {
        $("form :input").attr('disabled', 'disabled');
        $('#chkApproved').attr('disabled', false);
        $('#endDate').attr('disabled', 'disabled');
        $('#goBack').attr('href', '/employees/centre-list');
        setTimeout(() => {
            $('h1').text('Centre Detail');
            $('.two-btn-wrapper').hide();
            $('.add-rc-link').hide();
            $('.approve-btn-wrapper').removeClass('none');
            // $('.approve-btn-wrapper > button').removeAttr('disabled');
        }, 500);
    }

    getMasterData();
    if (!isEditPage()) {
        return;
    }


    let urlArr = window.location.href.split('/'),
        customerId = urlArr[urlArr.length - 1];
    //console.log(customerId);
    axios
        .get('/customer-details/' + customerId).then((response) => {
            console.log(response.data)
            let customerData = response.data;
            $('#txtCode').val(customerData.code)
            $('#txtDoctorName').val(customerData.DoctorName)

            $('#txtDoctorUniqueCode').val(customerData.DoctorUniqueCode),
                $('#txtMobile').val(customerData.mobile)
            $('#txtEmail').val(customerData.email)
            $('#txtCenterName').val(customerData.CENTRENAME)
            $('#txtAddress1').val(customerData.Address1)
            $('#txtAddress2').val(customerData.Address2)
            $('#txtLocalArea').val(customerData.LocalArea)
            $('#txtCity').val(customerData.City)
            $('#txtPinCode').val(customerData.PinCode)
            $('#txtChemistMapped').val(customerData.chainAccountTypeId)

            $('#txtStateId').val(customerData.StateID)
            $('#txtChainId').val(customerData.chainID)

            $('#hidSpecialty').val(customerData.SpecialtyId)
            $('#hidChainAccountType').val(customerData.SpecialtyId)
            $('#hidVisitCategory').val(customerData.visitId)


            $('#chkDisabled').prop('checked', customerData.isdisabled);
            $('#chkRc').prop('checked', (customerData.isContractApplicable === 'YES'));
            $('#endDate').val(customerData.contractEndDate);
            if (customerData.isContractApplicable === 'YES')
                enableContractDate()

            setTimeout(cmbValues, 5000);
            // $('#txtVisitCategory').val()
            // $('#txtSpecialty').val()
            // $('#cmbChain').val()
            // $('#cmbState').val(customerData.StateID);


            //$('#chkDisabled').is(":checked")
        }).catch((err) => {
            console.log(err);
        });

    $('h1').text('Edit Customer');
}



function cmbValues() {
    $("#cmbState").val($('#txtStateId').val());
    $("#cmbChain").val($('#txtChainId').val())

    $("#cmbSpecialty").val($('#hidSpecialty').val())
    $("#cmbVisitCategory").val($('#hidVisitCategory').val())
    $("#cmbChainAccountType").val($('#hidChainAccountType').val())

}

function DeleteCustomer(id, name, bulkDelete) {

    let param = {
        hospitalId: id
    };

    if (!bulkDelete) {
        let text = `Are you sure you want to delete "${name}"`; // "Are you sure you want to delete '+  +'!\nEither OK or Cancel.";
        if (confirm(text) == true) {
            // let param = {
            //     hospitalId: id
            // };
            //  console.log(param)
            axios
                .post("/customer/delete", param).then((response) => {
                    //console.log(response.data)
                    //alert(response.data.msg)

                }).catch((err) => {
                    console.log(err);
                });
        } else {
            text = "You canceled!";
        }
    } else {

        axios
            .post("/customer/delete", param).then((response) => {
                //console.log(response.data.msg)
            }).catch((err) => {
                console.log(err);
            });

    }
}

function getQueryStringValue(key) {
    //console.log(window.location)
    let urlSearchParams = new URLSearchParams(window.location.search);
    //console.log(urlSearchParams)
    return urlSearchParams.get(key);
}

function validateMe() {
    let urlArr = window.location.href.split('/'),
        hospitalId = urlArr[urlArr.length - 1];

    //console.log(hospitalId);
    let param = {
        hospitalName: $('#txtHospitalName').val(),
        hospitalregion: $('#txtRegionName').val(),
        isDisabled: $('#chkIsDisable').val()
    },
        URL = isEditPage() ? _URL._HOSPITAL_UPDATE + hospitalId : _URL._HOSPITAL_ADD

    axios
        .post(URL, param).then((response) => {
            //console.log(response.data[0])
            let res = response.data[0];
            if (res.sucess === 'true') {
                redirect(_URL._hospitalListing);
            } else {
                $('#lblMsg').text(res.msg);
            }


        }).catch((err) => {
            console.log(err);
        });

}
function CheckContractRate(obj) {

    $('#chkRc').prop('checked', (parseInt(obj.value) === 0));
    $('#endDate').val('');

}


function submitMe() {
    let urlArr = window.location.href.split('/'),
        customerId = urlArr[urlArr.length - 1];


    if (($('#cmbChainAccountType').val()) !== '') {
        if (!$('#chkRc').is(":checked")) {
            alert('since you have specified the speical rate list, please select contract rate and select Contract expiry Date')
            return false;
        }
        if ($('#endDate').val() === '') {
            alert('Select Contract expiry Date')
            return false;
        }

        var today = new Date();
        var endDate = new Date($('#endDate').val());

        if (today > endDate) {
            // Do something
            alert('invalid contract expiry date, expiry date should be of future')
            return false;
        }
    }


    let param = {
        txtCode: $('#txtCode').val(),
        txtDoctorName: $('#txtDoctorName').val(),
        txtVisitCategory: $('#cmbVisitCategory').val(),
        txtSpecialty: $('#cmbSpecialty').val(),
        txtDoctorUniqueCode: $('#txtDoctorUniqueCode').val(),
        txtMobile: $('#txtMobile').val(),
        txtEmail: $('#txtEmail').val(),
        txtCenterName: $('#txtCenterName').val(),
        txtAddress1: $('#txtAddress1').val(),
        txtAddress2: $('#txtAddress2').val(),
        txtLocalArea: $('#txtLocalArea').val(),
        txtCity: $('#txtCity').val(),
        txtPinCode: $('#txtPinCode').val(),
        cmbChain: $('#cmbChain').val(),
        txtPinCode: $('#txtPinCode').val(),
        txtChemistMapped: $('#txtChemistMapped').val(),
        cmbState: parseInt($('#cmbState').val()),
        chkDisabled: $('#chkDisabled').is(":checked"),
        customerId: isNaN(customerId) ? null : parseInt(customerId),
        chainAccountTypeId: parseInt($('#cmbChainAccountType').val()),
        isRateContractApplicable: $('#chkRc').is(":checked") ? 5 : 6,
        contractEndDate: $('#endDate').val()
    }
    //console.log(param)
    axios
        .post(_URL._CUSTOMER_ADD, param).then((response) => {
            //console.log(response.data[0])
            let res = response.data[0];
            if (res.sucess === 'true') {
                redirect('/customers');
            } else {
                $('#lblMsg').text(res.msg);
            }
        }).catch((err) => {
            console.log(err);
        });
}


function getMasterData() {
    axios
        .get(`${_URL._MASTER_DATA}`).then((response) => {
            // console.log(response)
            let stateList = response.data[0],
                chainList = response.data[1],
                visitTypeList = response.data[2],
                specialtyList = response.data[3],
                chainAccountList = response.data[4];
            //console.log(chainAccountList)
            loadComboBox(stateList, 'cmbState', 'stateId', 'stateName');
            loadComboBox(chainList, 'cmbChain', 'chainId', 'Name');
            loadComboBox(visitTypeList, 'cmbVisitCategory', 'VisitID', 'Name');
            loadComboBox(specialtyList, 'cmbSpecialty', 'SpecialtyID', 'Name');
            loadComboBox(chainAccountList, 'cmbChainAccountType', 'accountId', 'Name');

        }).catch((err) => {
            console.log(err);
        });
}

function selectCustomerRow() {

    let table = $('#customerList').DataTable();

    $('#customerList tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
        if ($(this)[0].classList[1] == 'selected') {
            $(this).find('input[type="checkbox"]').attr('checked', true);
        } else {
            $(this).find('input[type="checkbox"]').attr('checked', false);
        }
    });
}

function bulkCustomerDataDelete() {
    let table = $('#customerList').DataTable();
    $.map(table.rows('.selected').data(), function (item, index) {
        let elem = $($(`#customerList tbody tr:eq(${index})`)[0]).find(`td > a:last-child`);
        DeleteCustomer(elem[0].className, elem[0].title, true);
    });
    table.rows('.selected').remove().draw(false);
}

function ApproveDataSingleWay() {

    let getSelectedElemList = $('table.dataTable tbody tr.selected'),
        arrIdList = [];

    for (let obj of getSelectedElemList) {
        arrIdList.push(obj.lastElementChild.lastChild.getAttribute('title'));
    }

    for (let i = 0; i <= arrIdList.length - 1; i++) {
        approveCenterMasterData(arrIdList[i]);
    }

    alert('Approved Successfully');
}


function getMyHospitalList() {

    isLoaderVisible(true);

    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        param = {
            empId: userData.empId
        };
    axios
        .post('/hospitals-list/', param).then((response) => {

            let lists = response.data, listArr = [], uniqueList = [...new Map(lists.map(item => [item['CENTRENAME'], item])).values()];
            uniqueList = lists;
            console.log('Origional', lists);
            console.log('Unique', uniqueList);

            uniqueList.forEach(list => {
                listArr.push(
                    `
                <tr>
                <td>${camelCaseText(list.accountName)}</td>
                <td>${camelCaseText(list.CENTRENAME)}</td>
                <td>${camelCaseText(list.DoctorName)}</td>
                  <td class="text-center"><a href="./potential-add?cid=${list.customerId}&centreName=${list.CENTRENAME}&drName=${list.DoctorName}"><svg class="isDataSubmitted ${list.PotentialStatusNew == null ? '' : (list.PotentialStatusNew.toLowerCase() == 'pending') ? 'pending' : (list.PotentialStatusNew.toLowerCase() == 'approved') ? 'approved' : (list.PotentialStatusNew.toLowerCase() == 'rejected') ? 'rejected' : ''}" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 17.35 17.35"><defs></defs><path class="cls-1" d="M8.67,14.22a.45.45,0,0,1-.24-.09c-.1-.06-.19-.14-.19-.42V6.85c0-1.09,0-2.18,0-3.27a.42.42,0,0,1,.42-.45l.17,0c.13,0,.27.15.27.47V13.77a.39.39,0,0,1-.24.39A.41.41,0,0,1,8.67,14.22Z"/><path class="cls-1" d="M3.58,9.11a.39.39,0,0,1-.39-.24.41.41,0,0,1-.06-.2.45.45,0,0,1,.09-.24c0-.08.12-.19.42-.19H13.77a.42.42,0,0,1,.45.42.38.38,0,0,1,0,.17c0,.13-.14.27-.47.27Z"/><path class="cls-1" d="M8.67,17.35a8.68,8.68,0,1,1,8.68-8.68A8.68,8.68,0,0,1,8.67,17.35Zm0-16.5A7.83,7.83,0,1,0,16.5,8.67,7.83,7.83,0,0,0,8.67.85Z"/></svg></a></td>
                  <td class="text-center"><a href="./market-insight-add?insightId=${list.insightId === undefined ? null : list.insightId}&centreId=${list.customerId}&centreName=${list.CENTRENAME}&drName=${list.DoctorName}"><svg class="isDataSubmitted ${list.MIStatusNew == null ? '' : (list.MIStatusNew.toLowerCase() == 'pending') ? 'pending' : (list.MIStatusNew.toLowerCase() == 'approved') ? 'approved' : (list.MIStatusNew.toLowerCase() == 'rejected') ? 'rejected' : ''}" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 17.35 17.35"><defs></defs><path class="cls-1" d="M8.67,14.22a.45.45,0,0,1-.24-.09c-.1-.06-.19-.14-.19-.42V6.85c0-1.09,0-2.18,0-3.27a.42.42,0,0,1,.42-.45l.17,0c.13,0,.27.15.27.47V13.77a.39.39,0,0,1-.24.39A.41.41,0,0,1,8.67,14.22Z"/><path class="cls-1" d="M3.58,9.11a.39.39,0,0,1-.39-.24.41.41,0,0,1-.06-.2.45.45,0,0,1,.09-.24c0-.08.12-.19.42-.19H13.77a.42.42,0,0,1,.45.42.38.38,0,0,1,0,.17c0,.13-.14.27-.47.27Z"/><path class="cls-1" d="M8.67,17.35a8.68,8.68,0,1,1,8.68-8.68A8.68,8.68,0,0,1,8.67,17.35Zm0-16.5A7.83,7.83,0,1,0,16.5,8.67,7.83,7.83,0,0,0,8.67.85Z"/></svg></a></td>
                  <td class="text-center"><a href="./add-business?cid=${list.customerId}&chainAccountType=${list.chainAccountTypeId}&centreName=${list.CENTRENAME}&drName=${list.DoctorName}"><svg class="isDataSubmitted ${(list.BusinessStatusNEW == null ? '' : (list.BusinessStatusNEW.toLowerCase() == 'pending') ? 'pending' : (list.BusinessStatusNEW.toLowerCase() == 'approved') ? 'approved' : (list.BusinessStatusNEW.toLowerCase() == 'rejected') ? 'rejected' : '')}" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 17.35 17.35"><defs></defs><path class="cls-1" d="M8.67,14.22a.45.45,0,0,1-.24-.09c-.1-.06-.19-.14-.19-.42V6.85c0-1.09,0-2.18,0-3.27a.42.42,0,0,1,.42-.45l.17,0c.13,0,.27.15.27.47V13.77a.39.39,0,0,1-.24.39A.41.41,0,0,1,8.67,14.22Z"/><path class="cls-1" d="M3.58,9.11a.39.39,0,0,1-.39-.24.41.41,0,0,1-.06-.2.45.45,0,0,1,.09-.24c0-.08.12-.19.42-.19H13.77a.42.42,0,0,1,.45.42.38.38,0,0,1,0,.17c0,.13-.14.27-.47.27Z"/><path class="cls-1" d="M8.67,17.35a8.68,8.68,0,1,1,8.68-8.68A8.68,8.68,0,0,1,8.67,17.35Zm0-16.5A7.83,7.83,0,1,0,16.5,8.67,7.83,7.83,0,0,0,8.67.85Z"/></svg></a></td>
                  <td class="text-center"><a href="./add-competition?cid=${list.customerId}&centreName=${list.CENTRENAME}&drName=${list.DoctorName}"><svg class="isDataSubmitted ${list.CompetitionStatusNew == null ? '' : (list.CompetitionStatusNew.toLowerCase() == 'pending') ? 'pending' : (list.CompetitionStatusNew.toLowerCase() == 'approved') ? 'approved' : (list.CompetitionStatusNew.toLowerCase() == 'rejected') ? 'rejected' : ''}" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 17.35 17.35"><defs></defs><path class="cls-1" d="M8.67,14.22a.45.45,0,0,1-.24-.09c-.1-.06-.19-.14-.19-.42V6.85c0-1.09,0-2.18,0-3.27a.42.42,0,0,1,.42-.45l.17,0c.13,0,.27.15.27.47V13.77a.39.39,0,0,1-.24.39A.41.41,0,0,1,8.67,14.22Z"/><path class="cls-1" d="M3.58,9.11a.39.39,0,0,1-.39-.24.41.41,0,0,1-.06-.2.45.45,0,0,1,.09-.24c0-.08.12-.19.42-.19H13.77a.42.42,0,0,1,.45.42.38.38,0,0,1,0,.17c0,.13-.14.27-.47.27Z"/><path class="cls-1" d="M8.67,17.35a8.68,8.68,0,1,1,8.68-8.68A8.68,8.68,0,0,1,8.67,17.35Zm0-16.5A7.83,7.83,0,1,0,16.5,8.67,7.83,7.83,0,0,0,8.67.85Z"/></svg></a></td>
                  <td class="text-center">${list.ContractStatus}</td>                  
                  <td><a href="/view-performance/${list.customerId}" class="btn"><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 21.39 17.49"><defs></defs><path class="cls-1" d="M8.66,17.49c-.2,0-.4,0-.59,0l-.67-.07A8.8,8.8,0,0,1,.22,10.65,10.92,10.92,0,0,1,0,9.39l0-.31V8.45L0,8.2a9.63,9.63,0,0,1,.2-1.4A8.82,8.82,0,0,1,7.57.08,9.36,9.36,0,0,1,8.75,0a8.78,8.78,0,0,1,8.63,7.44,8.53,8.53,0,0,1-.2,3.53c-.05.17,0,.21.15.26a8.12,8.12,0,0,1,3.17,1.86l.09.08a3.37,3.37,0,0,1,.79.89v.13a.86.86,0,0,1-.2.33A9.18,9.18,0,0,1,18,16.85a5.73,5.73,0,0,1-1.75.42h-.35a5.79,5.79,0,0,1-2.82-.78.37.37,0,0,0-.16-.05.25.25,0,0,0-.14,0,9.28,9.28,0,0,1-2.41.84,8.33,8.33,0,0,1-1,.11l-.5,0H8.66ZM5,13.74c.14,0,.39.06.42.49a1.48,1.48,0,0,1,0,.21v.36c0,.3,0,.6,0,.9a.27.27,0,0,0,.2.31,8.22,8.22,0,0,0,3.1.63h0A8.12,8.12,0,0,0,11.91,16a.57.57,0,0,0,.18-.09h0a.36.36,0,0,1-.15-.09,9,9,0,0,1-1.4-1.27c-.26-.3-.26-.45,0-.74s.35-.37.53-.55.6-.52.92-.77l-.3,0a1.91,1.91,0,0,1-1.77-2.12.59.59,0,0,1,.28-.49,2,2,0,0,0,.41-.33A4,4,0,0,0,11.77,5.8a2.71,2.71,0,0,0-1.71-2.17,3.33,3.33,0,0,0-1.28-.26,3.66,3.66,0,0,0-.57,0A2.78,2.78,0,0,0,5.92,5.11a4,4,0,0,0,1.35,4.7.54.54,0,0,1,.28.38,1.91,1.91,0,0,1-1.46,2.19,3.72,3.72,0,0,1-.66.08H5.32A2.72,2.72,0,0,0,3,13.94a.19.19,0,0,0,0,.26,8.39,8.39,0,0,0,1.47,1.2l.06,0s0,0,0-.09c0-.36,0-.72,0-1.09S4.77,13.74,5,13.74ZM16,16.51l.09-.07a3.4,3.4,0,0,0,.88-.13,7.62,7.62,0,0,0,3.39-2.08.17.17,0,0,0,0-.2,9,9,0,0,0-2-1.48,5,5,0,0,0-2.45-.7A4.05,4.05,0,0,0,15,12a7.31,7.31,0,0,0-3.54,2.13c-.06.06-.06.08,0,.17A8.17,8.17,0,0,0,13,15.52a5.31,5.31,0,0,0,2.91.92h0ZM8.77.84A8.56,8.56,0,0,0,7.65.92,7.82,7.82,0,0,0,.86,8.73a7.71,7.71,0,0,0,1.39,4.5.82.82,0,0,0,.12.15,1.28,1.28,0,0,1,.09-.14,3.64,3.64,0,0,1,2.19-1.53,6.4,6.4,0,0,1,1-.11,1.06,1.06,0,0,0,1.1-.94.28.28,0,0,0-.14-.32A3.21,3.21,0,0,1,6,9.8,4.92,4.92,0,0,1,4.84,6,3.61,3.61,0,0,1,6.36,3.28a4.13,4.13,0,0,1,3-.69,3.57,3.57,0,0,1,3,2.26,4.85,4.85,0,0,1-1.42,5.47.39.39,0,0,0-.16.35,1,1,0,0,0,1,.93h.11a4.44,4.44,0,0,1,1,.13.34.34,0,0,0,.14,0,.6.6,0,0,0,.24-.06A5.51,5.51,0,0,1,15.8,11h.28c.18,0,.24,0,.29-.22a8.08,8.08,0,0,0,.13-3.56A7.88,7.88,0,0,0,8.77.84Z"/><path class="cls-1" d="M15.86,16.05a2,2,0,0,1-2-1.88c0-.41.14-.59.55-.64a.89.89,0,0,0,.87-.88c0-.39.19-.55.57-.55a2,2,0,0,1,2,2,2,2,0,0,1-2,2Zm.3-3.06s-.06,0-.1.14A1.62,1.62,0,0,1,14.9,14.3c-.06,0-.1,0-.11.06s0,.07,0,.14a1.1,1.1,0,0,0,1,.7l.24,0A1.14,1.14,0,0,0,16.29,13Z"/></svg></a></td>
                </tr>         

                    `)
            });

            listArr.push(`<tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <!--<td></td>
                            <td></td>-->
                            <td class="total-dr"><b>Total Doctors ${uniqueList.length}</b></td>
                         </tr>`);

            //console.log(lists);

            $('#centerList').append(listArr.join(''));
            isLoaderVisible(false);

        }).catch((err) => {
            console.log(err);
        });
}


function centerContractAdd() {
    // let urlArr = window.location.href.split('/'),
    //     centerId = urlArr[urlArr.length - 1];

    let chainAccountTypeId = parseInt($('#cmbChainAccountType').val())
    redirect('/customer-contract-add/' + chainAccountTypeId);
}


function enableContractDate() {
    $('#endDate').prop('disabled', !$('#chkRc').is(":checked"));

}



function approveCenterMasterData(cusId = 0) {

    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        param = {
            customerId: cusId == 0 ? parseInt(getIdFromURL()) : parseInt(cusId),
            rbmId: parseInt(userData.empId)
        }

    axios
        .post('/customer-master-data-approved/', param).then((response) => {
            //   console.log(response.data[0])
            if (response.data.length > 0) {
                let res = response.data[0];
                console.log(res);
                if (res.success === 'true') {
                    if (parseInt(cusId) == 0) {
                        redirect(`/employees/centre-list/${getQueryStringValue('kamId')}`);
                    }

                    // @TODO: THIS NEED TO CHANGE
                }
            }

        }).catch((err) => {
            console.log(err);
        });
    return false;
}

function addNewBtn() {
    $('#customerList_wrapper').append(`
        <div class="text-right addNewCustomer">
            <a href="./add-customer" class="btn btn-default btn-grad">New Customer</a>
            <!-- <button id="deleteBtn" class="btn btn-success" onclick="bulkCustomerDataDelete()">Delete Multiple Records</button> -->
        </div>
    `);
}

setTimeout(() => {
    addNewBtn();
}, 1000);


