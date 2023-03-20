const _SUCCESSFUL_STATUS_CODE = 200;
const _INVAID_SESSION = 202
const _FAILURE_STATUS_CODE = 201
//const _ROOT = 'http://ivf1.spak.agency'; 
const _ROOT = window.location.origin;
//const _ROOT = 'http://firtibiz-env.eba-m3syxjvp.ap-south-1.elasticbeanstalk.com';
const _SKU_BRANDS = ['FOLIGRAF', 'HUMOG', 'ASPORELIX', 'R-HUCOG', 'FOLICULIN', 'AGOTRIG', 'MIDYDROGEN', 'SPRIMEO'];

const _POST = {
    ZBM: 'ZBM',
    RBM: 'RBM',
    KAM: 'KAM',
    ADMIN: 'ADMIN'
};

const _URL = {
    _hospitalListing: '/hospitals',
    _POSTLOGINURL: '/hospitals',
    _HOSPITAL_UPDATE: '/hospitals-update/',
    _CUSTOMER_ADD: '/add-customer/',
    _CUSTOMER_LIST: '/customer/list',
    _EMPLOYEE_DELETE: '/employee-delete',
    _EMPLOYEE_EDIT: '/employee-edit/',
    _EMPLOYEE_DETAILS: '/employee-details/',
    _MASTER_DATA: '/master-data/',
    _EMPLOYEE_UPDATE: '/employee-update/',
    _EMPLOYEE_ADD: '/employee-add',
    _CUSTOMER: '/customers',
    _EMPLOYEE_HERARCHY: '/employee-hierarchy/',
    _EMPLOYEE_HERARCHY_EMP_AND_PARENT: '/employee-hierarchy-details/',
    _EMPLOYEE_HERARCHY_MGR_LIST: '/employee-hierarchy-mgr-list/',
    _EMPLOYEE_HERARCHY_EMP_MGR_UPDATE: '/employee-hierarchy-mgr-update/',
    _EMPLOYEE_HOSPITAL: '/employee-hospital/',
    _EMPLOYEE_HOSPITAL_LIST: '/employee-hospital-list/',
    _EMPLOYEE_HOSPITAL_EDIT: '/employee-hospital-edit/',
    _EMPLOYEE_HOSPITAL_NEW: '/employee-hospital-new/',
    _EMPLOYEE_HOSPITAL_UN_ASSIGNED: '/employee-hospital-un-assigned',
    _EMPLOYEE_HOSPITAL_UN_ASSIGNED_UPDATE: '/employee-hospital-un-assigned-update'
}

const approvedRejectedPendingIcon = [`<svg class="approved" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 20 20" version="1.1">
                                        <title>check_circle_outline</title>
                                        <desc>Created with Sketch.</desc>
                                        <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="Outlined" transform="translate(-578.000000, -244.000000)">
                                                <g id="Action" transform="translate(100.000000, 100.000000)">
                                                    <g id="Outlined-/-Action-/-check_circle_outline" transform="translate(476.000000, 142.000000)">
                                                        <g>
                                                            <polygon id="Path" points="0 0 24 0 24 24 0 24"/>
                                                            <path d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M12,20 C7.59,20 4,16.41 4,12 C4,7.59 7.59,4 12,4 C16.41,4 20,7.59 20,12 C20,16.41 16.41,20 12,20 Z M16.59,7.58 L10,14.17 L7.41,11.59 L6,13 L10,17 L18,9 L16.59,7.58 Z" id="🔹-Icon-Color" fill="#1D1D1D"/>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                        </svg>`, `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Icons" x="0px" y="0px" viewBox="0 0 32 32" class="pending" style="enable-background:new 0 0 32 32;" xml:space="preserve">
                                                    <style type="text/css">
                                                        .st0{fill:none;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
                                                        .st1{fill:none;stroke:#000000;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;}
                                                        .st2{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
                                                        .st3{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}
                                                        .st4{fill:none;stroke:#000000;stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;stroke-dasharray:3;}
                                                    </style>
                                                    <path class="st1" d="M22,6H10C8.3,6,7,4.7,7,3v0h18v0C25,4.7,23.7,6,22,6z"/>
                                                    <path class="st1" d="M10,26h12c1.7,0,3,1.3,3,3v0H7v0C7,27.3,8.3,26,10,26z"/>
                                                    <path class="st1" d="M23,26v-4c0-0.6-0.3-1.2-0.8-1.6l-3.7-2.8c-1.1-0.8-1.1-2.4,0-3.2l3.7-2.8c0.5-0.4,0.8-1,0.8-1.6V6"/>
                                                    <path class="st1" d="M9,6v4c0,0.6,0.3,1.2,0.8,1.6l3.7,2.8c1.1,0.8,1.1,2.4,0,3.2l-3.7,2.8C9.3,20.8,9,21.4,9,22v4"/>
                                                    <polygon class="st1" points="11,26 16,21 21,26 "/>
                                                    <polygon class="st1" points="16,12 13,10 19,10 "/>
                                                    </svg>`, `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="rejected" enable-background="new 0 0 512 512" id="Layer_1" version="1.1" viewBox="0 0 512 512" xml:space="preserve"><path d="M74.966,437.013c-99.97-99.97-99.97-262.065,0-362.037c100.002-99.97,262.066-99.97,362.067,0  c99.971,99.971,99.971,262.067,0,362.037C337.032,536.998,174.968,536.998,74.966,437.013z M391.782,120.227  c-75.001-74.985-196.564-74.985-271.534,0c-75.001,74.985-75.001,196.55,0,271.535c74.97,74.986,196.533,74.986,271.534,0  C466.754,316.775,466.754,195.212,391.782,120.227z M188.124,369.137l-45.251-45.266l67.876-67.877l-67.876-67.876l45.251-45.267  L256,210.743l67.877-67.892l45.25,45.267l-67.876,67.876l67.876,67.877l-45.25,45.266L256,301.245L188.124,369.137z"/></svg>`];


