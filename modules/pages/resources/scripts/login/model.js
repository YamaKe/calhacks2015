function openMessaging () {
    var header = document.getElementsByTagName('header');
    var card = document.getElementById('main');
    var tweenTime = 0.7;

    TweenLite.to(header, tweenTime, {
        ease: Power4.easeIn,
        height: '0px'
    });
    TweenLite.to(card, tweenTime, {
        ease: Power4.easeIn,
        marginTop: '252px'
    });
    TweenLite.to(card, tweenTime, {
        ease: Power4.easeIn,
        top: '-917px',
        onComplete: function () {
            window.location.href = '/reports';
        }
    });
}

function submitForm () {
    if (checkInputForErrors()) {
        var username = document.getElementById('login_username');
        var password = document.getElementById('login_password');

        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                if (xmlhttp.responseText.includes('authenticated')) {
                    openMessaging();
                } else {
                    username.setAttribute('error', '');
                    username.nextSibling.innerHTML = 'Bad login';
                    password.setAttribute('error', '');
                    password.nextSibling.innerHTML = 'Bad login';
                }
            }
        };
        xmlhttp.open('POST', '/api/login/local', true);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xmlhttp.send('username=' + username.value + '&password=' + password.value);
    }
}

function checkInputForErrors () {
    var hasError = false;

    var username = document.getElementById('login_username');
    var password = document.getElementById('login_password');

    if (password.value === '') {
        password.setAttribute('error', '');
        password.nextSibling.innerHTML = 'Can\'t be blank';
        password.focus();
        hasError = true;
    } else {
        password.removeAttribute('error');
        password.nextSibling.innerHTML = 'We\'re all good';
    }
    if (username.value === '') {
        username.setAttribute('error', '');
        username.nextSibling.innerHTML = 'Can\'t be blank';
        username.focus();
        hasError = true;
    } else {
        username.removeAttribute('error');
        username.nextSibling.innerHTML = 'We\'re all good';
    }
    return !hasError;
}

function isEmail (email) {
    return (email.length >= 5 && email.indexOf(' ') == -1 && email.split('@').length == 2 && email.split('.').length == 2 && email.indexOf('@') < email.indexOf('.') - 1 && email.indexOf('@') !== 0 && email.indexOf('.') != email.length - 1);
}

function listenForReturnKey (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 13) {
        submitForm();
    }
}
