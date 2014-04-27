#!/usr/bin/env node

var http = require('http'),
    httpProxy = require('http-proxy');

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

    //create server specific configuration
    var PROXY_PORT = process.env.PROXY_PORT || 5050;
    var BACKEND_XBMC_SERVICE_HOST = process.env.XBMC_HOST || 'raspbmc.mmv.ie:3128';

    console.log('port configuration is PROXY_PORT [' + PROXY_PORT + '] BACKEND_XBMC_SERVICE_HOST [' + BACKEND_XBMC_SERVICE_HOST + ']')

    //proxy jsonrpc (api) and vfs (images) requests to backend xbmc instance
    if((req.url.indexOf('jsonrpc') != -1 )|| (req.url.indexOf('vfs') != -1 ))
    {

        console.log('attempting proxy to xbmc - manually setting remote header for transparent proxied request');
        req.headers.host = BACKEND_XBMC_SERVICE_HOST;
        proxy.web(req, res, { target: 'http://' + BACKEND_XBMC_SERVICE_HOST });
    }
    else
    {
        console.log('proxy to local node js service')
        proxy.web(req, res, { target: 'http://localhost:' + PROXY_PORT });
    }
});

//config
var MAIN_SERVICE_PORT = process.env.RANDOM_PORT  || 5000;

//print out the env variables (used on Heroku)
console.log(process.env)

console.log("should be listening on port [" + MAIN_SERVICE_PORT + ']')
server.listen(MAIN_SERVICE_PORT);