function checkIfValidStatus(statusCode) {
    switch (statusCode) {
        case _SUCCESSFUL_STATUS_CODE:
            return 1;
            break;
        case _FAILURE_STATUS_CODE:
            return 2;
            break;
        case _INVAID_SESSION:
            // lets do something
            break;
        default:
            break;
    }

}

function redirect(url) {
    document.location.href = url;
}

function isEditPage() {
    return (location.pathname.indexOf('add') < 0)

}

function loadComboBox(data, dropdown, displayValue, displayText, optionTextAlongWithDisplayText, txtFormat) {
    $('#' + dropdown).empty();
    //$('#' + dropdown).append($('<option></option>').val('').html('---- Select ----'));

    let selectHeader = '';

    switch (dropdown) {
        case 'cmbHosp':
            selectHeader = 'Select Hospital';
            break;
        case 'cmbRegion':
            selectHeader = 'Select State';
            break;
        case 'cmbBrandList':
            selectHeader = 'Select Brand';
            break;
        case 'cmbKam':
            selectHeader = 'Select KAM';
            break;
        case 'cmbRBM':
            selectHeader = 'Select RBM';
            break;
        case 'cmbZBM':
            selectHeader = 'Select ZBM';
            break;
        case 'cmbBrands':
            selectHeader = 'Select Brands';
            break;

        default:
            selectHeader = '----Select----';
            break;
    }

    $('#' + dropdown).append($('<option></option>').val('').html(`${selectHeader}`));
    $.each(data, function (index, item) {
        let text = (item[displayText]) ? formatText(item[displayText], txtFormat) : '',
            optinalText = ((optionTextAlongWithDisplayText) ? item[optionTextAlongWithDisplayText] : ''),
            textPlusOptionl = text + ((optinalText.length > 0) ? ' - ' + optinalText.toUpperCase() : '');


        //  console.log('-------------------------------------------')
        //  console.log(text)
        //  console.log(optinalText)
        //  console.log()
        //  console.log('-------------------------------------------')

        $('#' + dropdown).append(
            $('<option></option>').val(item[displayValue]).html((textPlusOptionl))
        );
    });
}

function formatText(str, type) {
    //console.log('text format -->' + type)
    switch (type) {
        case 'UPPER':
            return str.toUpperCase()
            break;
        case 'FirstLetterUPPER':
            return capitalizeFirstLetter(str.toLowerCase());
            break;
        default:
            return camelCaseText(str)
            break;
    }

}



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function camelCaseText(str) {
    if (str) {
        let arr = str.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();

        }
        return arr.join(" ");
    }
}


function getIdFromURL() {
    let urlArr = window.location.href.split('/');
    return urlArr[urlArr.length - 1];
}

function getFirstDayPreviousMonth() {
    const date = new Date();
    let dt = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    $('#cmbMonth').val(dt.getMonth() + 1); // our combo box starts with 1
    $('#cmbYear').val(dt.getFullYear());
    //$('#cmbMonth').attr('disabled', 'disabled');
    $('#cmbYear').attr('disabled', 'disabled');
}


function logMeOut() {
    localStorage.setItem("userData", null);
    localStorage.clear();
    document.location.href = "/";
}

function DisabledInput(elemClassName) {
    $(`.${elemClassName}`).prop('disabled', true);
}


