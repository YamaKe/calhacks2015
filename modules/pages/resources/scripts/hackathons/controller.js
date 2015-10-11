var hacks = {
    scope: undefined,
    getAngularScopeOutside: function () {
        this.scope = angular.element(document.getElementsByTagName('html')[0]).scope().$$childHead;
    }
};

(function () {
    ngApp.controller('HackathonsController', ['$scope', '$timeout', '$mdSidenav', '$mdDialog', '$mdUtil', 'HackathonsModel', function ($scope, $timeout, $mdSidenav, $mdDialog, $mdUtil, HackathonsModel) {
        this.page = {
            name: './hack'
        };
        this.toolbarItems = [
            {icon: 'account-plus', title: 'Add Employee', importance: 1, onclick: function ($event) {
                $scope.showAddUserDialog($event);
            }},
            {icon: 'account-multiple-plus', title: 'Add Position', importance: 2, onclick: function ($event) {
                $scope.showAddPositionDialog($event);
            }},
            {icon: 'settings', title: 'Settings', importance: 3, onclick: function () {
                // window.location.href = '/api/logout';
            }},
            {icon: 'logout', title: 'Logout', importance: 4, onclick: function () {
                window.location.href = '/api/logout';
            }}
        ];
        this.hackathons = HackathonsModel.hackathons;
        this.positions = HackathonsModel.positions;
        this.employees = HackathonsModel.employees;

        $scope.toggleNavDrawer = $mdUtil.debounce(function () {
            $mdSidenav('left').toggle();
        }, 200);

        var allSelected = false;
        this.selectAll = function () {
            allSelected = !allSelected;
            for (var i in HackathonsModel.employees) {
                HackathonsModel.employees[i].selected = allSelected;
            }
        };

        $scope.showAddUserDialog = function (ev) {
            $mdDialog.show({
                controller: AddUserDialogController,
                templateUrl: '/parts/reports/add_user_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        $scope.showAddPositionDialog = function (ev) {
            $mdDialog.show({
                controller: AddPositionDialogController,
                templateUrl: '/parts/reports/add_position_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        this.viewEmployee = function (ev, employee) {
            employee = HackathonsModel.employeesDict[employee];
            $mdDialog.show({
                controller: EditEmployeeDialogController,
                locals: {
                    employee: employee,
                    location: HackathonsModel.positionsDict[employee.position].title,
                    position: HackathonsModel.locationsDict[employee.location].address
                },
                templateUrl: '/parts/reports/edit_user_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        this.querySearch = function (query) {
            var results = query ? this.positions.filter(this.createFilterFor(query)) : [];
            return results;
        };

        this.createFilterFor = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn (state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        };

        $scope.expandHackathon = function ($event, hackathon) {
            $mdDialog.show({
                controller: HackathonDialogController,
                locals: {
                    hackathon: hackathon
                },
                templateUrl: '/parts/reports/hackathon_dialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false
            });
        };

        hacks.getAngularScopeOutside();
    }]);
    function HackathonDialogController ($scope, $mdDialog, HackathonsModel, hackathon) {
        $scope.hackathon = hackathon;
        $scope.user = {
            role: {
                name: 'Attendee',
                priviliged: false
            }
        };
        $scope.discussions = [];
        HackathonsModel.getDiscussions({hackathon_id: hackathon._id, limit: 25}, function (threads) {
            $scope.discussions = threads[0].threadboard;
        });

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.save = function () {
            $mdDialog.hide();
        };
    }
    function AddPositionDialogController ($scope, $mdDialog, HackathonsModel) {
        $scope.positions = HackathonsModel.positions;

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.addposition = function () {
            // TODO: for the location and positions are swapped in the dialog HTML
            var position = {
                title: $scope.title
            };
            HackathonsModel.addPosition(position, function (err) {
                if (err) {
                    // $mdDialog.hide();
                    alert(err.location);
                } else {
                    $mdDialog.hide();
                }
            });
        };
    }
    function AddUserDialogController ($scope, $mdDialog, HackathonsModel) {
        $scope.positions = HackathonsModel.positions;
        $scope.locations = HackathonsModel.locations;
        $scope.states = [
            'AK',
            'AL',
            'AR',
            'AZ',
            'CA',
            'CO',
            'CT',
            'DE',
            'FL',
            'GA',
            'HI',
            'IA',
            'ID',
            'IL',
            'IN',
            'KS',
            'KY',
            'LA',
            'MA',
            'MD',
            'ME',
            'MI',
            'MN',
            'MO',
            'MS',
            'MT',
            'NC',
            'ND',
            'NE',
            'NH',
            'NJ',
            'NM',
            'NV',
            'NY',
            'OH',
            'OK',
            'OR',
            'PA',
            'RI',
            'SC',
            'SD',
            'TN',
            'TX',
            'UT',
            'VA',
            'VT',
            'WA',
            'WI',
            'WV',
            'WY'
        ];

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.adduser = function () {
            // TODO: for the location and positions are swapped in the dialog HTML
            var user = {
                first_name: $scope.first_name,
                last_name: $scope.last_name,
                position: $scope.selectedItemLocation._id,
                location: $scope.selectedItemPosition._id,
                hourly_rate: $scope.hourly_rate,
                address: {
                    street: $scope.address,
                    city: $scope.city,
                    state: $scope.state,
                    zip_code: $scope.zip_code
                },
                phone: $scope.phone
            };
            HackathonsModel.addUser(user, function (err) {
                if (err) {
                    // $mdDialog.hide();
                    alert(err.location);
                } else {
                    $mdDialog.hide();
                }
            });
        };
    }
    function EditEmployeeDialogController ($scope, $mdDialog, HackathonsModel, employee, location, position) {
        console.log(employee);
        $scope.positions = HackathonsModel.positions;
        $scope.locations = HackathonsModel.locations;
        $scope.states = [
            'AK',
            'AL',
            'AR',
            'AZ',
            'CA',
            'CO',
            'CT',
            'DE',
            'FL',
            'GA',
            'HI',
            'IA',
            'ID',
            'IL',
            'IN',
            'KS',
            'KY',
            'LA',
            'MA',
            'MD',
            'ME',
            'MI',
            'MN',
            'MO',
            'MS',
            'MT',
            'NC',
            'ND',
            'NE',
            'NH',
            'NJ',
            'NM',
            'NV',
            'NY',
            'OH',
            'OK',
            'OR',
            'PA',
            'RI',
            'SC',
            'SD',
            'TN',
            'TX',
            'UT',
            'VA',
            'VT',
            'WA',
            'WI',
            'WV',
            'WY'
        ];
        $scope.employee = employee;
        $scope.location = location;
        $scope.position = position;

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.saveuser = function () {
            // TODO: for the location and positions are swapped in the dialog HTML
            console.log(employee._id);
            HackathonsModel.editUser(employee._id, employee, function (err) {
                if (err) {
                    // $mdDialog.hide();
                    alert(err.location);
                } else {
                    $mdDialog.hide();
                }
            });
        };
    }
    ngApp.controller('NavigationBarController', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('left').close().then(function () {
                $log.debug('close LEFT is done');
            });
        };
    });
    ngApp.directive('discussion', function () {
        return {
            scope: {
                discussion: '='
            },
            replace: true,
            restrict: 'E',
            template: '<ul><comment ng-repeat="comment in discussion" comment="comment"></comment></ul>'
            // controller: function ($scope, $element) {
            //
            // },
            // controllerAs: 'ctrlComment'
        };
    });
    ngApp.directive('comment', function ($compile, HackathonsModel) {
        return {
            scope: {
                comment: '='
            },
            restrict: 'E',
            templateUrl: '/parts/reports/comment.html',
            // template: '<li>{{comment.message}}</li>',
            link: function (scope, element) {
                // check if this member has children
                if (angular.isArray(scope.comment.replies)) {
                    $compile('<discussion discussion="comment.replies"></discussion>')(scope, function (cloned) {
                        element.append(cloned);
                    });
                }
            },
            controller: function ($scope) {
                $scope.usersDict = HackathonsModel.usersDict;
            },
            controllerAs: 'ctrlComment'
        };
    });
    ngApp.directive('keyListener', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('keypress', function (event) {
                    if (event.keyCode === 13 && !scope.shiftDown) {
                        event.preventDefault();
                        send_submit.click();
                    }
                });
                element.on('keydown', function (event) {
                    if (event.keyCode === 16) {
                        scope.shiftDown = true;
                    }
                });
                element.on('keyup', function (event) {
                    if (event.keyCode === 16) {
                        scope.shiftDown = false;
                    }
                });
            }
        };
    });
    ngApp.directive('openOverflow', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function () {
                    var overflowMenuList = document.getElementById('overflow_menu');
                    if (overflowMenuList.hasAttribute('open')) {
                        overflowMenuList.removeAttribute('open');
                    } else {
                        overflowMenuList.setAttribute('open', '');
                    }
                });
            }
        };
    });

    ngApp.directive('popupNewChat', function () {
        return {
            restrict: 'E',
            templateUrl: '/parts/common/popup_new_chat.html',
            controller: function ($scope) {
                this.users = $scope.ctrlMessenger.chats;
                // TODO: replace open and close with good Angular.JS
                this.open = function () {
                    var FABmain = document.getElementById('FAB');
                    var newChatDialogFrame = document.getElementById('popup_new_chat');
                    var newChatDialog = document.getElementById('actual_popup_new_chat');

                    newChatDialogFrame.style.display = 'block';
                    newChatDialog.style.position = 'absolute';
                    newChatDialog.style.left = FABmain.offsetLeft;
                    newChatDialog.style.width = FABmain.offsetWidth;
                    newChatDialog.style.top = FABmain.offsetTop - 30;
                    newChatDialog.style.height = FABmain.offsetHeight;
                    newChatDialog.style.padding = '0px';
                    newChatDialog.style.borderRadius = '28px';

                    FABmain.style.display = 'none';

                    var tweenTime = 0.3;
                    TweenLite.to(newChatDialog, tweenTime, {
                        top: '0px',
                        left: (window.innerWidth / 2 - 300) + 'px',
                        width: '500px',
                        height: '400px',
                        padding: '30px 50px 30px 50px',
                        borderRadius: '2px'
                    });

                    newChatDialogFrame.setAttribute('open', '');
                };
                this.close = function () {
                    var FABmain = document.getElementById('FAB');
                    var newChatDialogFrame = document.getElementById('popup_new_chat');
                    var newChatDialog = document.getElementById('actual_popup_new_chat');

                    FABmain.style.display = 'block';
                    var _top = FABmain.offsetTop - 80;
                    var _left = FABmain.offsetLeft;
                    var _width = FABmain.offsetWidth;
                    var _height = FABmain.offsetHeight;
                    FABmain.style.display = 'none';

                    var tweenTime = 0.3;
                    TweenLite.to(newChatDialog, tweenTime, {
                        top: _top,
                        left: _left,
                        width: _width,
                        height: _height,
                        padding: '0px',
                        borderRadius: '28px',

                        onComplete: function () {
                            newChatDialogFrame.style.display = 'none';
                            FABmain.style.display = 'block';
                        }
                    });

                    newChatDialogFrame.removeAttribute('open');
                };
            },
            controllerAs: 'ctrlPopupNewChat'
        };
    });
    ngApp.directive('popupNewChatOpen', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function () {
                    scope.ctrlPopupNewChat.open();
                });
            }
        };
    });
    ngApp.directive('popupNewChatClose', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function () {
                    scope.ctrlPopupNewChat.close();
                });
            }
        };
    });
    ngApp.directive('popupNewPosition', ['PositionsModel', function (PositionsModel) {
        return {
            restrict: 'E',
            templateUrl: '/parts/common/popup_new_position.html',
            controller: function ($scope) {
                // this.users = $scope.ctrlMessenger.chats;
                // TODO: replace open and close with good Angular.JS
                this.addPosition = function () {
                    var txtPosition = document.getElementById('positions_name');
                    var txtPositionError = document.getElementById('positions_name_error');
                    PositionsModel.addPosition($scope.position.name, function (position) {
                        if (!position.error) {
                            txtPosition.removeAttribute('error');
                            txtPositionError.innerHTML = '';
                        } else {
                            txtPosition.setAttribute('error', '');
                            txtPositionError.innerHTML = position.error;
                        }
                    });
                };
                this.open = function () {
                    var FABmain = document.getElementById('FAB');
                    var newChatDialogFrame = document.getElementById('popup_new_position');
                    var newChatDialog = document.getElementById('actual_popup_new_position');

                    newChatDialogFrame.style.display = 'block';
                    newChatDialog.style.position = 'absolute';
                    newChatDialog.style.left = FABmain.offsetLeft;
                    newChatDialog.style.width = FABmain.offsetWidth;
                    newChatDialog.style.top = FABmain.offsetTop - 30;
                    newChatDialog.style.height = FABmain.offsetHeight;
                    newChatDialog.style.padding = '0px';
                    newChatDialog.style.borderRadius = '28px';

                    FABmain.style.display = 'none';

                    var tweenTime = 0.3;
                    TweenLite.to(newChatDialog, tweenTime, {
                        top: '0px',
                        left: (window.innerWidth / 2 - 300) + 'px',
                        width: '500px',
                        height: '400px',
                        padding: '30px 50px 30px 50px',
                        borderRadius: '2px'
                    });

                    newPositionDialogFrame.setAttribute('open', '');
                };
                this.close = function () {
                    var FABmain = document.getElementById('FAB');
                    var newChatDialogFrame = document.getElementById('popup_new_chat');
                    var newChatDialog = document.getElementById('actual_popup_new_chat');

                    FABmain.style.display = 'block';
                    var _top = FABmain.offsetTop - 80;
                    var _left = FABmain.offsetLeft;
                    var _width = FABmain.offsetWidth;
                    var _height = FABmain.offsetHeight;
                    FABmain.style.display = 'none';

                    var tweenTime = 0.3;
                    TweenLite.to(newChatDialog, tweenTime, {
                        top: _top,
                        left: _left,
                        width: _width,
                        height: _height,
                        padding: '0px',
                        borderRadius: '28px',

                        onComplete: function () {
                            newChatDialogFrame.style.display = 'none';
                            FABmain.style.display = 'block';
                        }
                    });

                    newPositionDialogFrame.removeAttribute('open');
                };
            },
            controllerAs: 'ctrlPopupNewPosition'
        };
    }]);
    ngApp.directive('popupNewPositionOpen', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function () {
                    scope.ctrlPopupNewPosition.open();
                });
            }
        };
    });
    ngApp.directive('popupNewPositionClose', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function () {
                    scope.ctrlPopupNewPosition.close();
                });
            }
        };
    });

    ngApp.filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);
})();
