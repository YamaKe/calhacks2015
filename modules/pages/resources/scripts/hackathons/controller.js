var hacks = {
    scope: undefined,
    getAngularScopeOutside: function () {
        this.scope = angular.element(document.getElementsByTagName('html')[0]).scope().$$childHead;
    }
};

(function () {
    ngApp.controller('HackathonsController', ['$scope', '$timeout', '$mdSidenav', '$mdDialog', '$mdUtil', 'PokiTimeModel', 'ReportsModel', function ($scope, $timeout, $mdSidenav, $mdDialog, $mdUtil, PokiTimeModel, ReportsModel) {
        this.page = {
            name: 'Poki Time'
        };
        this.toolbarItems = [
            {icon: 'file-excel', title: 'Generate Report', importance: 0, onclick: function () {
                ReportsModel.exportXLS();
            }},
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
        this.positions = PokiTimeModel.positions;
        this.employees = PokiTimeModel.employees;
        this.generatedReport = ReportsModel.generatedReport;

        $scope.toggleNavDrawer = $mdUtil.debounce(function () {
            $mdSidenav('left').toggle();
        }, 200);

        var allSelected = false;
        this.selectAll = function () {
            allSelected = !allSelected;
            for (var i in PokiTimeModel.employees) {
                PokiTimeModel.employees[i].selected = allSelected;
            }
        };

        $scope.showGenerateReportDialog = function (ev) {
            $mdDialog.show({
                controller: GenerateReportDialogController,
                templateUrl: '/parts/reports/generate_report_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
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
            employee = PokiTimeModel.employeesDict[employee];
            $mdDialog.show({
                controller: EditEmployeeDialogController,
                locals: {
                    employee: employee,
                    location: PokiTimeModel.positionsDict[employee.position].title,
                    position: PokiTimeModel.locationsDict[employee.location].address
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

        hacks.getAngularScopeOutside();
    }]);
    function GenerateReportDialogController ($scope, $mdDialog, PokiTimeModel, ReportsModel) {
        $scope.employees = PokiTimeModel.employees;
        $scope.date_from = ReportsModel.date_from;
        $scope.date_to = ReportsModel.date_to;

        $scope.timePeriodShiftPresets = [{name:'This', shift:0},{name:'Last', shift:-1}];
        var thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        var this2weeks = new Date();
        this2weeks.setDate(-this2weeks.getDay() - 7);
        this2weeks.setHours(0, 0, 0, 0);
        var thisWeek = new Date();
        thisWeek.setDate(-thisWeek.getDay());
        thisWeek.setHours(0, 0, 0, 0);
        var thisQuarter = new Date();
        thisQuarter.setDate(1);
        thisQuarter.setHours(0, 0, 0, 0);
        var thisHalfYear = new Date();
        if (thisHalfYear.getMonth() > 6) {
            thisHalfYear.setMonth(6);
        } else {
            thisHalfYear.setMonth(0);
        }
        thisHalfYear.setDate(1);
        thisHalfYear.setHours(0, 0, 0, 0);
        var thisYear = new Date();
        thisYear.setDate(1);
        thisYear.setMonth(0);
        thisYear.setHours(0, 0, 0, 0);
        $scope.timePeriodPresets = [
            {name: 'month', start: thisMonth, stop: new Date()},
            {name: '2 weeks', start: thisMonth, stop: new Date()},
            {name: 'week', start: thisMonth, stop: new Date()},
            {name: 'quarter', start: thisMonth, stop: new Date()},
            {name: 'half year', start: thisMonth, stop: new Date()},
            {name: 'year', start: thisMonth, stop: new Date()},
        ];

        $scope.timePeriodShift = $scope.timePeriodPresets[0];
        $scope.timePeriod = $scope.timePeriodPresets[0];

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.generate = function () {
            var employeesInReport = [];
            for (var i in $scope.employees) {
                if ($scope.employees[i].selected && $scope.employees[i]._id !== undefined) {
                    employeesInReport.push($scope.employees[i]._id);
                }
            }
            ReportsModel.generateReport(employeesInReport, $scope.date_from, $scope.date_to);
            $mdDialog.hide();
        };
    }
    function AddPositionDialogController ($scope, $mdDialog, PokiTimeModel) {
        $scope.positions = PokiTimeModel.positions;

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
            PokiTimeModel.addPosition(position, function (err) {
                if (err) {
                    // $mdDialog.hide();
                    alert(err.location);
                } else {
                    $mdDialog.hide();
                }
            });
        };
    }
    function AddUserDialogController ($scope, $mdDialog, PokiTimeModel) {
        $scope.positions = PokiTimeModel.positions;
        $scope.locations = PokiTimeModel.locations;
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
            PokiTimeModel.addUser(user, function (err) {
                if (err) {
                    // $mdDialog.hide();
                    alert(err.location);
                } else {
                    $mdDialog.hide();
                }
            });
        };
    }
    function EditEmployeeDialogController ($scope, $mdDialog, PokiTimeModel, employee, location, position) {
        console.log(employee);
        $scope.positions = PokiTimeModel.positions;
        $scope.locations = PokiTimeModel.locations;
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
            PokiTimeModel.editUser(employee._id, employee, function (err) {
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
    ngApp.directive('generateReport', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$evalAsync(function () {
                    element[0].style.height = element[0].getElementsByClassName('text')[0].offsetHeight + 10;
                    var tweenTime = 0.5;
                    TweenLite.to(element[0].parentElement, tweenTime, {
                        scrollTop: element[0].parentElement.scrollHeight
                    });
                });
            }
        };
    });
    ngApp.directive('resizeHeight', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                scope.$evalAsync(function () {
                    element[0].style.height = element[0].getElementsByClassName('text')[0].offsetHeight + 10;
                    var tweenTime = 0.5;
                    TweenLite.to(element[0].parentElement, tweenTime, {
                        scrollTop: element[0].parentElement.scrollHeight
                    });
                });
            }
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
    ngApp.directive('sendMessage', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function (event) {
                    event.preventDefault();
                    if ((scope.message !== '' && /\S/.test(scope.message)) || (scope.attachment && scope.attachment.length > 0)) {
                        scope.ctrlChat.sendMessage(scope.message, scope.attachment);
                        scope.attachment = '';
                        scope.message = '';
                        send_media_dialogue.removeAttribute('open');
                        send_media_dialogue.removeAttribute('previewing');
                        send_media_dialogue_preview_img.style.backgroundImage = 'url(' + event.target.result + ')';
                        if (send_attachment_input.files.length > 0) {
                            for (var i = 0; i < send_attachment_input.files.length; i++) {
                                send_attachment_input.files[i] = undefined;
                            }
                        }
                        scope.$apply();
                    }
                    send_message.focus();
                });
            }
        };
    });
    ngApp.directive('attachMessage', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function (event) {
                    event.preventDefault();
                    if (send_media_dialogue.getAttribute('open') !== '') {
                        send_media_dialogue.setAttribute('open', '');
                    } else {
                        send_media_dialogue.removeAttribute('open');
                    }
                });
            }
        };
    });
    ngApp.directive('attachDialogue', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('change', function (event) {
                    // event.preventDefault();
                    if (event.srcElement.files && event.srcElement.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            send_media_dialogue_preview_img.style.backgroundImage = 'url(' + e.target.result + ')';
                            element[0].parentElement.parentElement.setAttribute('previewing', '');
                            scope.attachment = e.target.result;
                        };
                        reader.readAsDataURL(event.srcElement.files[0]);
                    }
                });
            }
        };
    });
    ngApp.directive('cancelAttachDialogue', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('click', function () {
                    element[0].parentElement.removeAttribute('previewing');
                });
            }
        };
    });
    ngApp.directive('chatsList', function () {
        return {
            restrict: 'E',
            templateUrl: '/parts/common/chats_list.html',
            controller: function ($scope) {
                this.chats = $scope.ctrlMessenger.chats;
            },
            controllerAs: 'ctrlChatList'
        };
    });
    ngApp.directive('chatListClick', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (scope.chat.user !== undefined) {
                    attrs.user = scope.chat.id;
                    // element[0].setAttribute('user', scope.chat.id);
                }
                element.on('click', function () {
                    scope.ctrlChat.switchChat(scope.chat.id, element[0]);
                });
                // TODO: change to set the actual current chat active
                if (scope.chat.id === scope.ctrlMessenger.currentChat) {
                    attrs.open = '';
                    // element[0].setAttribute('open', '');
                }
            }
        };
    });
    ngApp.directive('appToolbar', function () {
        return {
            restrict: 'E',
            templateUrl: '/parts/common/app_toolbar.html',
            controller: function ($scope) {
                nav_drawer_icon.addEventListener('click', function () {
                    $scope.ctrlNavDrawer.toggleNavDrawer();
                });
            },
            controllerAs: 'ctrlAppToolbar'
        };
    });
    ngApp.directive('toolbarMenuItem', function () {
        return {
            restrict: 'E',
            templateUrl: '/parts/common/toolbar_menu_item.html'
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

    ngApp.directive('rightSidebar', function () {
        return {
            restrict: 'E',
            templateUrl: '/parts/common/right_sidebar.html',
            controller: function ($scope) {
                this.user = $scope.ctrlMessenger.chats[$scope.ctrlMessenger.currentChat];
            },
            controllerAs: 'ctrlRightSidebar'
        };
    });

    ngApp.directive('fab', function () {
        return {
            restrict: 'E',
            template: '<button id=\'FAB\' class=\'material light floating\'><i style="position: relative; left: -1px; top: 3px;" class="mdi mdi-chart-areaspline"></i></button>',
            // controller: function ($scope) {
            //     this.openPopup
            // },
            controllerAs: 'ctrlFAB'
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
})();
