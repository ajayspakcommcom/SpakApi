var skuDetails, isContractApplicableBool = false;
function setupPage() {
    loadMonthYear();
    getSkuDetails()
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

    isLoaderVisible(true);

    let skuBrands = ['FOLIGRAF', 'HUMOG', 'ASPORELIX', 'R-HUCOG', 'FOLICULIN', 'AGOTRIG', 'MIDYDROGEN', 'SPRIMEO'],
        hospitalId = new URLSearchParams(window.location.search).get('cid'),
        chainAccountTypeId = new URLSearchParams(window.location.search).get('chainAccountType'),
        userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));

    if (userData.post.toLowerCase() == 'kam') {
    } else if (userData.post.toLowerCase() == 'rbm') {
        $('h1').text('Approve Business');
        document.title = 'Approve Business';

    } else {
        console.log('');
    }

    let businessTrackerParam = {
        centerId: hospitalId,
        month: $('#cmbMonth').val(),
        year: $('#cmbYear').val()
    }


    const getAllSKURequest = axios.get("/sku-details/");
    const getSkuContractDetailsRequest = axios.get('/contract-details/' + chainAccountTypeId);
    const getBusinessTrackDetails = axios.post('/business-tracker-details/', businessTrackerParam);
    await axios.all([getAllSKURequest, getSkuContractDetailsRequest, getBusinessTrackDetails]).then(axios.spread(function (skuResponse, contractResponse, businessTrackResponse) {

        console.log(skuResponse.data);
        console.log(contractResponse.data);
        console.log(businessTrackResponse.data);


        skuDetails = skuResponse.data;
        let skus = skuDetails,
            contractRes = contractResponse.data,
            html = [],
            businessTrackRes = businessTrackResponse.data;

        isContractApplicableBool = true;  //(contractRes[0].RateType === 'contract Rate');

        //  console.log(isContractApplicableBool) ;
        //  console.log(contractRes);

        if (businessTrackRes.length > 0) {
            if (businessTrackRes[0] && businessTrackRes[0].rejectComments) {
                //  console.log(businessTrackRes[0].rejectComments)
                $('.rejected-comment').removeClass('hide');
                $('#rejectedBusinessCommentTxt').text(businessTrackRes[0].rejectComments);
            }
        }

        console.log(_SKU_BRANDS);

        _SKU_BRANDS.forEach(skuBrand => {
            var skuBrandArr = skus.filter(item => {
                return item.brandName === skuBrand;
            });

            html.push(`   <div class="panel panel-default">
        <div class="panel-heading">
            <h4 class="panel-title businessTotalHeading">
                <a data-toggle="collapse" data-parent="#accordion" href="#${skuBrand.toLowerCase().replace(/\s/g, '')}">${formatText(skuBrand, 'FirstLetterUPPER')}</a>   
                <span class="totalBrand"></span>             
            </h4>
        </div>
        <div id="${skuBrand.toLowerCase().replace(/\s/g, '')}" class="panel-collapse collapse">
            <div class="panel-body">
            <div class="form-section"> 
            ${getBrandGroupDetails(skuBrandArr, contractRes, businessTrackRes)}
            </div>
            </div>
            &nbsp;&nbsp;&nbsp;<input type='checkbox' id='chkConfirm_${skuBrand.toLowerCase().replace(/\s/g, '')}' onchange='confirmBrandEntry(this);return false;'>  Confirm you entered ${formatText(skuBrand, 'FirstLetterUPPER')}
        </div>
       
        </div>`)

        });

        $('#accordion').append(html.join(''));
        isLoaderVisible(false);

    }))
    $('.unitSold').each((x, e) => {
        $(e).change()
    })
}

function getBrandGroupDetails(skuBrandGroups, contractResponse, businessTrackRes) {
    let html = []
    _brandGroupArr = [];
    //console.log(skuBrandGroups);
    skuBrandGroups.forEach(brandGroup => {
        if (!_brandGroupArr.includes(brandGroup.groupName)) {
            html.push(`<h5><strong>${brandGroup.groupName}</strong></h5>
            <hr>`);
            _brandGroupArr.push(brandGroup.groupName)
            html.push(getSKUHtml(skuBrandGroups, brandGroup, contractResponse, businessTrackRes))
        }
    })
    return html.join('');
}

