function setupPage() {

    isLoaderVisible(true);

    let myKamId = parseInt(getIdFromURL()),
        userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        param = {
            parentId: userData.empId,
        };
    axios
        .post(`/rc-list`, param).then((response) => {
            console.log(response.data);
            //   populateDataTable(response.data);
            let lists = response.data,
                listArr = [];
            lists.forEach(list => {
                listArr.push(
                    ` <tr>
                        <td>${formatText(list.accountName)}</td>
                        <td>${formatText(list.CENTRENAME)}</td>
                        <td>${formatText(list.DoctorName)}</td>
                        <td>${formatText(list.RateContractStatus)}</td>
                        <td><a href="/update-rc?customerAccountId=${list.aid}&customerid=${list.customerId}&CatAccountId=${list.CatAccountId}"> ${(list.CatAccountId > 0)? `Upload` : `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 17.35 17.35"><defs></defs><path class="cls-1" d="M8.67,14.22a.45.45,0,0,1-.24-.09c-.1-.06-.19-.14-.19-.42V6.85c0-1.09,0-2.18,0-3.27a.42.42,0,0,1,.42-.45l.17,0c.13,0,.27.15.27.47V13.77a.39.39,0,0,1-.24.39A.41.41,0,0,1,8.67,14.22Z"></path><path class="cls-1" d="M3.58,9.11a.39.39,0,0,1-.39-.24.41.41,0,0,1-.06-.2.45.45,0,0,1,.09-.24c0-.08.12-.19.42-.19H13.77a.42.42,0,0,1,.45.42.38.38,0,0,1,0,.17c0,.13-.14.27-.47.27Z"></path><path class="cls-1" d="M8.67,17.35a8.68,8.68,0,1,1,8.68-8.68A8.68,8.68,0,0,1,8.67,17.35Zm0-16.5A7.83,7.83,0,1,0,16.5,8.67,7.83,7.83,0,0,0,8.67.85Z"></path></svg>` }</a>
                        ${(list.SKUDetails === 0 && list.CatAccountId>0) ? `| <a href='/customer-contract-add/${list.CatAccountId}'>Add SKU Price list</a>`: ``}
                        ${(list.SKUDetails > 0 && list.CatAccountId>0) ? `| <a href='/customer-contract-add/${list.CatAccountId}'>Update SKU Price list</a>`: ``}
                    </td>
                </tr>
                `)
            });
            $('#centerList').append(listArr.join(''));
            isLoaderVisible(false);

        }).catch((err) => {
            console.log(err);
        });
}

function validateMe() {
    debugger;
    console.log(`here`)
    console.log($('#fileName'));
    let config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
        param = {
            parentId: parseInt(userData.empId),
            myKamId : parseInt(getQueryStringValue('custsomerid')),
            accountId : parseInt(getQueryStringValue('accountid')),
            expiryDate: $('#expiryDate').val(),
            files: $('#fileName')

        };
        //encType="multipart/form-data"
    axios
        .post(`/update-rc/`, param, config).then((response) => {
            console.log(response.data);

        }).catch((err) => {
            console.log(err);
        });

}

function setupRCdetails() {
    
    let myKamId = parseInt(getIdFromURL()),
    userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data")),
    param = {
        parentId: userData.empId,
    };
axios
    .get(`/account-chain-details/${getQueryStringValue('CatAccountId')}`).then((response) => {
        console.log(response.data);
        let data = response.data[0];
        if(data) {
            $('#lblcontractFile').html(`<a href="${_ROOT}/img/rcfiles/${data.contractDoc}" target="_blank">Click here to view the contract</a>`);
            $('#expiryDate').val(moment.utc(data.expiryDate).format('D-MMM-yy'))
            console.log(moment.utc(data.expiryDate).format('D-MMM-yy'));
            $('#hidfileName').val(data.contractDoc);
            
            
        }

    }).catch((err) => {
        console.log(err);
    });
}