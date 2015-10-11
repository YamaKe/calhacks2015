String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
};

(function () {
    ngApp.factory('HackathonsModel', ['$resource', function ($resource) {
        var HackathonsResource = $resource('/api/hackathon/', {ID: '@ID', lat: '@lat', lon: '@lon'}, {isArray: true});
        var DiscussionsResource = $resource('/api/discussion/', {hackathon_id: '@hackathon_id', limit: '@limit', sort: '@sort'}, {isArray: true});
        var UsersResource = $resource('/api/user/', {}, {isArray: false});
        var AddEmployeeResource = $resource('/api/user/', {first_name: '@first_name', last_name: '@last_name', position: '@position', location: '@location', hourly_rate: '@hourly_rate'}, {isArray: false});
        var EditEmployeeResource = $resource('/api/user/', {userID: '@userID', update: '@update'}, {isArray: false, update: {method: 'PUT'}});
        var PositionsResource = $resource('/api/position/', {}, {isArray: false});
        var AddPositionsResource = $resource('/api/position/', {title: '@title'}, {isArray: false});
        var LocationsResource = $resource('/api/locations/', {}, {isArray: false});
        // var AddLocationsResource = $resource('/api/locations/', {address: '@address', city: '@city', state: '@state', zip_code: '@zip_code'}, {isArray: false});

        var factory = {};
        factory.hackathonsDict = [];
        factory.hackathons = HackathonsResource.query({}, function (hackathons) {
            for (var i = 0; i < hackathons.length; i++) {
                var date = new Date(hackathons[i].time * 1000);
                hackathons[i].date = (date.getMonth() + 1) + '.' + date.getDate() + '.' + date.getFullYear();
                factory.hackathonsDict[hackathons[i]._id] = hackathons[i];
            }
        });
        factory.positionsDict = [];
        factory.positions = PositionsResource.query({}, function (positions) {
            for (var i = 0; i < positions.length; i++) {
                factory.positionsDict[positions[i]._id] = positions[i];
            }
        });
        factory.usersDict = [];
        factory.users = UsersResource.query({}, function (users) {
            for (var i = 0; i < users.length; i++) {
                factory.usersDict[users[i]._id] = users[i];
            }
        });
        factory.locationsDict = [];
        factory.locations = LocationsResource.query({}, function (locations) {
            for (var i = 0; i < locations.length; i++) {
                factory.locationsDict[locations[i]._id] = locations[i];
            }
        });
        factory.getDiscussions = function (query, callback) {
            DiscussionsResource.query(query, function (threads) {
                callback(threads);
            });
        };
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
