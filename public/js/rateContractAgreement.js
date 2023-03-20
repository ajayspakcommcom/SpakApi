async function rcAgreementChart() {
    let param = {};
    const reqRateContract = axios.post("/report/RCAgreement", param);
    await axios.all([reqRateContract]).then(axios.spread(function (res1) {
      //  console.log(res1.data);
        let reportDataItems = res1.data;

        // let data = google.visualization.arrayToDataTable([
        //     ['Element', 'ACHIEVEMENT', 'TARGET'],
        //     ['RBM', 10, 24],
        //     ['Centre Agreements Count', 126, 22],
        //     ['Collapsible List', 282, 19]
        //   ]);

        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Title');
       
        data.addColumn('number', 'Rate Contract');
        data.addColumn('number', 'Total');
        let rbmArr = []
       
        reportDataItems.forEach(item => {
            //rbmArr.push([1,2,3])
            data.addRows([[item.RBM,item.contract,item.hospitalCount]])
        });
       // console.log([rbmArr])
        //data.addRows([rbmArr]);

        let options = {
            width: 1100,
            height: 400,
            legend: { position: 'bottom', maxLines: 30 },
            bar: { groupWidth: '30%' },
            isStacked: true,
            title: 'RC Agreement Chart',
            hAxis: { textPosition: 'none' }
        };

        let chart = new google.visualization.ColumnChart(document.getElementById('rc_agreement_chart'));
        chart.draw(data, options);


    }));


}
