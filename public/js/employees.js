function getEmployeeList() {

    let param = {
        method: 'getEmployeesList'
    };

    axios
        .get(_URL._EMPLOYEES_LIST, param).then((response) => {
            console.log(response.data);
            populateDataTable(response.data);

        }).catch((err) => {
            console.log(err);
        });
}

function populateDataTable(data) {
    //  console.log("populating data table...");
    // clear the table before populating it with more data
    $("#employeesList").DataTable().clear();
    var length = data.length;
    //  console.log(length)
    if (length == 0) {
        $("#employeesList").DataTable().clear();
        $("#empHospitalList .dataTables_empty").html('xxxx')
    } else {

        data.forEach(item => {

            $('#employeesList').dataTable().fnAddData([
                item.empnumber,
                item.designation,
                item.firstName,
                item.email,
                item.mobileNumber,
                item.zoneName,
                item.StateName,
                item.hocode,
                item.hqname,
                item.regionName,
                item.doj,
                //item.comments.split('/r/n')[0],
                item.comments,
                `<a href='${_URL._EMPLOYEE_EDIT}${item.empId}'>Edit</a> | <br>
                <a href='${_URL._EMPLOYEE_HERARCHY}${item.empId}'>Change Manager</a> | <br>
                ${item.designation === 'KAM' || item.designation === 'Sr KAM' ?
                    `<a href=${_URL._EMPLOYEE_HOSPITAL}${item.empId}>List of Hospitals</a> | <br>` : ''}
                
                <a href='javascript:void(0)' onclick='DeleteEmployee(${item.empId},"${item.firstName}");return false;'>Delete</a>`
            ]);
        });
    }
}

function DeleteEmployee(id, name) {
    let text = `Are you sure you want to delete "${name}"`; // "Are you sure you want to delete '+  +'!\nEither OK or Cancel.";
    if (confirm(text) == true) {
        axios
            .post(_URL._EMPLOYEE_DELETE + '/' + id).then((response) => {
                //console.log(response.data)
                alert(response.data.msg)

            }).catch((err) => {
                console.log(err);
            });
    } else {
        text = "You canceled!";
    }
}

function getMasterData() {
    axios
        .get(`${_URL._EMPLOYEE_MASTER}`).then((response) => {
            // console.log(response.data)
            let zoneList = response.data[0],
                stateList = response.data[1],
                designationList = response.data[2];
            // LIST HOSPITALS
            //  loadComboBox(zoneList, 'combzone', 'zoneID', 'NAME');
            loadComboBox(stateList, 'cmbState', 'stateId', 'stateName');
            loadComboBox(designationList, 'cmbDesignation', 'designationId', 'designation', '', 'UPPER');
        }).catch((err) => {
            console.log(err);
        });
}
function getEmployeeDetails() {
    getMasterData();

    if (!isEditPage()) {
        $('#txtEmail').prop('readonly', false);
        $('#dvOldComments').hide();
        return;
    }
    let urlArr = window.location.href.split('/'),
        empId = urlArr[urlArr.length - 1];

    console.log(empId);

    axios
        .get(`${_URL._EMPLOYEE_DETAILS}${empId}`).then((response) => {
            // console.log(response.data)
            let empDetails = response.data[0][0];

            console.log('===============');
            console.log(empDetails);
            console.log('===============');

            //   combzone
            //   cmbState
            //   cmbDesignation
            // console.log(empDetails)
            $('#txtHqCode').val(empDetails.HoCode);
            $('#txtEmpNumber').val(empDetails.EmpNumber);
            $('#txtFirstName').val(empDetails.firstName);
            $('#txtHqName').val(empDetails.HQName);
            $('#txtRegion').val(empDetails.RegionName);
            $('#txtDOJ').val(empDetails.DOJ);
            $('#txtMobile').val(empDetails.MobileNumber);
            $('#txtEmail').val(empDetails.Email);
            $('#txtPassword').val(empDetails.Password);
            //$('#chkDisable').val(empDetails.)
            empDetails.comments.toString().replaceAll('/r/n', '<br>')

            $('#cmbZone').val(empDetails.ZoneID);
            // $('#cmbState').val(empDetails.StateID);
            $('#txtStateId').val(empDetails.StateID);
            $('#txtDesignation').val(empDetails.DesignationID);


            var str = empDetails.comments.toString().replaceAll('/r/n', '<br>');
            var regex = /<br\s*[\/]?>/gi;
            $("#txtComment").val(str.replace(regex, "\n"));
            setTimeout(cmbValues,1000);

            // setTimeout(() => {
            //     console.log(empDetails.StateID);
            //     $('#txtStateId').val('4');
            // }, 1000);

            $("#chkDisable").prop("checked", empDetails.empDisabled);

        }).catch((err) => {
            console.log(err);
        });
}

function cmbValues() {
    $("#cmbState").val($('#txtStateId').val());
    $("#cmbDesignation").val($('#txtDesignation').val())
}

