String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
};

function generate_csv (columns, data) {
    data.unshift(columns);

    var out = '';
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            out += data[i][j] + (j + 1 === data[i].length ? '' : ',');
        }
        out += '\n';
    }

    return out.replaceAll('undefined', ' ');
}

function s2ab (s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}

(function () {
    ngApp.factory('ReportsModel', ['$resource', 'PokiTimeModel', function ($resource, PokiTimeModel) {
        var ReportsResource = $resource('/api/reports/', {userId: '@userID', time_start: '@time_in', time_stop: '@time_out'}, {isArray: true});

        var factory = {};
        factory.date_from = new Date();
        factory.date_from.setUTCDate(1);
        factory.date_from.setUTCHours(0, 0, 0, 0);
        factory.date_to = new Date();
        factory.generatedReport = [];
        factory.generateReport = function (employees, time_in, time_out) {
            ReportsResource.query({userID: employees, time_start: time_in.getTime() / 1000, time_stop: time_out.getTime() / 1000}, function (generatedReport) {
                factory.generatedReport = generatedReport;
                // TODO: figure out why the line above isn't enough to make the databind update
                // angular.element(document.getElementsByTagName('html')[0]).scope().$$childHead.ctrlPokiTime.generatedReport = factory.generatedReport;

                var payShare = [['Employee', 'Pay ($)']];
                for (var i in generatedReport) {
                    var pay = 0;
                    for (var j in generatedReport[i].shifts) {
                        pay += generatedReport[i].shifts[j].pay;
                    }
                    payShare.push([generatedReport[i].first_name + ' ' + generatedReport[i].last_name, Math.round(pay * 100) / 100]);
                }
                var payShareData = google.visualization.arrayToDataTable(payShare);
                var payShareChartElement = document.getElementById('pay_share');
                payShareChartElement.innerHTML = '';
                var payShareChart = new google.visualization.PieChart(payShareChartElement);
                payShareChart.draw(payShareData, {pieHole: 0.4});

                var timeShare = [['Employee', 'Time (Hours)']];
                for (var i in generatedReport) {
                    var time = 0;
                    for (var j in generatedReport[i].shifts) {
                        time += generatedReport[i].shifts[j].duration;
                    }
                    timeShare.push([generatedReport[i].first_name + ' ' + generatedReport[i].last_name, Math.round(time * 100) / 100]);
                }
                var timeShareData = google.visualization.arrayToDataTable(timeShare);
                var timeShareChartElement = document.getElementById('time_share');
                timeShareChartElement.innerHTML = '';
                var timeShareChart = new google.visualization.PieChart(timeShareChartElement);
                timeShareChart.draw(timeShareData, {pieHole: 0.4});
            });
        };
        factory.exportXLS = function () {
            var columns = ['Last Name', 'First Name', 'Position', 'Location'];
            var data = [];
            for (var i = 0; i < factory.generatedReport.length; i++) {
                data.push([factory.generatedReport[i].last_name, factory.generatedReport[i].first_name, PokiTimeModel.positionsDict[factory.generatedReport[i].position].title, factory.generatedReport[i].location]);
                factory.generatedReport[i].totalHours = 0;
                factory.generatedReport[i].totalPay = 0;
                for (var j = 0; j < factory.generatedReport[i].shifts.length; j++) {
                    var index = columns.indexOf(factory.generatedReport[i].shifts[j].date.split(',')[0]);
                    if (index === -1) {
                        // TODO: dates are very likely to be out of order. We need to sort them.
                        columns.splice(columns.length, 0, factory.generatedReport[i].shifts[j].date.split(',')[0]);
                        index = columns.length - 1;
                    }
                    var roundedDuration = Math.round(factory.generatedReport[i].shifts[j].duration * 100) / 100;
                    if (data[i][index] === undefined) {
                        data[i].splice(index, 0, roundedDuration);
                    } else {
                        data[i][index] += roundedDuration;
                    }
                    console.log(typeof factory.generatedReport[i].shifts[j].duration);
                    factory.generatedReport[i].totalHours += factory.generatedReport[i].shifts[j].duration;
                    factory.generatedReport[i].totalPay += factory.generatedReport[i].shifts[j].pay;
                }
                // factory.generatedReport[i].hourlyRate += ;
            }
            columns.push('Total Hours');
            for (var i = 0; i < factory.generatedReport.length; i++) {
                data[i][columns.length - 1] = Math.round(factory.generatedReport[i].totalHours * 100) / 100;
            }
            columns.push('Hourly Pay');
            for (var i = 0; i < factory.generatedReport.length; i++) {
                data[i][columns.length - 1] = '$' + factory.generatedReport[i].hourly_rate;
            }
            columns.push('Total Pay');
            for (var i = 0; i < factory.generatedReport.length; i++) {
                var roundedPay = Math.round(factory.generatedReport[i].totalPay * 100) / 100;
                data[i][columns.length - 1] = '$' + roundedPay;
            }

            var outputFile = generate_csv(columns, data);
            saveAs(new Blob([s2ab(outputFile)], {type: 'application/octet-stream'}), 'report.csv');
        };
        return factory;
    }]);
    ngApp.factory('PokiTimeModel', ['$resource', function ($resource) {
        var EmployeesResource = $resource('/api/user/', {}, {isArray: false});
        var AddEmployeeResource = $resource('/api/user/', {first_name: '@first_name', last_name: '@last_name', position: '@position', location: '@location', hourly_rate: '@hourly_rate'}, {isArray: false});
        var EditEmployeeResource = $resource('/api/user/', {userID: '@userID', update: '@update'}, {isArray: false, update: {method: 'PUT'}});
        var PositionsResource = $resource('/api/position/', {}, {isArray: false});
        var AddPositionsResource = $resource('/api/position/', {title: '@title'}, {isArray: false});
        var LocationsResource = $resource('/api/locations/', {}, {isArray: false});
        // var AddLocationsResource = $resource('/api/locations/', {address: '@address', city: '@city', state: '@state', zip_code: '@zip_code'}, {isArray: false});

        var factory = {};
        factory.positionsDict = [];
        factory.positions = PositionsResource.query({}, function (positions) {
            for (var i = 0; i < positions.length; i++) {
                factory.positionsDict[positions[i]._id] = positions[i];
            }
        });
        factory.employeesDict = [];
        factory.employees = EmployeesResource.query({}, function (employees) {
            for (var i = 0; i < employees.length; i++) {
                factory.employeesDict[employees[i]._id] = employees[i];
            }
        });
        factory.locationsDict = [];
        factory.locations = LocationsResource.query({}, function (locations) {
            for (var i = 0; i < locations.length; i++) {
                factory.locationsDict[locations[i]._id] = locations[i];
            }
        });
        factory.addUser = function (user, callback) {
            var userPost = {
                first_name: user.first_name,
                last_name: user.last_name,
                position: user.position,
                location: user.location,
                hourly_rate: user.hourly_rate,
                street: user.address.street,
                city: user.address.city,
                state: user.address.state,
                zip_code: user.address.zip_code,
                phone: user.phone
            };
            AddEmployeeResource.save(userPost, function (res) {
                var userID = '';
                for (var i in res) {
                    if (typeof res[i] === 'string') {
                        userID += res[i].toString();
                    }
                }
                var err;
                if (userID !== 'invalid position' && userID !== 'invalid location' && userID !== 'hourly pay too low') {
                    user._id = userID;
                    factory.employees.push(user);
                    factory.employeesDict[user._id] = user;
                } else {
                    err = {location: userID, position: userID, hourly_rate: userID};
                }
                callback(err);
            });
        };
        factory.editUser = function (userID, update, callback) {
            var userPost = {
                userID: userID,
                update: update
            };
            console.log(userPost.userID);
            EditEmployeeResource.update(userPost, function (res) {
                console.log(res);
                var response = '';
                for (var i in res) {
                    if (typeof res[i] === 'string') {
                        response += res[i].toString();
                    }
                }
                var err;
                if (response !== 'invalid position' && response !== 'invalid location' && response !== 'hourly pay too low') {
                    // TODO: update the client's version of the employee
                    userID = response;
                } else {
                    err = {location: response, position: response, hourly_rate: response};
                }
                callback(err);
            });
        };
        factory.addPosition = function (position, callback) {
            AddPositionsResource.save({title: position.title}, function (res) {
                var positionID = '';
                for (var i in res) {
                    if (typeof res[i] === 'string') {
                        positionID += res[i].toString();
                    }
                }
                var err;
                if (positionID !== 'invalid position') {
                    position._id = positionID;
                    factory.positions.push(position);
                    factory.positionsDict[position._id] = position;
                } else {
                    err = {position: positionID};
                }
                callback(err);
            });
        };
        return factory;
    }]);
})();
