
/*global angular: true, appInsights: true */
(function () {
    "use strict";

    angular.module('angular-appinsights', [])

        .provider('insights', function () {

            var _appId,
                _appName;

            this.start = function (appId, appName) {

                _appId = appId;
                _appName = appName || '(Application Root)';

                if (appInsights && appId && appInsights.start) {
                    appInsights.start(appId);
                } 
                if (appInsights && appId && !appInsights.start)
                {
                    appInsights=appInsights({ instrumentationKey: appId });
                }

            };

            function Insights () {

                var _logEvent = function (event, properties, property) {
                    
                    if (appInsights && _appId && appInsights.logEvent) {
                        appInsights.logEvent(event, properties, property);
                    } 
                    if (appInsights && _appId && appInsights.trackEvent){
                        appInsights.trackEvent(event, properties, property);
                    }

                },

                _logPageView = function (page) {
                    
                    if (appInsights && _appId && appInsights.logPageView) {
                        appInsights.logPageView(page);
                    }
                    if (appInsights && _appId && appInsights.trackPageView) {
                        appInsights.trackPageView(page);
                    }

                };

                return {
                    'logEvent': _logEvent,
                    'logPageView': _logPageView,
                    'appName': _appName
                };

            }

            this.$get = function() {
                return new Insights();
            };

        })

        .run(['$rootScope', '$location', 'insights', function ($rootScope, $location, insights) {
            $rootScope.$on('$locationChangeSuccess', function() {
                var pagePath = '/';
                var matches;
                var tokenRegex = /\/oauthcallback\/access_token=(.*?)&/;
                try {
                    pagePath += $location.path().substr(1);
                    matches = tokenRegex.exec(pagePath);
                    if (matches !== null) {
                        pagePath = pagePath.replace(matches[1], 'TOKEN_REPLACED');
                    };
                 
                }
                finally {
                    insights.logPageView(pagePath);
                }
            });
        }]);

}());
