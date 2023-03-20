const managerLoader = $('.loader-wrapper-login');
const managerBody = $('body');

function letMeLogin() {

    alert('let me login')
    return false;

    

}

function setupMyTaskPage() {
    //  console.clear();
    console.log(window.localStorage.getItem('endUserData'))
    if (window.localStorage.getItem('endUserData')) {
        //loadTask();
        loadPerfomedTask();
        // loadMyTeamTask(false);

        // setTimeout(() => {
        //     console.log('Task List', getTaskList);
        // }, 3000);
    } else {

        localStorage.clear();
        window.location.href = '/manager/login';
    }
}

function loadPerfomedTask() {

    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            method: 'myPerfomedTask',
            empId: userData.empId
        };

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param).then((response) => {
            console.log(response.data.recordset);
            let showHtml = '';
            response.data.recordset.forEach((elem, indx, arr) => {
                showHtml += `<tr>
                                <td>${elem.taskName}</td>
                                <td>${elem.taskDescp}</td>
                                <td>${elem.performedOn}</td>
                                <td align='right'>${elem.PointsEarned}</td>
                                <td>${elem.isApproved}</td>
                            </tr>`;
            });
            $('#myPerfomedTask').html(showHtml);
            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');

        }).catch((err) => {
            console.log(err);
        });
};


function setupPerformNewTaskPage() {
    if (window.localStorage.getItem('endUserData')) {
        loadTask();
        $('#chkihearby').on('click', function () {
            let checked_status = this.checked;
            const perfomBtn = $('#perfomBtn');
            if (checked_status == true) {
                perfomBtn.removeAttr("disabled");
            } else {
                perfomBtn.attr("disabled", "disabled");
            }
        });

    }
}

function onTaskSelection() {
    let taskId = $("#cmbtaskperfom option:selected").val(),
        selectedTask = getTaskList.find(x => x.taskId == taskId),
        selectedDesc = $('#selectDesc');
    if (selectedTask) {
        selectedDesc.text(selectedTask.taskDescp);
    }
}

function loadTask() {

    let param = {
        method: 'taskList',
        empId: 2,
        showAll: false
    };

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param).then((response) => {
            $('#cmbtaskperfom').append('<option value="">  --- Select Task ---  </option>');

            // console.log(response.data.recordset);

            getTaskList = response.data;
            getTaskList.forEach(function (elem, indx, arr) {
                $('#cmbtaskperfom').append(`<option value="${elem.taskId}">${elem.taskName}</option>`);
            });
            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');

        }).catch((err) => {
            console.log(err);
        });
};



function validatePerform() {

    if ($("#cmbtaskperfom").val() === "") {
        alert("please select task");
        $("#cmbtaskperfom").focus();
        return false;
    }

    let isChecked = false;

    $('#chkihearby:checked').each(function () {
        isChecked = this.checked;
    });

    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            taskId: $("#cmbtaskperfom option:selected").val(),
            method: 'createPerfomTask',
            empId: userData.empId
        };

    //console.log(param);

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param)
        .then((response) => {
            document.location.href = '/manager/my-task';
            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');
            window.location.href = '/manager/my-task';
        })
        .catch((err) => {
            console.log("inside catch");
            console.log(err);
        });

};


/* ************************************ My Dashboard ************************************/
function setupMyDashboard() {
    if (window.localStorage.getItem('endUserData')) {
        loadMyDashboad();

    } else {

        localStorage.clear();
        window.location.href = '/manager/login';
    }
}

