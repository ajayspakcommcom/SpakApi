
let designationWiseData = [];

function getPotentialPage() {
    getDesignationWiseData();
}

function getDesignationWiseData() {
    axios
        .get('/potential-report1').then((response) => {
            designationWiseData = response.data;
            setDesignationFilters(null, null);
        }).catch((err) => {
            console.log(err);
        });
}

function setDesignationFilters(event, designation) {

    let zbmData = designationWiseData.filter(z => z.Designation.toLowerCase() === 'zbm'), zbmHtml = [],
        rbmData = designationWiseData.filter(r => r.Designation.toLowerCase() === 'rbm'), rbmHtml = [],
        kamData = designationWiseData.filter(k => k.Designation.toLowerCase() === 'kam'), kamHtml = [];

    console.log(rbmData);

    if (event) {
        console.log(event.target.value);
        if (designation.toLowerCase() === 'zbm') {
            rbmData = rbmData.filter(r => r.ParentID == event.target.value);
            console.log(rbmData);
        }

        if (designation.toLowerCase() === 'rbm') {
            kamData = kamData.filter(k => k.ParentID == event.target.value);
            rbmData = rbmData;
            console.log(kamData);
        }
    }


    zbmHtml.push(`<option value="none" selected disabled hidden>Select Zbm</option>`);
    rbmHtml.push(`<option value="none" selected disabled hidden>Select Rbm</option>`);
    kamHtml.push(`<option value="none" selected disabled hidden>Select Kam</option>`);

    for (let item of zbmData) {
        zbmHtml.push(`<option value="${item.EmpID}">${item.firstName}</option>`);
    }

    for (let item of rbmData) {
        rbmHtml.push(`<option value="${item.EmpID}">${item.firstName}</option>`);
    }

    for (let item of kamData) {
        kamHtml.push(`<option value="${item.EmpID}">${item.firstName}</option>`);
    }

    $('#zbmCombo').html(zbmHtml.join(''));
    $('#rbmCombo').html(rbmHtml.join(''));
    $('#kamCombo').html(kamHtml.join(''));
}