function validateMe() {

    let urlArr = window.location.href.split('/'),
        empId = urlArr[urlArr.length - 1];
    let param = {
        cmbZone: $('#cmbZone').val(),
        cmbState: $('#cmbState').val(),
        txtHqCode: $('#txtHqCode').val(),
        txtEmpNumber: $('#txtEmpNumber').val(),
        txtFirstName: $('#txtFirstName').val(),
        cmbDesignation: $('#cmbDesignation').val(),
        txtHqName: $('#txtHqName').val(),
        txtRegion: $('#txtRegion').val(),
        txtDOJ: $('#txtDOJ').val(),
        txtMobile: $('#txtMobile').val(),
        txtEmail: $('#txtEmail').val(),
        txtPassword: $('#txtPassword').val(),
        txtNewComment: $('#txtNewComment').val(),
        chkDisable: ($('#chkDisable').val() === '1' ? 1 : 0)
    },

        URL = isEditPage() ? _URL._EMPLOYEE_UPDATE + empId : _URL._EMPLOYEE_ADD;

        console.log(param.chkDisable);

    axios
        .post(URL, param).then((response) => {
            console.log(response.data[0])
            let res = response.data[0];
            if (res.sucess === 'true') {
                redirect(_URL._EMPLOYEE);
            } else {
                $('#lblMsg').text(res.msg);
            }
        }).catch((err) => {
            console.log(err);
        });

}


/** EMPLOYEE MANAGER LIST */
function setupEmployeeHospitalPage() {
    console.log('ready to roll')
    // get employee list
    getEmployeeHospitalList()
}

function getEmployeeHospitalList() {
    let empId = getIdFromURL();
    console.log(empId)
    axios
        .get(`${_URL._EMPLOYEE_HOSPITAL_LIST}${empId}`).then((response) => {
            // console.log(response.data)

            populateEmployeeHospitalDataTable(response.data[0]);

        }).catch((err) => {
            console.log(err);
        });
    //console.log(formatText('this is my idea', 'UPPER'))
}


function populateEmployeeHospitalDataTable(data) {
    //  console.log("populating data table...");
    // clear the table before populating it with more data
    $("#empHospitalList").DataTable().clear();
    var length = data.length;
    //  console.log(length)
    if (length == 0) {
        $("#empHospitalList").DataTable().clear();
    } else {
        var i = 1;
        data.forEach(item => {
            $('#empHospitalList').dataTable().fnAddData([
                item.hospitalName,
                item.regionName,
                `<a href='javascript:void(0)' onclick='removeHospitalFromEmployeeList(${getIdFromURL()},${item.hospitalId}, "${item.hospitalName}");return false;'>Delete</a>`
            ]);
            i++;
        });
    }
}
//`<a href='javascript:void(0)' onClick=removeHospitalFromEmployeeList(${getIdFromURL()},${item.hospitalId},"")>${item.hospitalName} | Emp Remove</a>`

function removeHospitalFromEmployeeList(empId, hospitalId, name) {
    console.log(arguments)
    let text = `Are you sure you want to remove "${name} from the selected employee"`; // "Are you sure you want to delete '+  +'!\nEither OK or Cancel.";
    if (confirm(text) == true) {
        axios
            .post(_URL._EMPLOYEE_HOSPITAL_EDIT + empId + '/' + hospitalId).then((response) => {
                console.log(response.data[0])
                alert(response.data[0].msg)

            }).catch((err) => {
                console.log(err);
            });
    } else {
        text = "You canceled!";
    }
}



function setupAssignNewHospitalToEmployeePage() {
   // console.log('ready to roll')
    // get employee list
    getAllUnAssingedHospitals()
}

function getAllUnAssingedHospitals() {
    axios
        .get(`${_URL._EMPLOYEE_HOSPITAL_UN_ASSIGNED}`).then((response) => {
           // console.log(response.data)
            populateUnAssingedHospitalDataTable(response.data);

        }).catch((err) => {
            console.log(err);
        });
    //console.log(formatText('this is my idea', 'UPPER'))
}


function populateUnAssingedHospitalDataTable(data) {
    //  console.log("populating data table...");
    // clear the table before populating it with more data
    $("#un-assinged-hospital-list").DataTable().clear();
    var length = data.length;
    //  console.log(length)
    if (length == 0) {
        $("#un-assinged-hospital-list").DataTable().clear();
    } else {
        data.forEach(item => {
            $('#un-assinged-hospital-list').dataTable().fnAddData([
                `<input type="checkbox" class="selectedchk" value="${item.hospitalId}"></input>`,
                item.hospitalName,
                item.regionName
            ]);
        });
    }
}

function ValidateUnAssignedHospitals() {
    console.log('get all the selcted checkbox');
    var arr = [],
        empId = getIdFromURL();
    $('.selectedchk').each(function () {
        if ($(this).prop('checked')) {
            let o = {};
            o.hospitalId = $(this).val();
            o.empId = empId;
            arr.push(o)
        }
    });
    console.log(arr);
    let param = {};
    param.param = arr;
    axios
        .post(`${_URL._EMPLOYEE_HOSPITAL_UN_ASSIGNED_UPDATE}`, param).then((response) => {
          //  console.log(response.data)
           // populateUnAssingedHospitalDataTable(response.data);
           redirect(`${_URL._EMPLOYEE_HOSPITAL}${empId}`)

        }).catch((err) => {
            console.log(err);
        });
  
}

/** EMPLOYEE MANAGER LIST */