function getSKUHtml(skuBrandGroups, brandGroup, contractResponse, businessTrackRes) {
    //console.log(skuBrandGroups)
    //console.log(brandGroup)
    let html = [],
        skuArr = skuBrandGroups.filter(item => {
            return item.groupName === brandGroup.groupName;

        });

    html.push(`<table class="table table-bordered table-bg">
            <thead>
            <tr>
                <th>SKU</th>
                <th width="5%">Price</th>
                <th width="5%">Unit Sold</th>
                <th width="5%">Business</th>
            </tr>
            </thead>
            <tbody>`)
    skuArr.forEach(sku => {
        let contractRateArr = contractResponse.filter(cr => {
            return (parseInt(cr.medId) === parseInt(sku.medid));
        }),
            contractRate = contractRateArr.length > 0 ? contractRateArr[0].SkuPrice : 0,
            businessTrackArr = businessTrackRes.filter(cr => {
                return (parseInt(cr.skuId) === parseInt(sku.medid));
            }),
            qty = businessTrackArr.length > 0 ? businessTrackArr[0].qty : 0
            ;
        contractRate = businessTrackArr.length > 0 ? businessTrackArr[0].rate : contractRate;

        // if(businessTrackArr.length > 0)
        // {
        //     console.log(businessTrackArr)
        // }
        //console.log(sku)



        let fieldName = `${sku.brandId}_${sku.brandGroupId}_${sku.medid}`
        html.push(`<tr>
                <td width="20%">
                <span class="skuName">${sku.medicineName}</span>
                </td>
                <td>
                <div class="form-group">
                    <input type="text" 
                    disabled=true class="form-control business-rate" 
                    id="txt_${fieldName}_ContractRate" name="txt_${fieldName}_ContractRate" placeholder="00" required="" value= '${contractRate}'>
                </div>
                </td>
                <td>
                <div class="form-group">
                    <input type="text" 
                        onkeypress="return isNumber(event);"
                        maxLength="6"
                        class="form-control unitSold" 
                        id="txt_${fieldName}_unitSold" 
                        name="txt_${fieldName}_unitSold" 
                        priceField = 'hid_${fieldName}_Price'
                        rateContractField = 'txt_${fieldName}_ContractRate'
                        unitSoldBusinessfield = 'txt_${fieldName}_unitSoldBusiness'
                        required="" onblur="calculateBusiness(this);" onchange="calculateBusiness(this); showBusinessBrandWiseTotal(this);" onfocus="addPrevValueOnFocus(this)" onfocusout="addPrevValueOnFocusOut(this)" value='${qty}'>
                </div>
                </td>
                <td>
                <div class="form-group">
                    <input type="text" disabled=true  class="form-control disabled calculatedBus" 
                        id="txt_${fieldName}_unitSoldBusiness" 
                        name="txt_${fieldName}_unitSoldBusiness" value="">
                </div>
                </td>
            </tr>`);
    })
    html.push(`</tbody>
        </table>`)
    //  console.log(skuArr);
    return html.join('');
}

function confirmBrandEntry(checkbox) {
    //console.log(checkbox.id)
    let panelId = checkbox.id.toLowerCase().substring(11),
        msg = $('#' + checkbox.id).is(":checked") ? closePanel(panelId) : 'dont do anything';
    //console.log(msg);
    //console.log(panelId);
}

function closePanel(id) {
    $(`#${id}`).removeClass('in');
    $(`#${id}`).parent('.panel').find('.panel-heading').addClass('done');
}

function showBusinessBrandWiseTotal(obj) {
    let total = 0, calculatedInput = $(obj).parents('.form-section').find('.calculatedBus');
    for (let item of calculatedInput) {
        total += parseFloat(item.value);
    }
    // console.log($(obj).parents('.panel').find('.businessTotalHeading .totalBrand').text(total));
}

function calculateBusiness(obj) {
    let priceField = obj.getAttribute('priceField'),
        rateContractField = obj.getAttribute('rateContractField'),
        unitSoldBusinessfield = obj.getAttribute('unitSoldBusinessfield')
    rateContractPrice = $('#' + rateContractField).val(),
        finalPrice = rateContractPrice, // (isRateContractApplicable)? rateContractPrice : unitPrice,
        roundOffPrice = Math.round(($('#' + obj.id).val() * finalPrice) * 100) / 100;

    $('#' + unitSoldBusinessfield).val(roundOffPrice);

    calculateTotal();
    calculateBusinessTotal(obj);
    // console.log(priceField, rateContractField, unitPrice)    
}

function calculateBusinessTotal(fieldId) {
    // console.log(fieldId)
}

