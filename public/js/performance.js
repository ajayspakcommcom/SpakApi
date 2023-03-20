
let urlArr = window.location.href.split('/'),
    centerId = urlArr[urlArr.length - 1],
    date = new Date(),
    dt = new Date(date.getFullYear(), date.getMonth() - 1, 1);

function pageSetUp() {
    //getPerformanceData();
    loadMonthYear();
    getPerformanceData1();
}

function loadMonthYear() {
    $('#cmbMonth').val(dt.getMonth() + 1); // our combo box starts with 1
    $('#cmbYear').val(dt.getFullYear());
    $('#cmbMonth').prop('disabled', true);
    $('#cmbYear').prop('disabled', true);
}

function getPerformanceData() {

    axios
        .get('/view-performanceData/' + centerId).then((response) => {
            console.log(response.data);

            printCenterDetail(response.data[0][0]);

            let centreData = response.data[0],
                potentialData = response.data[1],
                listArr = [];

            centreData.forEach(data => {
                listArr.push(
                    `<tr>
                            <td>${data.CENTRENAME}</td>
                            <td>${data.doctorName}</td>
                            <td>${data.SpecialtyName}</td>
                        </tr>
                    `)
            });

            $('#centreData').append(listArr.join(''));

            listArr = [];

            potentialData.forEach(data => {
                listArr.push(
                    `<tr>
                            <td>${data.IUICycle}</td>
                            <td>${data.IVFCycle}</td>
                            <td>${data.FreshPickUps}</td>
                            <td>${data.frozenTransfers}</td>
                            <td>${data.SelftCycle}</td>
                            <td>${data.DonorCycles}</td>
                            <td>${data.AgonistCycles}</td>
                            <td>${data.Antagonistcycles}</td>
                        </tr>
                    `)
            });

            $('#potentialData').append(listArr.join(''));

        }).catch((err) => {
            console.log(err);
        });
}

function getPerformanceData1() {

    isLoaderVisible(true);

    axios
        .get(`/view-performanceData/${centerId}/${dt.getMonth() + 1}/${dt.getFullYear()}`).then((response) => {

            console.log(response);

            printCenterDetail(response.data[0][0]);

            let centreData = response.data[0], potentialData = response.data[1], competitonList = response.data[3], businessData = response.data[4];
            listArr = [];

            if (centreData) {
                if (centreData.length > 0) {
                    centreData.forEach(data => {
                        listArr.push(
                            `<tr>                            
                                <td>${data.doctorName}</td>
                                <td>${data.SpecialtyName}</td>
                            </tr>
                        `)
                    });
                } else {
                    listArr.push(`
                    <tr>
                        <td colspan="2"><p class="text-center m-b-0">No Data found</p></td>
                    </tr>
                `);
                }
            }




            $('#customerList').append(listArr.join(''));

            listArr = [];


            if (potentialData) {
                if (potentialData.length > 0) {
                    potentialData.forEach(data => {
                        listArr.push(
                            `<tr>
                        <td>${data.IUICycle}</td>
                        <td>${data.IVFCycle}</td>
                        <td>${data.FreshPickUps}</td>
                        <td>${data.frozenTransfers}</td>
                        <td>${data.SelftCycle}</td>
                        <td>${data.DonorCycles}</td>
                        <td>${data.AgonistCycles}</td>
                        <td>${data.Antagonistcycles}</td>
                    </tr>
                    `)
                    });
                } else {
                    listArr.push(
                        `<tr>
                        <td colspan="8"><p class="text-center m-b-0">No Data found</p></td>                      
                    </tr>
                `);
                }
            }



            $('#potentialList').append(listArr.join(''));

            listArr = [];

            if (competitonList) {
                if (competitonList.length > 0) {
                    competitonList.forEach(data => {
                        listArr.push(
                            `<tr>
                                    <td>${data.brandName}</td>
                                    <td>${data.groupName}</td>
                                    <td>${data.totalQty}</td>
                                    <td>${data.totalValue}</td>
                                </tr>
                            `)
                    });
                } else {
                    listArr.push(
                        `<tr>
                        <td colspan="4"><p class="text-center m-b-0">No Data found</p></td>
                    </tr>
                    `)
                }
            }

            $('#competitonList').append(listArr.join(''));

            listArr = [];



            if (businessData) {
                if (businessData.length > 0) {
                    businessData.forEach(data => {
                        listArr.push(
                            `<tr>
                                    <td>${data.brandname}</td>
                                    <td>${data.TotalBusinessValue}</td>
                                </tr>
                            `)
                    });
                } else {
                    listArr.push(
                        `<tr>
                            <td colspan="2"><p class="text-center m-b-0">No Data found</p></td>                                
                        </tr>
                    `)
                }
            }

            $('#rcStatus').text(new URLSearchParams(window.location.search).get('isRc'));
            $('#businessList').append(listArr.join(''));
            isLoaderVisible(false);

        }).catch((err) => {
            console.log(err);
        });
}

function printCenterDetail(data) {
    $('#centreName').text(data.CENTRENAME);
    $('#stateName').text(data.stateName);
    $('#emailId').text(data.email);
    $('#accountTypeId').text(data.name);
}   