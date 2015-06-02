var todoApp = angular.module("todo", []);

function todoController($scope, todo) {
    $scope.todos = [];
    function getAll() {
        var promised = todo.getTodos();
        promised.then(function (data) {
            $scope.todos = data;
        });
    }

    $scope.addTodo = function () {
        var promised = todo.addTodo({
            Description: $scope.todoDescriptionAdd,
                Complete: false
            });
        promised.finally(function () {
            getAll();
        });
    }

    if ($scope.todos.length === 0)
        getAll();
}
todoController.$inject = ["$scope", "todo"];

function todoService($http, $q) {
    this.getTodos = function() {
        var deferred = $q.defer();
        $http({
            method: "GET",
            url: "/api/todo/getall"
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function() {
            deferred.reject("error getting all todos.");
        });
        return deferred.promise;
    }
    this.addTodo = function(todo) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: "/api/todo/add",
            data: todo
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function() {
            deferred.reject("could not add");
        });
        return deferred.promise;
    }
}

todoService.$inject = ["$http", "$q"];
todoApp.controller("todoController", todoController);
todoApp.service("todo", todoService);