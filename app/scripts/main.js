'use strict';

var map;
var marker;
var markers = [];

var phocalstreamAccessTag = 'EXPLORE ALL IMAGES';                                             //The text a user clicks on to access Phocalstream images
var phocalstreamBaseURL = 'http://raikes-rogue20.unl.edu/photo/cameracollection?siteId=';     //The base url for phocalstreamAccessTag anchor tag

var longtermTLLocations = [
        {location: 'Lake Agnes', long: 40.48428, lat: -105.90150, vimeoURL: '76900788', phocalstreamID: '1'},
        {location: 'Jack Creek', long: 40.42360, lat: -105.99740, vimeoURL: '59031251', phocalstreamID: '1'},
        {location: 'Jack Creek Meadow', long: 40.41064, lat: -105.98822, vimeoURL: '64274036', phocalstreamID: '1'},
        {location: 'Seminoe Dam', long: 42.1575, lat: -106.91056, vimeoURL: '44892995', phocalstreamID: '1'},
        {location: 'Kortes Dam', long: 42.17833, lat: -106.87611, vimeoURL: '44765944', phocalstreamID: '1'},
        {location: 'Pathfinder Spillway', long: 42.46833, lat: -106.85306, vimeoURL: '82335842', phocalstreamID: '1'},
        {location: 'Whalen Diversion Dam', long: 42.24812, lat: -104.62852, vimeoURL: '76971563', phocalstreamID: '1'},
        {location: 'State Line Gauge', long: 41.98858, lat: -104.05324, vimeoURL: '74154026', phocalstreamID: '1'},
        {location: 'Lake McConaughy', long: 41.21012, lat: -101.67012, vimeoURL: '73726644', phocalstreamID: '1'},
        {location: 'Phantom Canyon', long: 40.86485, lat: -105.32281, vimeoURL: '71046048', phocalstreamID: '1'},
        {location: 'Rocky Flats Pond', long: 39.90115, lat: -105.21411, vimeoURL: '74145722', phocalstreamID: '1'},
        {location: 'Denver Golf Course', long: 39.81750, lat: -105.17639, vimeoURL: '64274036', phocalstreamID: '1'},
        {location: 'Wildcat Hills', long: 41.72609, lat: -103.86941, vimeoURL: '', phocalstreamID: '1'},
        {location: 'Near Plum Creek', long: 40.67850, lat: -99.55507, vimeoURL: '39767560', phocalstreamID: '1'},
        {location: 'Near Elm Creek', long: 40.68492, lat: -99.36324, vimeoURL: '74940264', phocalstreamID: '1'},
        {location: 'Derr Restoration', long: 40.74102, lat: -98.57278, vimeoURL: '42731916', phocalstreamID: '1'},
        {location: 'Buffalo Co. Cropfield', long: 40.66442, lat: -98.89974, vimeoURL: '42730337', phocalstreamID: '1'},
        {location: 'Mormon Island', long: 40.79960, lat: -98.41710, vimeoURL: '83797473', phocalstreamID: '1'},
        {location: 'Sandhills Windmill', long: 42.0789, lat: -101.3736, vimeoURL: '83797473', phocalstreamID: '1'},
        {location: 'Latta Lake', long: 41.96630, lat: -99.25030, vimeoURL: '64274036', phocalstreamID: '1'},
        {location: 'Little Salt Creek', long: 40.904346, lat: -96.68243, vimeoURL: '64274036', phocalstreamID: '1'},
        {location: 'Mahoney State Park', long: 41.03410, lat: -96.31510, vimeoURL: '74464568', phocalstreamID: '1'},
        {location: 'Missouri Confluence', long: 41.05130, lat: -95.88140, vimeoURL: '75594834', phocalstreamID: '1'}
    ];

var pictureLocations = [
        {location: 'Lake Agnes', long: 40.48428, lat: -104.90150, image: 'canyon.jpg'},
        {location: 'Jack Creek', long: 42.42360, lat: -106.99740, image: 'whalen.jpg'}
    ];

