var brandGroupList = []
function getSkuDetails() {
    console.log('ready')
    getMasterData();
    if (!isEditPage()) {
        return;
    }
    let urlArr = window.location.href.split('/'),
        skuId = urlArr[urlArr.length - 1];
    console.log(skuId);
    axios
        .get('/sku-details/' + skuId).then((response) => {
            console.log(response.data)
            let skuData = response.data;
            $('#txtSkuName').val(skuData.medicineName);
            $('#txtSkuPrice').val(skuData.price);
            $('#chkDisabled').prop('checked', skuData.isdisabled);
            $('#hidBrand').val(skuData.brandId);
            $('#hidBrandGroup').val(skuData.brandGroupId);
            setTimeout(cmbValues,5000);
        }).catch((err) => {
            console.log(err);
        });
}

function cmbValues() {
    $("#cmbBrands").val($('#hidBrand').val());
    //loadBrandGroup($("#cmbBrands"));
    loadBrandGroup($("#cmbBrands")[0]);
    setTimeout(() => {
        $("#cmbBrandGroup").val($('#hidBrandGroup').val())    
    }, 2000);
    
}

function getMasterData() {
    axios
        .get('/sku/master-data/').then((response) => {
            let brandList = response.data[0];
            brandGroupList = response.data[1];
            loadComboBox(brandList, 'cmbBrands', 'brandId', 'brandName');

        }).catch((err) => {
            console.log(err);
        });
}

function loadBrandGroup(obj) {
    // console.log(obj.val());
    console.log(obj.value);
    filterList = brandGroupList.filter((item) => {
        //return (item.brandId == obj.value || obj.val())
        return (item.brandId == obj.value);
    })
    loadComboBox(filterList, 'cmbBrandGroup', 'brandGroupID', 'groupName');
}


function validateMe() {

    let brand = $('#cmbBrands'),
        brandGroup = $('#cmbBrandGroup'),
        txtSkuName = $('#txtSkuName'),
        txtSkuPrice = $('#txtSkuPrice');


    if (brand.val() == '') {
        alert('Please select Brand')
        brand.focus();
        return false;
    }
    else if (brandGroup.val() == '') {
        alert('Please select Brand group')
        brandGroup.focus();
        return false;
    } else if (txtSkuName.val() == '') {
        alert('Please enter Sku name')
        txtSkuName.focus();
        return false;
    } else if (txtSkuPrice.val() == '') {
        alert('Please enter Sku Price')
        txtSkuPrice.focus();
        return false;
    }


    let urlArr = window.location.href.split('/'),
        skuId = urlArr[urlArr.length - 1];

    console.log(skuId);

    let param = {
        cmbBrands: brand.val(),
        cmbBrandGroup: brandGroup.val(),
        txtSkuName: $('#txtSkuName').val(),
        txtSkuPrice: $('#txtSkuPrice').val(),
        chkDisabled: $('#chkDisabled').is(":checked"),
        skuId: isNaN(skuId) ? null : parseInt(skuId)
    }
    console.log(param)
    URL = isEditPage() ? '/sku-edit/' + skuId : '/add-sku'

    axios
        .post(URL, param).then((response) => {
            console.log(response.data[0])
            let res = response.data[0];
            if (res.sucess === 'true') {
                redirect('/sku');
            } else {
                //     $('#lblMsg').text(res.msg);
            }
        }).catch((err) => {
            console.log(err);
        });

}


function getSKUList() {
    axios
        .get('/sku-list').then((response) => {
            // console.log(response.data)
            let list = response.data,
                listArr = [];
            console.log(list);

            list.forEach(data => {
                listArr.push(
                    `<tr>
                    <td>${data.brandName}</td>
                    <td>${data.groupName}</td>
                    <td>${data.medicineName}</td>
                    <td>${data.price}</td>
                    <td><a href="/sku-edit/${data.SkuId}">Edit</a> | <a href='javascript:void(0)' onclick='DeleteCustomer(${data.SkuId},"${data.medicineName}");return false;'>Delete</a></td>
                    </tr>
                `)
            });
            $('#skudata').append(listArr.join(''))
        }).catch((err) => {
            console.log(err);
        });
}


function DeleteCustomer(id, name) {
    let text = `Are you sure you want to delete "${name}"`; // "Are you sure you want to delete '+  +'!\nEither OK or Cancel.";
    if (confirm(text) == true) {
        axios
            .post("/sku/delete/"+ id).then((response) => {
                //console.log(response.data)
                alert(response.data.msg)
                redirect('/sku');
            }).catch((err) => {
                console.log(err);
            });
    } else {
        text = "You canceled!";
    }
}