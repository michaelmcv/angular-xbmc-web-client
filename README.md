angular-xbmc-web-client
=======================

This repo is primarily an exercise is skilling up with the angularjs and bootstrap frameworks.

The  developed application can be used to browse and view photographs
accessible from an pre-configured XBMC (xbox media centre) service.

The current incaration of the application will only work against an XBMC service
that is serving media content via an NFS network service (may look at extending this in the future)

angularjs is used in conjunction with Restangular to make RESTful data requests against the http enabled XBMC service, to determine the photo gallery
folder structure and image files that the XBMC service is serving. This data is rendered on a simple js frontend (powered by node.js)
with a basic UX that allows the XBMC's backend folder structure to be browsed and any image files contained within the current folder context displayed
as a simple click through gallery (next / previous functionality only - searching not enabled yet)

The app has been extended to offer similar functionality to provide direct download urls for video files on the NFS back-end as well. Backend Video gallery
can be browsed and any video files in the current directory context are displayed as a list of links.
These links can then be manually streamed over the wire, e.g. using VLC open network functionality to watch.

Tested against raspbmc OS powered by raspberry pi B device running XBMC version 12 (version to be verified)

Further detail will be added as the application evolves (not quite sure what the end-product will be)
