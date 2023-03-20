

function loadMonthYear() {
    const date = new Date();
    let dt = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    $('#cmbMonth').val(dt.getMonth() + 1); // our combo box starts with 1
    $('#cmbYear').val(dt.getFullYear());
    $('#cmbMonth').prop('disabled', true);
    $('#cmbYear').prop('disabled', true);
}

loadMonthYear();

function validateMe() {

    isBtnLoaderVisible(true);

    console.log('Market Insight Saved');

    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));
    console.log(userData);

    let insightId = new URLSearchParams(window.location.search).get('insightId'),
        empId = userData.empId,
        centreId = new URLSearchParams(window.location.search).get('centreId'),
        month = parseInt($('#cmbMonth').val()),
        year = parseInt($('#cmbYear').val()),
        answerOne = $('input[name="obstetricsRadio"]:checked').val(),
        AnswerTwo = '0', //$('#AnswerTwo').val(),
        answerThreeRFSH = $('#answerThreeRFSH').val(),
        answerThreeHMG = $('#answerThreeHMG').val(),
        answerFourRHCG = $('#answerFourRHCG').val(),
        answerFourUHCG = $('#answerFourUHCG').val(),
        answerFourAgonistL = $('#answerFourAgonistL').val(),
        answerFourAgonistT = $('#answerFourAgonistT').val(),
        answerFourRHCGTriptorelin = $('#answerFourRHCGTriptorelin').val(),
        answerFourRHCGLeuprolide = $('#answerFourRHCGLeuprolide').val(),
        answerProgesterone = $('#answerProgesterone').val(),
        answerFiveDydrogesterone = $('#answerFiveDydrogesterone').val(),
        answerFiveCombination = $('#answerFiveCombination').val();

    // if(AnswerTwo === '') {
    //     alert('Please enter Total No of Fresh stimulation Cycles per month');
    //     $('#AnswerTwo').focus();
    //     return false;
    // }

    if ((parseInt(answerThreeRFSH) + parseInt(answerThreeHMG)) != 100) {
        alert('Total of Gonadotropins AVG IU /CYCLE should be equal to 100');
        return false;
    }

    if ((parseInt(answerProgesterone) + parseInt(answerFiveDydrogesterone) + parseInt(answerFiveCombination)) != 100) {
        alert('Total of Luteal Phase support should be equal to 100');
        return false;
    }

    if ((parseInt(answerFourRHCG) + parseInt(answerFourUHCG) + parseInt(answerFourAgonistL) + parseInt(answerFourAgonistT) + parseInt(answerFourRHCGTriptorelin) + parseInt(answerFourRHCGLeuprolide)) != 100) {
        alert('Total of Trigger Protocol should be equal to 100');
        return false;
    }



    if ($("#chkConfirm").is(':checked') == false) {
        alert('Please click on checkbox to confirm the data');
        return false;
    }


    param = {
        insightId: insightId == 'null' ? null : insightId,
        empId: empId,
        centreId: centreId,
        month: month,
        year: year,
        answerOne: answerOne == 'yes' ? true : false,
        AnswerTwo: AnswerTwo,
        answerThreeRFSH: answerThreeRFSH,
        answerThreeHMG: answerThreeHMG,
        answerFourRHCG: answerFourRHCG,
        answerFourUHCG: answerFourUHCG,
        answerFourAgonistL: answerFourAgonistL,
        answerFourAgonistT: answerFourAgonistT,
        answerFourRHCGTriptorelin: answerFourRHCGTriptorelin,
        answerFourRHCGLeuprolide: answerFourRHCGLeuprolide,
        answerProgesterone: answerProgesterone,
        answerFiveDydrogesterone: answerFiveDydrogesterone,
        answerFiveCombination: answerFiveCombination
    }

    console.log(param);

    axios
        .post('/center-market-insight-add/', param).then((response) => {
            console.log(response);
            redirect('/hospitals');
        }).catch((err) => {
            console.log(err);
        });
}

showDrNameCentreName();

function getMarketInsightDetails() {


    isLoaderVisible(true);

    let insightId = new URLSearchParams(window.location.search).get('insightId'),
        centerId = new URLSearchParams(window.location.search).get('centreId'), params;

    params = {
        insightId: insightId,
        centerId: centerId
    };




    // if(insightId != null) {
    axios
        //.get('/market-insight-detail/' + insightId).then((response) => {
        .get('/market-insight-detail/' + params.insightId + '/' + params.centerId).then((response) => {

            console.log(response);

            let data = response.data[0][0], ivfCycle = response.data[1][0].IVFCycle;

            $('#AnswerTwo').val(ivfCycle);
            console.log(data);
            if (data) {
                data.answerOne == true ? $("[name=obstetricsRadio]")[0].setAttribute("checked", "checked") : $("[name=obstetricsRadio]")[1].setAttribute("checked", "checked");
                $('#AnswerTwo').val(ivfCycle);
                $('#answerThreeRFSH').val(data.answerThreeRFSH);
                $('#answerThreeHMG').val(data.answerThreeHMG);
                $('#answerFourRHCG').val(data.answerFourRHCG);
                $('#answerFourUHCG').val(data.answerFourUHCG);
                $('#answerFourAgonistL').val(data.answerFourAgonistL);
                $('#answerFourAgonistT').val(data.answerFourAgonistT);
                $('#answerFourRHCGTriptorelin').val(data.answerFourRHCGTriptorelin);
                $('#answerFourRHCGLeuprolide').val(data.answerFourRHCGLeuprolide);
                $('#answerProgesterone').val(data.answerProgesterone);
                $('#answerFiveDydrogesterone').val(data.answerFiveDydrogesterone);
                $('#answerFiveCombination').val(data.answerFiveCombination);
                $('#rejectedComment b').text(data.rejectComments);
                isLoaderVisible(false);
            }

        }).catch((err) => {
            console.log(err);
        });
    // }
}
