function setupPage() {
  console.log('set up pge')
  //  getPotentialData();
}

async function getPotentialData() {
  let param = {}
  const reqPotential = axios.post("/report/potential", param);
  // const axiosrequest2 = axios.post("/admin/api/actuals", paramActuals);
  //await axios.all([axiosrequestWest,  axiosrequest2]).then(axios.spread(function (res1, res2) {
  await axios.all([reqPotential]).then(axios.spread(function (res1) {
    //console.log(res1.data);
    let data = res1.data,
      totalIVF = 0,
      totalIVFFrozenTransfers = 0,
      totalIVFFreshPickups = 0,
      totalIUI = 0,
      percIVF_FrozenTransfers,
      percIVF_FreshPickups,
      totalSelftCycle = 0,
      totalDonorCycle = 0,

      totalAntagonistcycles = 0,
      totalAgonistCycles = 0 ;

    data.forEach(item => {
      // report 1
      totalIVF += (parseInt(item.FreshPickUps) + parseInt(item.frozenTransfers))
      totalIUI += parseInt(item.IUICycle)
      // report 1- sub report
      totalIVFFreshPickups += parseInt(item.FreshPickUps)
      totalIVFFrozenTransfers += parseInt(item.frozenTransfers)
      // reoprt 2
      totalSelftCycle+= parseInt(item.SelftCycle)
      totalDonorCycle+= parseInt(item.DonorCycles)

      // reoprt 2
      totalAntagonistcycles+= parseInt(item.Antagonistcycles)
      totalAgonistCycles+= parseInt(item.AgonistCycles)


    });


    // console.log(totalIVFFreshPickups+ '--> Fresh Pickup') // 238
    // console.log(totalIVFFrozenTransfers+ '--> frozenTransfers') // 238

    // console.log(totalIVF) // 238
    // console.log(totalIUI)

    // console.log(totalIUI)
    // console.log(totalIUI)

    percIVF_FrozenTransfers = percentage(totalIVFFrozenTransfers,totalIVF);
    percIVF_FreshPickups = percentage(totalIVFFreshPickups,totalIVF);

    potentialChart1(totalIVF, totalIUI, percIVF_FrozenTransfers, percIVF_FreshPickups);
    potentialChart2(totalSelftCycle, totalDonorCycle);

    potentialChart3(totalAntagonistcycles, totalAgonistCycles)


    //    // console.log(res2.data[0]);
  }));
}


function potentialChart1(totalIVF, totalIUI, percIVF_FrozenTransfers, percIVF_FreshPickups) {
  //console.log('inside report 2')
  //console.log(arguments)
  
  let gdata = google.visualization.arrayToDataTable([
    ['Task', 'cycle Count'],
    ['IUI Cycles', totalIUI],
    ['IVF Cycles', totalIVF]
  ]);

  var options = {
    title: 'IVF / IUI Count',
    width: 300,
    is3D: false,
    legend: { position: 'bottom' },
    backgroundColor: 'transparent'
  }; 


  var chart = new google.visualization.ColumnChart(document.getElementById('potential_chart1'));

  function selectHandler() {
    var selectedItem = chart.getSelection()[0];

    if (selectedItem) {
      var topping = gdata.getValue(selectedItem.row, 0);
      $('#potential_chart1_bar').attr('hidden', topping === 'IUI Cycles')
    }
  }
  google.visualization.events.addListener(chart, 'select', selectHandler, chart);
  chart.draw(gdata, options);



  let ivfData = google.visualization.arrayToDataTable([
    ['Title', 'Fresh Pick Ups (%)', 'Frozen Transfers (%)'],
    ['Type', percIVF_FreshPickups, percIVF_FrozenTransfers]
  ]);

  let ivfOptions = {
    width: 150,
    height: 200,
    legend: { position: 'bottom', maxLines: 3 },
    bar: { groupWidth: '20%' },
    isStacked: true,
    title: 'Fresh Pick Ups / Frozen Transfers'
  };

  let chartIVFDetails = new google.visualization.ColumnChart(document.getElementById('potential_chartIVF'));
  chartIVFDetails.draw(ivfData, ivfOptions);

 }


function potentialChart2(selftCare, donorCycle) {
 //console.log('inside report 2')
 //console.log(arguments)
 
  var data = google.visualization.arrayToDataTable([
    ['Title', 'Value'],
    ['Self (Patient) Cycles', selftCare],
    ['Donor cycles', donorCycle]
  ]);

  var options = {
    title: 'Self (Patient) /  Donor cycles',
    width: 300,
    is3D: false,
    legend: { position: 'bottom' },
    backgroundColor: 'transparent'
  };

  var chart = new google.visualization.PieChart(document.getElementById('potential_chart2'));

  chart.draw(data, options);
}


function potentialChart3(antagonistCycles, agonistCycles) {

  var data = google.visualization.arrayToDataTable([
    ['Title', 'Value'],
    ['Agonist Cycles', agonistCycles],
    ['Antagonist cycles', antagonistCycles]
  ]);

  var options = {
    title: 'Agonist Cycles / Antagonist cycles',
    width: 300,
    is3D: false,
    legend: { position: 'bottom' },
    backgroundColor: 'transparent'
  };

  var chart = new google.visualization.PieChart(document.getElementById('potential_chart3'));

  chart.draw(data, options);
}


function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
} 
