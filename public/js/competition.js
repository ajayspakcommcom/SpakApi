var competitorSkus;
function setupPage() {
  loadMonthYear();
  getSkuDetails();
  showCheckBoxApproveBtn();

  setInterval(() => {
    showPrevMonthInput();
  }, 1000);
}



function loadMonthYear() {
  const date = new Date();
  let dt = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  $('#cmbMonth').val(dt.getMonth() + 1); // our combo box starts with 1
  $('#cmbYear').val(dt.getFullYear());
  $('#cmbMonth').prop('disabled', true);
  $('#cmbYear').prop('disabled', true);
}


async function getSkuDetails() {

  console.log('competition');
  isLoaderVisible(true);

  let centerId = new URLSearchParams(window.location.search).get('cid'),
    year = $('#cmbYear').val(),
    month = $('#cmbMonth').val(),
    userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));

  console.log(userData);

  if (userData.post.toLowerCase() != 'kam') {
    $('.confirmchk').hide();
    $('#rejectedcompetitionCommentTxt').hide();
  }

  if (userData.post.toLowerCase() == 'kam') {
    console.log('');
  } else if (userData.post.toLowerCase() == 'rbm') {
    $('h1').text('Approve Competition');
    document.title = 'Approve Competition';

  } else {
    console.log('');
  }

  const getAllSKURequest = axios.get("/competitor-sku-details/");
  const getSkuContractDetailsRequest = axios.get(`/competitor-sku-details/${month}/${year}/${centerId}`);
  await axios.all([getAllSKURequest, getSkuContractDetailsRequest]).then(axios.spread(function (skuResponse, competitionResponse) {
    // console.log(skuResponse.data);
    //console.log(contractResponse.data);
    competitorSkus = skuResponse.data;
    let competitionRes = competitionResponse.data,
      html = [], collapseHtml = [], showCollapseHtml = [], rows = [],

      quarter1 = [], quarter2 = [], quarter3 = [], quarter4 = [];

    if (competitionRes.length > 0) {
      if (competitionRes[0] && competitionRes[0].rejectComments) {
        //  console.log(businessTrackRes[0].rejectComments)
        $('.rejected-comment').removeClass('hide');
        $('#rejectedcompetitionCommentTxt').text(competitionRes[0].rejectComments);
      }
    }
    console.log(competitorSkus);
    console.log(competitionRes);

    competitorSkus.forEach(skuBrand => {

      let filterRec = competitionRes.filter(competitor => {
        return competitor.CompetitionSkuId === skuBrand.competitorId
      });
      //  console.log(filterRec);
      let businessValue = 0,
        commentsValue = '';
      if (filterRec.length > 0) {
        businessValue = !isNaN((filterRec[0].businessValue)) ? parseFloat(filterRec[0].businessValue) : 0;
        commentsValue = filterRec[0].comments ? filterRec[0].comments : '';
      }

      let commentBox = skuBrand.name.indexOf('Other') > 0 ? `<textarea class="form-control" name="comments_${skuBrand.brandId}_${skuBrand.competitorId}" id="comments_${skuBrand.brandId}_${skuBrand.competitorId}">${commentsValue}</textarea>` : ''

      collapseHtml.push(skuBrand);

      html.push(` 
            <tr>
            <td>${skuBrand.brandName}</td>
            <td>
              <span>${skuBrand.name}</span>
            </td>
            <td>
              <div class="form-group">
                <input maxlength=7" type="text" onkeypress="return isNumber(this, event)" class="form-control" id="txt_${skuBrand.brandId}_${skuBrand.competitorId}_Value" required="" value="${businessValue}" onfocus="addPrevValueOnFocus(this)" onfocusout="addPrevValueOnFocusOut(this)" title="apr" />
              </div>
            </td>
            <td>
                ${commentBox}
          </td>
          </tr>
          `);


    });


    collapseHtml = groupByKey(collapseHtml, 'brandName');
    console.log(collapseHtml);

    for (let item in collapseHtml) {
      //console.log(item);


      for (let obj of collapseHtml[item]) {

        //console.log(obj);

        let filterRec = competitionRes.filter(competitor => {
          return competitor.CompetitionSkuId === obj.competitorId
        });

        let businessValue = 0, commentsValue = '';

        if (filterRec.length > 0) {
          businessValue = !isNaN((filterRec[0].businessValue)) ? parseFloat(filterRec[0].businessValue) : 0;
          commentsValue = filterRec[0].comments ? filterRec[0].comments : '';
        }

        let commentBox = obj.name.indexOf('Other') > 0 ? `<textarea class="form-control" name="comments_${obj.brandId}_${obj.competitorId}" id="comments_${obj.brandId}_${obj.competitorId}">${commentsValue}</textarea>` : '';

        rows.push(`
            <tr>
              <td>${obj.brandName}</td>
              <td>${obj.name}</td>
              <td><input maxlength=7" type="text" onkeypress="return isNumber(this, event)" class="form-control" id="txt_${obj.brandId}_${obj.competitorId}_Value" required="" value="${businessValue}" onfocus="addPrevValueOnFocus(this)" onfocusout="addPrevValueOnFocusOut(this)" title="apr" /></td>
              <td>${commentBox}</td>
            </tr>
        `);
      }

      showCollapseHtml.push(`<div class="panel panel-default">
                      <div class="panel-heading">
                          <h4 class="panel-title businessTotalHeading">
                              <a data-toggle="collapse" data-parent="#accordion" href="#${item}">${item}</a>
                              <span class="totalBrand"></span>
                          </h4>
                      </div>
                      <div id="${item}" class="panel-collapse collapse">
                          <div class="panel-body">
                              <div class="form-section">    
                              
                                  <table class="table table-bordered table-bg">
                                      <thead>
                                          <tr>
                                              <th>Brand</th>
                                              <th>Competition Mapping</th>
                                              <th>Value</th>
                                              <th>Comments for Other</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          ${rows}
                                      </tbody>
                                  </table>
                                  <input type='checkbox' class="competition-checked" onclick="compChk(this)"> &nbsb; <span>Confirm you entered ${item}</span>
                              </div>
                          </div>                      
                      </div>
                  </div>`);
      rows = [];
    }

    $('#competitorDataTable').append(html.join(''));
    $('#competitionAccordion').append(showCollapseHtml.join(''));
    removeExtraText();

    isLoaderVisible(false);
  }))

}

