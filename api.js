(function() {

    var app = angular.module("githubViewer", []);

    var MainController = function($scope, github, $interval, $log, $anchorScroll, $location) {
        var onUserComplete = function(data) {
            $scope.user = data;
            github.getRepos($scope.user)
                .then(onRepos, onError);
        };

        var onRepos = function(data) {
            $scope.repos = data;
            $location.hash("userDetails");
            $anchorScroll();
        };

        var onError = function(reason) {
            $scope.error = "Could not load the data";
        };

        var decrementCountdown = function() {
            $scope.countdown -= 1;
            if ($scope.countdown < 1) {
                $scope.search($scope.username);
            }
        };

        $scope.search = function(username) {
            $log.info("Searching for " + username);
            github.getUser(username)
                .then(onUserComplete, onError);
            if (countDownInterval) {
                $interval.cancel(countDownInterval);
                $scope.countdown = null;
            }
        };

        var countDownInterval = null;

        var startCountdown = function() {
            countDownInterval = $interval(decrementCountdown, 1000, $scope.countdown);
        };

        $scope.username = "angular";

        $scope.repoSortOrder = "-stargazers_count";

        $scope.message = "Hello welcome to Github Viewer App";

        $scope.countdown = 10;

        startCountdown();
    };

    app.controller("MainController", ["$scope", "github", "$interval", "$log", "$anchorScroll", "$location", MainController]);
}());
