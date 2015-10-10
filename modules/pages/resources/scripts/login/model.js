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
            window.location.href = '/hackathons';
        }
    });
}

function submitForm (form) {
    if (checkInputForErrors(form)) {
        switch (form) {
            case 'login' :
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
                break;
            case 'signup' :
                var username = document.getElementById('signup_username');
                var password = document.getElementById('signup_password');
                var passwordAgain = document.getElementById('signup_password_again');
                var email = document.getElementById('signup_email');

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
                            username.nextSibling.innerHTML = 'Just go login';
                            password.setAttribute('error', '');
                            password.nextSibling.innerHTML = 'You can use anything';
                            passwordAgain.setAttribute('error', '');
                            passwordAgain.nextSibling.innerHTML = '"asdf"';
                            email.setAttribute('error', '');
                            email.nextSibling.innerHTML = '"password"';
                        }
                    }
                };
                xmlhttp.open('POST', '/api/user', true);
                xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                xmlhttp.send('username=' + username.value + '&password=' + password.value);
                break;
        }
    }
}

function checkInputForErrors (form) {
    switch (form) {
        case 'login' :
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
        case 'signup' :
            /*var*/ hasError = false;

            var email = document.getElementById('signup_email');
            /*var*/ username = document.getElementById('signup_username');
            /*var*/ password = document.getElementById('signup_password');
            var passwordAgain = document.getElementById('signup_password_again');

            if (password.value === '') {
                password.setAttribute('error', '');
                password.nextSibling.innerHTML = 'Can\'t be blank';
                password.focus();
                hasError = true;
            } else {
                password.removeAttribute('error');
                password.nextSibling.innerHTML = 'We\'re all good';
            }
            if (password.value != passwordAgain.value) {
                password.setAttribute('error', '');
                password.nextSibling.innerHTML = 'Passwords don\'t match';
                passwordAgain.setAttribute('error', '');
                passwordAgain.nextSibling.innerHTML = 'Passwords don\'t match';
                password.focus();
                hasError = true;
            } else if (password.value !== '') {
                password.removeAttribute('error');
                password.nextSibling.innerHTML = 'We\'re all good';
                passwordAgain.removeAttribute('error');
                passwordAgain.nextSibling.innerHTML = 'We\'re all good';
            }
            if (email.value === '') {
                email.setAttribute('error', '');
                email.nextSibling.innerHTML = 'Can\'t be blank';
                email.focus();
                hasError = true;
            } else if (!isEmail(email.value)) {
                email.setAttribute('error', '');
                email.nextSibling.innerHTML = 'Enter a valid email';
                email.focus();
                hasError = true;
            } else {
                email.removeAttribute('error');
                email.nextSibling.innerHTML = 'We\'re all good';
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
}

function isEmail (email) {
    return (email.length >= 5 && email.indexOf(' ') == -1 && email.split('@').length == 2 && email.split('.').length == 2 && email.indexOf('@') < email.indexOf('.') - 1 && email.indexOf('@') !== 0 && email.indexOf('.') != email.length - 1);
}

function listenForReturnKey (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 13) {
        submitForm('login');
    }
}
