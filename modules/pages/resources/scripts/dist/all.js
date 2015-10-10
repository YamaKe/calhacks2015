// (function () {
//     var app = angular.module('PokiMonster', []);
//     app.controller('PageController', function () {
//         // TODO: make this reference the one in NavMenuController
//         this.MenuItems = [
//             {name: 'Home', link: '#home'},
//             {name: 'Order', link: '#order'},
//             {name: 'Locations', link: '#locations'}
//         ];
//     });
//     app.controller('NavMenuController', function ($element) {
//         this.MenuItems = [
//             {name: 'Home', link: '#home'},
//             {name: 'Order', link: '#order'},
//             {name: 'Locations', link: '#locations'}
//         ];
//
//         var fixedMenu = document.getElementById('fixed-menu');
//         document.getElementById('root').addEventListener('scroll', function () {
//             var scrollY = $element[0].getBoundingClientRect().top;
//             // console.log(scrollY);
//             if (scrollY < 94) {
//                 fixedMenu.style.display = 'block';
//                 if (scrollY > 47) {
//                     var multiplier = (1 - ((scrollY - 47) / (94 - 47)));
//                     fixedMenu.style.backgroundColor = 'rgba(250, 250, 250, ' + multiplier + ')';
//                     fixedMenu.firstElementChild.style.boxShadow = '0 ' + multiplier * 6 + 'px ' + multiplier * 10 + 'px 0 rgba(0, 0, 0, ' + multiplier * 0.3 + '), 0 ' + multiplier * 2 + 'px ' + multiplier * 2 + 'px 0 rgba(0, 0, 0, ' + multiplier * 0.2 + ')';
//                 } else {
//                     fixedMenu.style.backgroundColor = 'rgba(250, 250, 250, 1)';
//                     fixedMenu.firstElementChild.style.boxShadow = '0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(0, 0, 0, 0.2)';
//                 }
//             } else {
//                 fixedMenu.style.display = 'none';
//             }
//         });
//     });
// })();

