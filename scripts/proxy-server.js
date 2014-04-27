#!/usr/bin/env node

var http = require('http'),
    httpProxy = require('http-proxy');

//config
var MAIN_SERVICE_PORT = process.env.PROXY_PORT || 5050;
var PROXY_PORT = process.env.PORT  || 5000;
var BACKEND_XBMC_SERVICE_HOST = process.env.XBMC_HOST+'' || 'raspbmc.mmv.ie:3128';
//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = require('http').createServer(function(req, res) {

    console.log('current url is: ' + req.url)

    //proxy jsonrpc (api) and vfs (images) requests to backend xbmc insta
    if((req.url.indexOf('jsonrpc') != -1 )|| (req.url.indexOf('vfs') != -1 ))
    {
        console.log('attempting proxy to xbmc - manually setting remote header for transparent proxied request');
        req.headers.host = BACKEND_XBMC_SERVICE_HOST;
        proxy.web(req, res, { target: 'http://' + BACKEND_XBMC_SERVICE_HOST });
    }
    else
    {
        proxy.web(req, res, { target: 'http://localhost:' + MAIN_SERVICE_PORT });
    }
});

console.log("listening on port 5050")
server.listen(PROXY_PORT);