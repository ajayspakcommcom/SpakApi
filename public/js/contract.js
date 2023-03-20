var skuDetails;
function setupPage() {
    getContractDetails();
    getChainAccountList();
    getAccountChainDetails();
}

async function getContractDetails() {
    let urlArr = window.location.href.split('/'),
        chainAccountTypeId = urlArr[urlArr.length - 1];
    const getAllSKURequest = axios.get("/sku-details/");
    const getSkuContractDetailsRequest = axios.get('/contract-details/' + chainAccountTypeId);
    await axios.all([getAllSKURequest, getSkuContractDetailsRequest]).then(axios.spread(function (skuResponse, contractResponse) {
        //  console.log(skuResponse.data);
        //console.log(contractResponse.data);
        skuDetails = skuResponse.data;
        let skus = skuDetails,
            contractRes = contractResponse.data,
            html = [];

        _SKU_BRANDS.forEach(skuBrand => {
            var skuBrandArr = skus.filter(item => {
                return item.brandName === skuBrand;
            });

            html.push(`   <div class="panel panel-default">
        <div class="panel-heading">
            <h4 class="panel-title">
            <a data-toggle="collapse" data-parent="#accordion" href="#${skuBrand.toLowerCase().replace(/\s/g, '')}">${formatText(skuBrand, 'FirstLetterUPPER')}</a>
            </h4>
        </div>
        <div id="${skuBrand.toLowerCase().replace(/\s/g, '')}" class="panel-collapse collapse in">
            <div class="panel-body">
            <div class="form-section"> 
            ${getBrandGroupDetails(skuBrandArr, contractRes)}
            </div>
            </div>
        </div>
        </div>`)

        });

        $('#accordion').append(html.join(''))

    }))

    // axios
    //     .get('/sku-details/').then((response) => {
    //       //  console.log(response.data)
    //       skuDetails = response.data;
    //         let skus = skuDetails,
    //             html = [];
    //     }).catch((err) => {
    //         console.log(err);
    //     });
}

function getBrandGroupDetails(skuBrandGroups, contractResponse) {
    let html = []
    _brandGroupArr = [];

    skuBrandGroups.forEach(brandGroup => {
        if (!_brandGroupArr.includes(brandGroup.groupName)) {
            html.push(`<h5><strong>${brandGroup.groupName}</strong></h5>
            <hr>`);
            _brandGroupArr.push(brandGroup.groupName)
            html.push(getSKUHtml(skuBrandGroups, brandGroup, contractResponse))
        }
    })

    // console.log(_brandGroupArr)
    return html.join('');
}

function getSKUHtml(skuBrandGroups, brandGroup, contractResponse) {
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
                <th>Rate Contract</th>
            </tr>
            </thead>
            <tbody>`)
    skuArr.forEach(sku => {
            let contractRateArr = contractResponse.filter(cr => {
                return (parseInt(cr.medId) ===  parseInt(sku.medid));
            }),
            contractRate = contractRateArr.length > 0 ? contractRateArr[0].SkuPrice : 0;

        let fieldName = `${sku.brandId}_${sku.brandGroupId}_${sku.medid}`
        html.push(`<tr>
                <td width="25%">
                <span>${sku.medicineName}</span>
                </td>
                <td>
                <div class="form-group">
                    <input type="text"                     
                    class="form-control business-rate"    
                    maxlength="7"                 
                    onkeypress="return validateFloatKeyPress(this,event);"
                    id="txt_${fieldName}_ContractRate" name="txt_${fieldName}_ContractRate" placeholder="00" required="" value= ${contractRate}
                    onfocus="addPrevValueOnFocus(this)" onfocusout="addPrevValueOnFocusOut(this)">
                </div>
                </td>
            </tr>`)
    })
    html.push(`</tbody>
        </table>`)



    //  console.log(skuArr);

    return html.join('');
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function validateFloatKeyPress(el, evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    var number = el.value.split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    //just one dot
    if(number.length>1 && charCode == 46){
         return false;
    }
    //get the carat position
    var caratPos = getSelectionStart(el);
    var dotPos = el.value.indexOf(".");
    if( caratPos > dotPos && dotPos>-1 && (number[1].length > 1)){
        return false;
    }
    return true;
}

function getSelectionStart(o) {
	if (o.createTextRange) {
		var r = document.selection.createRange().duplicate()
		r.moveEnd('character', o.value.length)
		if (r.text == '') return o.value.length
		return o.value.lastIndexOf(r.text)
	} else return o.selectionStart
}

function validateMe() {

    //console.log('save into database')
    //console.log(skuDetails)

    let urlArr = window.location.href.split('/'),
        chainAccountTypeId = urlArr[urlArr.length - 1],
        skus = skuDetails;

    skus.forEach(sku => {
        let brandId = sku.brandId,
            brandGroupId = sku.brandGroupId,
            skuId = sku.medid,
            fieldId = `${sku.brandId}_${sku.brandGroupId}_${sku.medid}`,
            rateContractPrice = $(`#txt_${fieldId}_ContractRate`).val();
        if (rateContractPrice >= 0) {
            param = {
                brandId: brandId,
                brandGroupID: brandGroupId,
                skuId: skuId,
                rate: rateContractPrice,
                chainAccountTypeId: chainAccountTypeId
            }
            //console.log(param)

            axios
                .post('/rate-contract-add/', param).then((response) => {
                    //console.log(response.data[0])
                    // let res = response.data[0];
                    // if (res.sucess === 'true') {
                    //     redirect('/hospitals');
                    // } else {
                    //     //     $('#lblMsg').text(res.msg);
                    // }
                }).catch((err) => {
                    console.log(err);
                });

        }

    });
    redirect('/rc-list');
    return false;

}

