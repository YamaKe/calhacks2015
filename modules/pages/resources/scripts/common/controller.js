var googleChartsReady = false;
google.load('visualization', '1', {packages: ['corechart']});
google.setOnLoadCallback(function () {
    googleChartsReady = true;
});

var ngApp;
(function () {
    ngApp = angular.module('PokiTime', ['ngResource', 'ngSanitize', 'ngMaterial', 'ngMessages']);
})();