function loadMyDashboad() {
    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            method: 'myDashboard',
            empId: userData.empId
        };

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param).then((response) => {
            // console.log(response.data);

            let taskList = response.data,
                totalTask = taskList.length,
                ApprovedTask = taskList.filter(item => {
                    return (item.isApproved)
                }),
                PendingTask = taskList.filter(item => {
                    return (!item.isApproved)
                });
            PointsEarned = ApprovedTask.reduce((total, item) => {
                return parseInt(total + item.PointsEarned);
            }, 0),
                PointsYetToEarn = PendingTask.reduce((total, item) => {
                    return parseInt(total + item.PointsEarned);
                }, 0)
                ;


            console.log('****************************************************')
            console.log('Total Task: ' + totalTask);
            console.log('Approved Task: ' + ApprovedTask.length);
            console.log('Pending Task: ' + PendingTask.length);
            console.log('Points Earned: ' + PointsEarned);
            console.log('Points Yet to Earned: ' + PointsYetToEarn);
            $('#divTotalTask').html('Total Task: ' + totalTask);
            $('#divApprovedTask').html('Approved Task: ' + ApprovedTask.length);
            $('#divPendingTask').html('Pending Task: ' + PendingTask.length);
            $('#divPointsEarned').html('Points Earned: ' + PointsEarned);
            $('#divPointsYetEarned').html('Points Yet to Earn: ' + PointsYetToEarn);
            console.log('****************************************************')

          
            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');

        }).catch((err) => {
            console.log(err);
        });
    param = {
        method: 'myTeamTask',
        empId: userData.empId
    };

    if(userData.post != 'KAM' || userData.post != 'Sr KAM') {
        axios
        .post("/manager/api", param).then((response) => {
            let taskList = response.data,
                myTeamApprovedTask = taskList.filter(item => {
                    return item.isApproved;
                }),
                myTeamPendingTask = taskList.filter(item => {
                    return !item.isApproved;
                }),
                myTeamApprovedTaskEarnedPoints = myTeamApprovedTask.reduce((total, item) => {
                    return parseInt(total + item.PointsEarned);
                }, 0),
                myTeamPointsYetToEarn = myTeamPendingTask.reduce((total, item) => {
                    return parseInt(total + item.PointsEarned);
                }, 0);

            console.log('****************************************************')
            console.log('Total Task Submitted by team: ' + taskList.length);
            console.log('Total Approved Task from the team: ' + myTeamApprovedTask.length);
            console.log('Total Pending Task from the team: ' + myTeamPendingTask.length);
            console.log('Total Points earned by the team: ' + myTeamApprovedTaskEarnedPoints);
            console.log('Total Points Yet to be earned by the team: ' + myTeamPointsYetToEarn);


           
            $('#divMyTeamTotalTask').html('Total Task: ' + taskList.length);
            $('#divMyTeamApprovedTask').html('Approved Task: ' + myTeamApprovedTask.length);
            $('#divMyTeamPendingTask').html('Pending Task: ' + myTeamPendingTask.length);
            $('#divMyTeamPointsEarned').html('Points Earned: ' + myTeamApprovedTaskEarnedPoints);
            $('#divMyTeamPointsYetEarned').html('Points Yet to Earn: ' + myTeamPointsYetToEarn);
            console.log('****************************************************')


            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');
    
        }).catch((err) => {
            console.log(err);
        });

    }
    

    
}
/* ************************************ My Dashboard ************************************/

/* ************************************ PENDING TASKS ************************************/

function setupMyPendingTask() {

    console.log(window.localStorage.getItem('endUserData'))
    if (window.localStorage.getItem('endUserData')) {
        let urlSearchParams = new URLSearchParams(window.location.search),
            pageHeading = urlSearchParams.get('approve') ? 'Approved' : 'Pending';

        loadMyPendingTask(urlSearchParams.get('approve') || false);
        $('.task-heading-wrapper h1').text(`${pageHeading} Task - My Team Task`)
        console.log(pageHeading);

    } else {

        localStorage.clear();
        window.location.href = '/manager/login';
    }

}



function loadMyPendingTask(isApproved, isFromDashboard) {

    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            method: 'myTeamTask',
            empId: userData.empId
        };

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param).then((response) => {
            //console.log(response.data);
            let taskList = response.data.filter(item => {
                if (isApproved) {
                    return item.isApproved;
                } else {
                    return !item.isApproved;
                }
            });
            let showHtml = '';
            taskList.forEach((elem, indx, arr) => {
                showHtml += `<tr>
                <td class="isapprovepage">
                <div class="checkbox disabled">
                    <label><input type="checkbox" value="first chk" class="selectedchk"></label>
                </div>
            </td>
                                <td>${elem.firstName} (${elem.Designation})</td>
                                <td>${elem.empNumber}</td>
                                <td>${elem.taskName}</td>
                                <td align='right'>${elem.PointsEarned}</td>
                                <td>${elem.performedOn}</td>
                                
                            </tr>`;
            });
            $('#pendingTaskList').html(showHtml);
            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');
            if (isApproved) {
                $('.checkbox').hide()
            } 

        }).catch((err) => {
            console.log(err);
        });
}

/* ************************************ PENDING TASKS ************************************/