function getChainAccountList() {
    axios
        .get('/account-chain-list').then((response) => {
            let list = response.data,
                listArr = [];

            list.forEach(data => {
                listArr.push(
                    `<tr>
                        <td>${data.name}</td>
                        <td>${data.isDisabled}</td>
                        <td>
                            <a href="/customer-contract-add/${data.accountID}">SKU Contract</a>
                            |
                            <a href="/account-chain-edit/${data.accountID}">Edit Contract</a>
                            |
                            <a href='javascript:void(0)' onclick='DeleteChainAccountData(${data.accountID},"${data.name}");return false;'>Delete Contract</a>
                        </td>
                    </tr>
                `)
            });
            $('#skudata').append(listArr.join(''))
        }).catch((err) => {
            console.log(err);
        });
}

function validateAC() {
    
    let txtChainName = $('#txtChainName')
        chkDisabled = $('#chkDisabled');

    if (txtChainName.val() == '') {
        alert('Please enter Chain Account Name')
        txtChainName.focus();
        return false;
    } 

    let urlArr = window.location.href.split('/'),
    accountID = urlArr[urlArr.length - 1];

    //console.log(accountID);

    let param = {
        txtChainName: $('#txtChainName').val(),
        accountID: isNaN(accountID) ? null : parseInt(accountID),
        chkDisabled: $('#chkDisabled').is(":checked")
    }
    //console.log(param)
    URL = isEditPage() ? '/account-chain-edit/' + accountID : '/accound-chain-add'

    axios
        .post(URL, param).then((response) => {
            //console.log(response.data[0]);
            let res = response.data[0];
            if (res.sucess === 'true') {
                redirect('/contracts');
            } else {
                //$('#lblMsg').text(res.msg);
            }
        }).catch((err) => {
            console.log(err);
        });

}

function getAccountChainDetails() {

    console.log('ready')
    if (!isEditPage()) {
        return;
    }
    let urlArr = window.location.href.split('/'),
    accountId = urlArr[urlArr.length - 1];
    //console.log(accountId);
    axios
        .get('/account-chain-details/' + accountId).then((response) => {
            //console.log(response.data)
            let acData = response.data[0];
            $('#txtChainName').val(acData.name);
            $('#chkDisabled').prop('checked', acData.isdisabled);
        }).catch((err) => {
            console.log(err);
        });
}

function DeleteChainAccountData(id, name) {
    let text = `Are you sure you want to delete "${name}"`; //"Are you sure you want to delete '+  +'!\nEither OK or Cancel.";
    if (confirm(text) == true) {
        axios
            .post("/account-chain/delete/"+ id).then((response) => {
                //console.log(response.data)
                alert(response.data.msg)
                redirect('/contracts');
            }).catch((err) => {
                console.log(err);
            });
    } else {
        text = "You canceled!";
    }
}