function SpecialScroll (applyTo, relativeSpeed) {
    this.relativeSpeed = relativeSpeed;
    this.applyTo = applyTo;
    this.onscroll = function (scroll) {
        if (!window.mobilecheck()) {
            var newPos = scroll * -this.relativeSpeed;
            this.applyTo.style.transform = "translateY(" + (newPos) + "px)";
            this.applyTo.style.webkitTransform = "translateY(" + (newPos) + "px)";
        }
    };
}
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
            window.location.href = 'messaging';
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
                        if (xmlhttp.responseText.includes('success')) {
                            openMessaging();
                        } else {
                            username.setAttribute('error', '');
                            username.nextSibling.innerHTML = 'Bad login';
                            password.setAttribute('error', '');
                            password.nextSibling.innerHTML = 'Bad login';
                        }
                    }
                };
                xmlhttp.open('POST', '/login', true);
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
                        if (xmlhttp.responseText.includes('success')) {
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
                xmlhttp.open('POST', '/signup', true);
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

(function () {
    ngApp.controller('LocationsController', ['$scope', 'LocationsModel', function ($scope, LocationsModel) {
        this.selectedLocation = 0;
        this.setSelectedLocation = function (selectedLocation) {
            this.selectedLocation = selectedLocation;
            // $scope.mapView.src = 'test';
        };

        if (navigator.geolocation) {
            var that = this;
            navigator.geolocation.getCurrentPosition(function (pos) {
                LocationsModel.getLocationsSorted(pos.coords.latitude, pos.coords.longitude, function (locs, that) {
                    for (var i in locs[0]) {
                        var open = locs[0][i].hours_sun_open;
                        var close = locs[0][i].hours_sun_close;
                        if (new Date('1970-01-01T' + open) < new Date('1970-01-01T' + close)) {
                            locs[0][i].hours_sun = open.substring(0, 5) + ' - ' + close.substring(0, 5);
                        } else {
                            locs[0][i].hours_sun = 'closed';
                        }
                        open = locs[0][i].hours_mon_open;
                        close = locs[0][i].hours_mon_close;
                        if (new Date('1970-01-01T' + open) < new Date('1970-01-01T' + close)) {
                            locs[0][i].hours_mon = open.substring(0, 5) + ' - ' + close.substring(0, 5);
                        } else {
                            locs[0][i].hours_mon = 'closed';
                        }
                        open = locs[0][i].hours_tue_open;
                        close = locs[0][i].hours_tue_close;
                        if (new Date('1970-01-01T' + open) < new Date('1970-01-01T' + close)) {
                            locs[0][i].hours_tue = open.substring(0, 5) + ' - ' + close.substring(0, 5);
                        } else {
                            locs[0][i].hours_tue = 'closed';
                        }
                        open = locs[0][i].hours_wed_open;
                        close = locs[0][i].hours_wed_close;
                        if (new Date('1970-01-01T' + open) < new Date('1970-01-01T' + close)) {
                            locs[0][i].hours_wed = open.substring(0, 5) + ' - ' + close.substring(0, 5);
                        } else {
                            locs[0][i].hours_wed = 'closed';
                        }
                        open = locs[0][i].hours_thu_open;
                        close = locs[0][i].hours_thu_close;
                        if (new Date('1970-01-01T' + open) < new Date('1970-01-01T' + close)) {
                            locs[0][i].hours_thu = open.substring(0, 5) + ' - ' + close.substring(0, 5);
                        } else {
                            locs[0][i].hours_thu = 'closed';
                        }
                        open = locs[0][i].hours_fri_open;
                        close = locs[0][i].hours_fri_close;
                        if (new Date('1970-01-01T' + open) < new Date('1970-01-01T' + close)) {
                            locs[0][i].hours_fri = open.substring(0, 5) + ' - ' + close.substring(0, 5);
                        } else {
                            locs[0][i].hours_fri = 'closed';
                        }
                        open = locs[0][i].hours_sat_open;
                        close = locs[0][i].hours_sat_close;
                        if (new Date('1970-01-01T' + open) < new Date('1970-01-01T' + close)) {
                            locs[0][i].hours_sat = open.substring(0, 5) + ' - ' + close.substring(0, 5);
                        } else {
                            locs[0][i].hours_sat = 'closed';
                        }
                    }
                    that.locations = locs[0];
                    that.setSelectedLocation(0);
                }, that);
            });
        } else {
            LocationsModel.getLocations(function (locs, that) {
                that.locations = locs[0];
                that.setSelectedLocation(0);
            }, this);
            alert('Geolocation is not supported by this browser.');
        }
    }]);

    ngApp.filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);
})();

function SpecialScroll (applyTo, relativeSpeed) {
    this.relativeSpeed = relativeSpeed;
    this.applyTo = applyTo;
    this.onscroll = function (scroll) {
        if (!window.mobilecheck()) {
            var newPos = scroll * -this.relativeSpeed;
            this.applyTo.style.transform = "translateY(" + (newPos) + "px)";
            this.applyTo.style.webkitTransform = "translateY(" + (newPos) + "px)";
        }
    };
}
(function () {
    ngApp.factory('LocationsModel', ['$resource', function ($resource) {
        var Locations = $resource('/api/:resource', {}, {
            query: {method:'GET', params:{
                resource: 'locations',
                latitude: '@latitude',
                longitude: '@longitude',
                list: '@list'
            }, isArray: true}
        });
        var factory = {};
        factory.getLocations = function (callback, that) {
            Locations.query(function (locs) {
                callback(locs, that);
            });
        };
        factory.getLocationsSorted = function (latitude, longitude, callback, that) {
            Locations.query({latitude: latitude, longitude: longitude, list:'true'}, function (locs) {
                callback(locs, that);
            });
        };
        factory.getClosestLocation = function (latitude, longitude, callback, that) {
            Locations.get({latitude: latitude, longitude: longitude}, function (loc) {
                callback(loc, that);
            });
        };

        return factory;
    }]);
})();
