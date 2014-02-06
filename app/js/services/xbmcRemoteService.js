define([], function() {
    var xbmcRemoteService = function($restangular) {

        var xbmcJsonRequestTemplate = {
            request: {
                jsonrpc: "2.0",
                method: "Files.GetDirectory",
                params: {
                    directory: "",
                    id: 1
                }
            }
        };

        this.getXbmcMediaData = function(path, type) {
            if (!angular.isDefined(path)) {
                return null;
            }

            if (!angular.isDefined(type)) {
                return null;
            }

            //TODO surely it can be tidied up to this syntax??
            //set requested path into json template
            //xbmcJsonRequestTemplate.request.params.directory = path;

            //var inJson = angular.toJson(xbmcJsonRequestTemplate);
            //console.log(inJson);

            //need different request if we are getting a download link for xbmc
            var request = '';
            if(type == 'directory')
            {
                request = '{"jsonrpc": "2.0", "method": "Files.GetDirectory", "params": { "directory": "'+path+'"}, "id": 1}';
            }
            else
            {
                request = '{"jsonrpc": "2.0", "method": "Files.preparedownload", "params": { "path": "'+path+'" }, "id": 1}';
            }

            return $restangular.all('').customGETLIST('jsonrpc',{request: request});
        }

    }

    xbmcRemoteService.$inject = ['Restangular'];

    return xbmcRemoteService;
});