function initialize() {
    var styles = [{"featureType": "water","stylers": [{ "color": "#446980"}, {"weight": 2}]
    }, {"featureType": "road","stylers": [{"visibility": "simplified"}]
    }, {"featureType": "road.highway","stylers": [{"visibility": "off"}, {"color": "#202909"}, {"weight": 0.8}]
    }, {"featureType": "road.highway","elementType": "labels","stylers": [{"visibility": "off"}]
    }, {"featureType": "poi","stylers": [{"visibility": "off"}]
    }, {"featureType": "administrative","stylers": [{"visibility": "on"}]
    }, {"featureType": "water","elementType": "labels","stylers": [{"visibility": "off"}]
    }, {}, {"featureType": "road","elementType": "labels","stylers": [{"visibility": "off"}]
    }, {"featureType": "transit","stylers": [{"visibility": "off"}]
    }];
    var styledMap = new google.maps.StyledMapType(styles, {
        name: "Styled Map"
    });

    var mapOptions = {
        zoom: 5,
        maxZoom: 13,
        minZoom: 5,
        center: new google.maps.LatLng(41.643387, -101.612224),
        mapTypeControl: false,
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: false,
        streetViewControl: false
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    // load in Platte Basin watershed map layer from Google Fushion Table
    var platteBasinLayer = new google.maps.FusionTablesLayer({
        map: map,
        suppressInfoWindows: true,
        query: {
            select: "col2",
            from: "1JvJgh-o4GfNRLKAreWD9UiFJa5N0rqpS_Wq3xSNf",
            where: "col1 \x3d \x27Streams\x27"
        },
        options: {
            styleId: 2,
            templateId: 2
        }
    });
    platteBasinLayer.setMap(map);

    // load in Google Maps cloud layer
    var cloudLayer = new google.maps.weather.CloudLayer();
    cloudLayer.setMap(map);

    var infowindow = new google.maps.InfoWindow({zIndex: 100});

    google.maps.event.addListener(infowindow, 'domready', function() {
        $('.info-window-inner').parent().parent().siblings().addClass('info-window');
    });

    for (var i = 0; i < longtermTLLocations.length; i++) {
        var circle ={
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#f45555',
            fillOpacity: .8,
            scale: 8,
            strokeColor: '#912424',
            strokeWeight: 1
        };
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(longtermTLLocations[i].long, longtermTLLocations[i].lat),
            map: map,
            icon: circle,
            title: longtermTLLocations[i].location,
            vimeo: longtermTLLocations[i].vimeoURL
        });

        markers.push(marker);

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                map.panTo(marker.position);

                if(!marker.vimeo){
                    infowindow.setContent(
                        '<h2>' + marker.title + '</h2>' +
                        '<p>I\'m sorry. There are no videos here.'
                    );
                }else{
                    infowindow.setContent(
                        '<div class="info-window-inner">' +
                        '<h2>' + marker.title + '</h2>' +
                        '<iframe src="http://player.vimeo.com/video/' + marker.vimeo +
                        '" width="600" height="400" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
                        '<h3><a target="_blank" href="' + phocalstreamBaseURL + longtermTLLocations[i].phocalstreamID + '">' + phocalstreamAccessTag + '</a></h3>' +
                        '</div>'
                    );
                }
                infowindow.open(map, marker);
            };
        })(marker, i));
    } //end for longterm timelapse loop

    for (i = 0; i < pictureLocations.length; i++) {
        var imageCircle ={
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#f45555',
            fillOpacity: '.8',
            scale: 4.5,
            strokeColor: '#696969',
            strokeWeight: 1
        };
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(pictureLocations[i].long, pictureLocations[i].lat),
            map: map,
            icon: imageCircle,
            title: pictureLocations[i].location
        });

        google.maps.event.addListener(marker, 'click', function() {
            $.fancybox({
                href: longtermTLLocations[i].vimeoURL,
                fitToView: true
            });
        });
    } //end for photo loop
}

google.maps.event.addDomListener(window, 'load', initialize);

//var mcOptions = {gridSize: 500, maxZoom: 8};
//var markerClusterer = new MarkerClusterer(map, markers, mcOptions);

function zoomMap() {
    map.setZoom(6);
}

var introDiv = $('#intro');
var legend = $('#legend');

function removeOverlay(){
    $('#overlay').fadeOut(1000);
    setTimeout(function() {
        $('#overlay').remove();
    }, 500);
}

function introPrompt() {
    introDiv.animate({'top':'45%'},500, 'swing');
    $('<div/>').attr({'id' : 'overlay'}).appendTo('body').fadeIn(1000);

    //on close
    $('#intro-close').click(function(){
        removeOverlay();
        introDiv.animate({'top':'140%'},500, 'swing').fadeOut(500);

        setTimeout(function() {introDiv.remove();}, 1000);
        setTimeout(function() {zoomMap(6);}, 500);

    });
}

function slideOut() {
    legend.animate({'right':'20px'},500, 'swing');
}

function slideIn() {
    legend.animate({'right':'-170px'},500, 'swing');
}

$(window).load(function () {
    introPrompt();
});

$(document).ready(function () {
    legend.hover(slideOut, slideIn);
});

