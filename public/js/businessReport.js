//const { getAllBusinessReport } = require("../../controllers/reportController");


async function drawBusinessChart() {
    let param = {};
    const businessReport = axios.post("/report/businessReport", param);
    await axios.all([businessReport]).then(axios.spread(function (res1) {
        console.log(res1.data);
        let reportDataItems = res1.data;


        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Brand');
        data.addColumn('number', 'Business Value');
        data.addColumn('number', 'Unit sold');
        // let rbmArr = []

        reportDataItems.forEach(item => {
            //rbmArr.push([1,2,3])
            data.addRows([[item.brandName, item.TotalSalesVAlue, item.totalUnit]])
        });
        // console.log([rbmArr])
        // //data.addRows([rbmArr]);
    
        let options = {
            width: 300,
            height: 300,
            legend: { position: 'bottom', maxLines: 30 },
            bar: { groupWidth: '100%' },
            isStacked: false,
            title: 'Over All Business Value',
            hAxis: { textPosition: 'none' },
        };

        let chart = new google.visualization.ColumnChart(document.getElementById('business_chart'));
        chart.draw(data, options);

        getAllBusinessReport()


    }));


}


async function getAllBusinessReport() {
    let param = {};
    let brandsArr = ['FOLIGRAF', 'HUMOG', 'ASPORELIX', 'R-HUCOG', 'FOLICULIN', 'AGOTRIG', 'MIDYDROGEN'];
    const businessReport = axios.post("/report/allbusinessReports", param);
    await axios.all([businessReport]).then(axios.spread(function (res1) {
        // console.log(res1.data);
        let reportDataItems = res1.data;
        brandsArr.forEach(brand => {
           // console.log(brand);
            let brandReport = reportDataItems.filter(item => {
                return item.brandName === brand
            })
          //  console.log(brandReport)
            if (brandReport.length > 0) {

                let data = new google.visualization.DataTable();
                data.addColumn('string', 'Brand');
               // data.addColumn('number', 'Target');
                data.addColumn('number', 'Business Value');
               // data.addColumn('number', 'achieved');

                brandReport.forEach(item => {
                  //  data.addRows([[item.medicineName, item.Targets, item.Qty, item.Targets]])
                    data.addRows([[item.medicineName, item.TotalSalesVAlue]])
                });
               // console.log(data)
                let options = {
                    // width: 1050,
                    // height: 400,
                    width: 300,
                    height: 300,
                    legend: { position: 'bottom', maxLines: 30 },
                    bar: { groupWidth: '40%' },
                    isStacked: false,
                    title: brand,
                    hAxis: { textPosition: 'none' },
                };

                let chart = new google.visualization.ColumnChart(document.getElementById('business_chart_' + brand));
                chart.draw(data, options);
            }

        })


        // // console.log([rbmArr])
        // // //data.addRows([rbmArr]);



    }));
}


function drawBusinessChartWithData(businessTrackerData) {
   
    let reportDataItems = businessTrackerData,
        brandsArr = ['FOLIGRAF', 'HUMOG', 'ASPORELIX', 'R-HUCOG', 'FOLICULIN', 'AGOTRIG', 'MIDYDROGEN'],
        reaportData = [];
        
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Brand');
    data.addColumn('number', 'Business Value');
    data.addColumn('number', 'Unit sold');
    // let rbmArr = []
    //console.log(reportDataItems)
    
    brandsArr.forEach( brand => {
        //console.log(brand);
        brandData = reportDataItems.filter(item => {
                return item.brandName === brand;
        })
        //console.log(brandData)
        let brandDataObj = {},
            brandTotalUnit = 0,
            brandTotalValue = 0;

        brandData.forEach(data => {
         //   console.log(data)
            brandTotalUnit +=  parseInt(data.qty);
            brandTotalValue +=  parseFloat(data.rate);
        });
        brandDataObj = {
            brandName: brand,
            totalUnit: brandTotalUnit,
            TotalSalesVAlue: brandTotalValue
        }
        reaportData.push(brandDataObj)

    });

  //  console.log(reaportData);

    reaportData.forEach(item => {
        //rbmArr.push([1,2,3])
        data.addRows([[item.brandName, item.TotalSalesVAlue, item.totalUnit]])
    });
    // console.log([rbmArr])
    // //data.addRows([rbmArr]);
    let options = {
        width: 500,
        height: 300,
        legend: { position: 'bottom', maxLines: 30 },
        bar: { groupWidth: '100%' },
        isStacked: true,
        title: 'Over All Business Value',
        hAxis: { textPosition: 'none' },
    };

    let chart = new google.visualization.ColumnChart(document.getElementById('business_chart'));
    chart.draw(data, options);



}


function getAllBusinessReportWithData(data) {
    let brandsArr = ['FOLIGRAF', 'HUMOG', 'ASPORELIX', 'R-HUCOG', 'FOLICULIN', 'AGOTRIG', 'MIDYDROGEN'],
        reportDataItems = data;
    
    brandsArr.forEach(brand => {
       // console.log(brand);
        let brandReport = reportDataItems.filter(item => {
            return item.brandName === brand
        })
        //console.log(brandReport)

        if (brandReport.length > 0) {

            let data = new google.visualization.DataTable();
            data.addColumn('string', 'Brand');
            data.addColumn('number', 'Business Value');
           
            brandReport.forEach(item => {
              //  data.addRows([[item.medicineName, item.Targets, item.Qty, item.Targets]])
                data.addRows([[item.medicineName, item.TotalSalesValue]])
            });
           // console.log(data)
            let options = {
                width: 300,
                height: 300,
                legend: { position: 'bottom', maxLines: 30 },
                bar: { groupWidth: '40%' },
                isStacked: false,
                title: brand,
                hAxis: { textPosition: 'none' },
            };

            let chart = new google.visualization.ColumnChart(document.getElementById('business_chart_' + brand));
            chart.draw(data, options);
        }

    })
}