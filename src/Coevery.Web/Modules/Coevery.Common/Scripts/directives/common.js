angular.module('coevery.common', [])
    .directive("coDeleteButton", ['$compile', '$parse', function($compile, $parse) {
        return {
            restrict: "A",
            scope: { confirmMessage: '@confirmMessage', deleteAction: '@deleteAction' },
            link: function(scope, element, attrs) {
                var template = '<div class="modal hide fade">\
                          <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                            <h3>Delete Confirm</h3>\
                          </div>\
                          <div class="modal-body">\
                            <p>{{confirmMessage}}</p>\
                          </div>\
                          <div class="modal-footer">\
                            <button class="btn" data-dismiss="modal" aria-hidden="true">No</button>\
                            <button class="btn btn-primary" ng-click="delete()">Yes</button>\
                          </div>\
                    </div>';
                var modal = $(template);
                var link = $compile(modal);
                link(scope);

                element.on('click', showModal);

                function showModal() {
                    $(modal).modal({
                        backdrop: 'static',
                        keyboard: true
                    }).css({
                        "position": "fixed",
                        "top": "50% !important"
                    });
                }

                scope.delete = function(event) {
                    $(modal).modal('hide');
                    var fn = $parse('$parent.' + scope.deleteAction);
                    fn(scope, { $event: event });
                };
            }
        };
    }])
    .directive('helperText', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.attr('rel', 'popover');
                element.attr('data-html', 'true');
                element.attr('data-placement', 'top');
                element.attr('data-content', '<p class="popoverTipContent">' + attrs.helperText + '</p>');
                element.attr('original-title', '');
                var icon = document.createElement("i");
                icon.className = "icon-question-sign popoverTipIcon";
                icon.id = "popoverIcon";
                element.parents("div").first().get(0).appendChild(icon);
                $(icon).mouseover(function() {
                    element.popover('show');
                    element.focus();
                });

                $(icon).mouseout(function() {
                    element.popover('destroy');
                    element.blur();
                });
            }
        };
    })
    .directive('featureFilter', function() {
        return {
            restrict: "A",
            link: function(scope) {
                scope.$watch(function() {
                    return scope.featurename;
                }, function(newval) {
                    if (newval == undefined) return;
                    $("div.category:hidden").show();
                    $(".row-fluid > div").each(function(i, item) {
                        if ($(item).find(".title").text().toLowerCase().indexOf(newval.toLowerCase()) >= 0) {
                            $(item).show();
                        } else {
                            $(item).hide();
                        }
                    });
                    $("div.category:not(:has(.row-fluid > div:visible))").hide();
                });
            }
        };
    })
    .directive('featureSelector', function() {
        return {
            restrict: "A",
            link: function(scope, element) {
                var checkbox = element.find(":checkbox:first");
                checkbox.on('click', function(e) {
                    setcss();
                    e.stopPropagation();
                });
                element.on('click', function() {
                    checkbox.get(0).checked = !checkbox.get(0).checked;
                    setcss();
                });

                var setcss = function() {
                    if (checkbox.get(0).checked)
                        element.find("span:first").css("color", "rgba(255, 255, 0, 1);");
                    else {
                        element.find("span:first").css("color", "");
                    }
                };
            }
        };
    })
    .config(['$httpProvider', function($httpProvider) {
        var $http;
        $httpProvider.responseInterceptors.push(['$q', '$injector', function($q, $injector) {
            var rootScope;

            function success(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get $rootScope via $injector because of circular dependency problem
                    rootScope = rootScope || $injector.get('$rootScope');
                    // send a notification requests are complete
                    rootScope.$broadcast('_END_REQUEST_');
                }
                return response;
            }

            function error(response) {
                // get $http via $injector because of circular dependency problem
                $http = $http || $injector.get('$http');
                // don't send notification until all requests are complete
                if ($http.pendingRequests.length < 1) {
                    // get $rootScope via $injector because of circular dependency problem
                    rootScope = rootScope || $injector.get('$rootScope');
                    // send a notification requests are complete
                    rootScope.$broadcast('_END_REQUEST_');
                }
                return $q.reject(response);
            }

            return function(promise) {
                // get $rootScope via $injector because of circular dependency problem
                rootScope = rootScope || $injector.get('$rootScope');
                // send notification a request has started
                rootScope.$broadcast('_START_REQUEST_');
                return promise.then(success, error);
            };
        }]);
    }])
    .directive('loadingIndicator', function() {
        return {
            restrict: "A",
            link: function(scope, element) {
                // hide the element initially
                element.hide();

                scope.$on('_START_REQUEST_', function() {
                    // got the request start notification, show the element
                    element.show();
                });

                scope.$on('_END_REQUEST_', function() {
                    // got the request end notification, hide the element
                    element.hide();
                });
            }
        };
    })
    .directive('coDatetimePicker', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                if (attrs.coDatetimePicker == 'date') {
                    $(element).datetimepicker({ pickTime: false });
                } else {
                    $(element).datetimepicker({ pickDate: false });
                }
            }
        };
    });