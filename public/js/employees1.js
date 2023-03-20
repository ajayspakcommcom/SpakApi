function getKamList() {
    
    isLoaderVisible(true);

    let empIdd = JSON.parse(window.localStorage.getItem('BSV_IVF_Admin_Data')).empId, userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));

    let param = {
        empId: empIdd
    }

    axios
    .post('/employees/kamlist', param).then((response) => {
        // console.log(response.data[0])
        //console.log(response.data);

        let list = response.data, listArr = [];
        let indx = 0;

       // console.log('id', list);

        list.forEach((data) => {
            //console.log(data);
            let hyperLink = (data.designation === 'RBM') ? `<a href="../account-mapping/${data.empID}/rate-contract-list">RC Details</a>` : `<a href="../account-mapping/${data.empID}">Account Mapping Data</a>`;
           // console.log(hyperLink)
            indx = indx + 1;
            listArr.push(
                `<tr>
                    <td>${indx}</td>
                    <td>${data.firstName}</td>
                    <td>${hyperLink}</td>
                    <td>
                        <a href="/employees/centre-list/${data.empID}">Master Data</a>
                    </td>
                </tr>
            `)
        });
        $('#kamData').append(listArr.join(''));

        if(userData.post.toLowerCase() == 'zbm' || userData.post.toLowerCase() == 'rbm') {
            //$('.table-data > thead > tr > th:last-child').hide();
            //$('.table-data > tbody > tr > td:last-child').hide();
        }
        
        isLoaderVisible(false);

        //let res = response.data[0];
        //console.log(res);
        // if (res.sucess === 'true') {
        //     redirect('/sku');
        // } else {
           
        // }
    }).catch((err) => {
        console.log(err);
    });


}