function compChk(elem) {
  console.log(elem);
  console.log($(elem));
  $(elem).parents('.panel-default').find('.panel-heading').addClass('done');
  $(elem).parents('.panel-default').find('.panel-collapse').removeClass('in');
}

function validateMe() {

  if ($("#chkConfirm").is(':checked') == false) {
    alert('Please click on checkbox to confirm the data');
    return false;
  }

  isBtnLoaderVisible(true);

  let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
    centerId = new URLSearchParams(window.location.search).get('cid'),
    empId = parseInt(userData.empId),
    year = $('#cmbYear').val(),
    month = $('#cmbMonth').val(),
    endPoints = [];
  competitorSkus.forEach(skuBrand => {
    //console.log(skuBrand)
    let value = parseFloat($(`#txt_${skuBrand.brandId}_${skuBrand.competitorId}_Value`).val()),
      comments = $(`#comments_${skuBrand.brandId}_${skuBrand.competitorId}`) ? $(`#comments_${skuBrand.brandId}_${skuBrand.competitorId}`).val() : '';

    if (value > 0) {
      let param = {
        value: !isNaN(value) ? value : 0,
        empId: empId,
        brandId: parseInt(`${skuBrand.brandId}`),
        centerId: parseInt(centerId),
        year: $('#cmbYear').val(),
        month: $('#cmbMonth').val(),
        skuId: parseInt(`${skuBrand.competitorId}`),
        comments: comments
      }
      //  console.log(param)
      endPoints.push(param);
      //console.log(endPoints);
    }

  });
  Promise.all(endPoints.map((endpoint) => axios.post('/competitor-sku-add/', endpoint))).then(
    axios.spread((...allData) => {
      // console.log({ allData });
      redirect('/hospitals');
      isBtnLoaderVisible(false);
    })
  );
}

// function isNumber(evt) {
//   evt = (evt) ? evt : window.event;
//   var charCode = (evt.which) ? evt.which : evt.keyCode;
//   console.log(charCode)
//   if (charCode > 31 && (charCode < 46 || charCode > 57)) {
//       return false;
//   }
//   return true;
// }

function isNumber(txt, evt) {
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode == 46) {
    //Check if the text already contains the . character
    if (txt.value.indexOf('.') === -1) {
      return true;
    } else {
      return false;
    }
  } else {
    if (charCode > 31 &&
      (charCode < 48 || charCode > 57))
      return false;
  }
  return true;
}

function approveMe(mode) {
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
      hospitalId: new URLSearchParams(window.location.search).get('cid'),
      rbmId: parseInt(userData.empId),
      year: $('#cmbYear').val(),
      month: $('#cmbMonth').val(),
      kamid: parseInt(getQueryStringValue('kamid')),
      mode: mode,
      rejectReason: $('#txtAreaRejectReason') ? $('#txtAreaRejectReason').val() : ''
    }

  axios
    .post('/center-competition-approved/', param).then((response) => {
      //   console.log(response.data[0])
      if (response.data.length > 0) {
        let res = response.data[0];
        console.log(res);
        if (res.sucess === 'true') {
          redirect(`account-mapping/${parseInt(getQueryStringValue('kamid'))}/competition-list`);

          // @TODO: THIS NEED TO CHANGE
        }
      }

    }).catch((err) => {
      console.log(err);
    });
  return false;
}

function showCheckBoxApproveBtn() {
  let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));
  //console.log(userData);
  $('.divrejectreason').hide();
  $('#btnReject').hide();

  if (userData.post.toLowerCase() == 'kam') {
    //console.log('ram');
    $('.hideApproveChk').hide();
    $('#btnApprove').hide();
    $('#divrejectreason').hide();

  }

  else if (userData.post.toLowerCase() == 'rbm') {
    $('#resetBtn').hide();
    $('#saveBtn').hide();
    $('.two-btn-wrapper').addClass('right');
    if (getQueryStringValue('mode') === 'reject') {
      // show reject text box
      $('.hideApproveChk').hide();
      $('#btnApprove').hide();
      $('.divrejectreason').show();
      $('#btnReject').show();
    } else {
      $('#divrejectreason').hide();
      $('#btnReject').hide();
    }

  }
}

function showLastMonthInput() {

}

function showPrevMonthInput() {
  $('#accordion input[type=text]').prop('disabled', true);
  $(`[title=${getPrevMonth()}]`).prop('disabled', false);
}

function getPrevMonth() {
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const date = new Date();
  return monthNames[date.getMonth() - 1];
}

showDrNameCentreName();

function removeExtraText() {
  $('.form-section').contents().filter(function () {
    return this.nodeType == 3;
  }).remove();
}




//showCheckBoxApproveBtn();