// $('.col-wrapper').on('click', '.img-wrapper', function(){
//     let $this = $(this);
//     $this.parents('.col-wrapper').append(`
//         <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
//             <div class="form-group add-input-wrapper">
//             <input type="text" class="form-control" id="assistantTxt" name="assistantTxt" placeholder="Ivf Dr Assistant" />
//             <div class="img-wrapper">
//                 <img src="../../img/plus.png" alt="add input" class="img-responsive" />
//             </div>
//             </div>    
//         </div>
//     `);
// });

function goBack() {
    window.history.back();
}

function enableApproveButton() {
    console.log('enable button')
    $('#btnApprove').prop('disabled', !$('#chkApproved').is(":checked"));
}

function getQueryStringValue(key) {
    //console.log(window.location)
    let urlSearchParams = new URLSearchParams(window.location.search);
    //console.log(urlSearchParams)
    return urlSearchParams.get(key);
}

function showElementByDesignation() {
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));
    if (userData != null) {
        switch (userData.post.toLowerCase()) {
            case 'kam':
                //  console.log('Kam Level');
                break;
            case 'rbm':
                $('.addNewCustomer').hide();
                //console.log('Rbm Level');                
                break;
            case 'zbm':
                $('.addNewCustomer').hide();
                //console.log('zbm Level');      
                break;
            case 'admin':
                console.log('Admin Level');
                break;
        }
    }
}

function showNavigationByDesignation() {
    let userData = JSON.parse(localStorage.getItem("BSV_IVF_Admin_Data"));

    if (userData != null) {
        $('#ulLink > li').hide();
        $('.userLink, .logoutLink').show();

        $('#userName').text(userData.name);
        $('#userPost').text(userData.post);

        switch (userData.post.toLowerCase()) {
            case 'kam':
                $('.kamLink').show();
                break;
            case 'rbm':
                $('#logoLink').attr('href', '/employees/kam-list');
                $('.rbmLink').show();
                break;
            case 'zbm':
                $('#logoLink').attr('href', '/employees/kam-list');
                $('.zbmLink').show();
                break;
            case 'admin':
                $('.adminLink').show();
                break;
        }
    }
}

function showDrNameCentreName() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    $('#drName').text(params.drName);
    $('#centreName').text(params.centreName);
}

function addPrevValueOnFocus(elem) {
    if (parseInt(elem.value) == 0) {
        elem.value = '';
    } else {
        elem.value = elem.value;
    }
}

function addPrevValueOnFocusOut(elem) {
    //console.log(elem.value);
    if (elem.value == undefined || elem.value == null || elem.value == '') {
        elem.value = 0;
    }
}

setTimeout(() => {
    showNavigationByDesignation();
    showElementByDesignation();
}, 2000);

function intToString(num) {
    num = num.toString().replace(/[^0-9.]/g, '');
    if (num < 1000) {
        return num;
    }
    let si = [
        { v: 1E3, s: "K" },
        { v: 1E6, s: "M" },
        { v: 1E9, s: "B" },
        { v: 1E12, s: "T" },
        { v: 1E15, s: "P" },
        { v: 1E18, s: "E" }
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
        if (num >= si[index].v) {
            break;
        }
    }
    return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
}

function validateAllInput() {

    isValid = true;

    $("input").each(function () {
        var element = $(this);
        if (element.val() == "") {
            isValid = false;
            element.after(`<p class="errorTxt">${element.attr('error')}</p>`);
        }
    });

    return isValid;
}

function isLoaderVisible(isVisible) {
    if (isVisible == true) {
        $('.loader').addClass('visible');
    } else {
        $('.loader').removeClass('visible');
    }
}

function isBtnLoaderVisible(isVisible) {
    if (isVisible == true) {
        $('.loader-img').addClass('show');
    } else {
        $('.loader-img').removeClass('show');
    }
}

function addActiveClassToLink(pos) {
    const links = $('.navigation-ul > li');
    if (links[pos]) {
        links[pos].querySelector('a').classList.add('active');
    }
}

function setActiveLink() {
    let url = window.location.pathname;

    if (url.includes('hospitals')) {
        addActiveClassToLink(0);
    }
    else if (url.includes('customers')) {
        addActiveClassToLink(1);
    }
    else if (url.includes('rc-list')) {
        addActiveClassToLink(7);
    }
}

function showYear() {
    const elem = document.getElementById('showYearId');
    if (elem) {
        elem.textContent = new Date().getFullYear();
    }
}

setTimeout(() => {
    //setActiveLink();
    showYear();
}, 4000);

function toggleMenu() {
    $('.menu-overlay').toggleClass('show');
    $('.inside-theme .theme-wrapper .navigation').toggleClass('show');
}


$('.menu-overlay').on('click', function () {
    toggleMenu();
});


function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
        }, {})
}