function calculateTotal() {
    let skus = skuDetails,
        totalBusiness = 0;
    skus.forEach(sku => {
        let unitSoldBusinessfield = `txt_${sku.brandId}_${sku.brandGroupId}_${sku.medid}_unitSoldBusiness`,
            //businessValue = $('#' + unitSoldBusinessfield).val().length > 0 ? parseFloat($('#' + unitSoldBusinessfield).val()) : 0;
            businessValue = $('#' + unitSoldBusinessfield).val() !== undefined ? $('#' + unitSoldBusinessfield).val().length > 0 ? parseFloat($('#' + unitSoldBusinessfield).val()) : 0 : '';
        totalBusiness = parseFloat(totalBusiness + businessValue);
    });


    //console.log(totalBusiness);
    //$('#spnTotalBusinessValue').text(intToString(totalBusiness));
    $('#spnTotalBusinessValue').text(totalBusiness);
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


function validateMe() {

    //console.log('save into database')

    if ($('#cmbMonth').val() === "") {
        alert('Month field is empty');
        $('#cmbMonth').focus();
        return false;
    }

    if ($('#cmbYear').val() === "") {
        alert('Year field is empty');
        $('#cmbYear').focus();
        return false;
    }

    if ($("#chkConfirm").is(':checked') == false) {
        alert('Please click on checkbox to confirm the data');
        return false;
    }

    isBtnLoaderVisible(true);

    // let checkBox = document.getElementById('chkIsContractRateApplicable');

    // if (checkBox.checked && $('#txtContractEndDate').val() === '') {
    //     alert('Select contract End date');
    //     $('#txtContractEndDate').focus();
    //     return false;
    // }

    let skus = skuDetails,
        totalBusiness = 0,
        userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        hospitalId = new URLSearchParams(window.location.search).get('cid'),
        empId = parseInt(userData.empId),
        month = parseInt($('#cmbMonth').val()),
        year = parseInt($('#cmbYear').val());
    var endPoints = [];
    skus.forEach(sku => {
        let brandId = sku.brandId,
            brandGroupId = sku.brandGroupId,
            skuId = sku.medid,
            fieldId = `${sku.brandId}_${sku.brandGroupId}_${sku.medid}`,
            rateContractPrice = $(`#txt_${fieldId}_ContractRate`).val(),
            //  unitPrice = $(`#hid_${fieldId}_Price`).val(),
            unitSold = parseInt($(`#txt_${fieldId}_unitSold`).val()),
            finalPrice = rateContractPrice; //(isRateContractApplicable)? rateContractPrice : unitPrice
        ;


        if (unitSold > 0) {
            param = {
                empId: empId,
                hospitalId: hospitalId,
                month: month,
                year: year,
                brandId: brandId,
                brandGroupID: brandGroupId,
                skuId: skuId,
                rate: finalPrice,
                qty: unitSold,
                isContractApplicable: isContractApplicableBool
            }
            //console.log(param)
            endPoints.push(param);
            // axios
            // .post('/sku-add/', param).then((response) => {
            //     //console.log(response.data[0])
            //     let res = response.data[0];
            //     if (res.sucess === 'true') {
            //       //  redirect('/hospitals');
            //     } else {
            //         //     $('#lblMsg').text(res.msg);
            //     }
            // }).catch((err) => {
            //     console.log(err);
            // });
        }

    })
    //console.log(endPoints)
    // Return our response in the allData variable as an array
    Promise.all(endPoints.map((endpoint) => axios.post('/sku-add/', endpoint))).then(
        axios.spread((...allData) => {
            //console.log({ allData });
            isBtnLoaderVisible(false);
            redirect('/hospitals');
        })
    );
    return false;

}

$(".disabled").attr("disabled", true);

function setRate() {
    let checkBox = document.getElementById('chkIsContractRateApplicable');
    //console.log(checkBox.checked);
    if (checkBox.checked) {
        $('.business-rate').attr("disabled", false);
    } else {
        $('.business-rate').attr("disabled", true);
    }
}


function approveBusinessTracker() {
    //console.log('approved me Clicked business');

    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        param = {
            centerId: new URLSearchParams(window.location.search).get('cid'),
            month: $('#cmbMonth').val(),
            year: $('#cmbYear').val(),
            rbmId: parseInt(userData.empId),
        }

    axios
        .post('/center-business-tracker-approved/', param).then((response) => {
            //   console.log(response.data[0])
            if (response.data.length > 0) {
                let res = response.data[0];
                //console.log(res);
                if (res.success === 'true') {
                    redirect(`/account-mapping/${getQueryStringValue('kamId')}`);
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

    if (userData.post.toLowerCase() == 'kam') {
        $('.hideApproveChk').hide();
        $('#btnApprove').hide();
    }

    else if (userData.post.toLowerCase() == 'rbm') {
        $('#resetBtn').hide();
        $('#saveBtn').hide();
        $('.two-btn-wrapper').addClass('right');
    }
}

showDrNameCentreName();

// function addPrevValueOnFocus(elem) {
//     if(parseInt(elem.value) == 0) {
//         elem.value = '';
//     } else {
//         elem.value = elem.value;
//     }
// }

// function addPrevValueOnFocusOut(elem) {
//     console.log(elem.value);
//     if(elem.value == undefined || elem.value == null || elem.value == '') {
//         elem.value = 0;
//     }
// }

showCheckBoxApproveBtn();