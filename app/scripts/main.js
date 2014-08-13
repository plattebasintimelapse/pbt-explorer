'use strict';

var map;
var oms;
var ib = new InfoBox();
var bounds;
var north_bounds;
var south_bounds;
var loups_bounds;
var central_bounds;
var lower_bounds;

// array of Google Markers
var tlMarkers = [];
var storyMarkers = [];
var stillMarkers = [];

// array of Javascript objects to build Google Markers, created from JSON HTTP requests to Google doc sreadsheet
var longtermTLLocations = [];
var storyLocations = [];
var stillLocations = [];


/**
 * Builds Google map, sets spidifier for markers, displays Platte Basin from Google Fushion table, 
 * sets marker bounds, calls getContent()
 */

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
        zoom: 7,
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
    
    var spiderfierOptions = {
        keepSpiderfied: true,
        legWeight: 1
    };
    oms = new OverlappingMarkerSpiderfier(map, spiderfierOptions);

//     load in Platte Basin watershed map layer from Google Fushion Table
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
    
    //initizalize bounds
    bounds = new google.maps.LatLngBounds();
    north_bounds = new google.maps.LatLngBounds();
    south_bounds = new google.maps.LatLngBounds();
    loups_bounds = new google.maps.LatLngBounds();
    central_bounds = new google.maps.LatLngBounds();
    lower_bounds = new google.maps.LatLngBounds();

    getContent();
    
    var infowindow = new google.maps.InfoWindow({
        content: "Loading..."

        
    });
    
} //end initialize


/**
 * Uses getJSON method to call google docs spreadsheet for each content type, pushes to Javascript Object array,
 * and calls set___Markers() method
 */
function getContent() {
    
    // TL Content
    $.getJSON("https://spreadsheets.google.com/feeds/list/1XZx5wnIEaFy7sJ85KI4cJOPrgx4o87ZilsDxp9VNfhs/od6/public/values?alt=json", function(data) {
        for (var i = 0; i < data.feed.entry.length; i++) {
            var tempLocation = {location: data.feed.entry[i]['gsx$title']['$t'], description: data.feed.entry[i]['gsx$description']['$t'], lat: Number(data.feed.entry[i]['gsx$lat']['$t']), long: Number(data.feed.entry[i]['gsx$long']['$t']), sub_basin: data.feed.entry[i]['gsx$basin']['$t'], vimeoURL: data.feed.entry[i]['gsx$vimeoid']['$t'], phocalstreamID: data.feed.entry[i]['gsx$phocalstreamid']['$t']};
            
            longtermTLLocations.push(tempLocation);

        }
        setTLMarkers(map, longtermTLLocations);
    });
    
    // Still Content
    $.getJSON("https://spreadsheets.google.com/feeds/list/1Ko2Fnm2hLN-B_BpTkza-Mmp5X3c1aDBbwusvTpwo5Hc/od6/public/values?alt=json", function(data) {
        for (var i = 0; i < data.feed.entry.length; i++) {
            var tempLocation = {location: data.feed.entry[i]['gsx$title']['$t'], description: data.feed.entry[i]['gsx$description']['$t'], lat: Number(data.feed.entry[i]['gsx$lat']['$t']), long: Number(data.feed.entry[i]['gsx$long']['$t']), sub_basin: data.feed.entry[i]['gsx$basin']['$t'], picSource: data.feed.entry[i]['gsx$source']['$t']};
            
            stillLocations.push(tempLocation);

        }
        setStillMarkers(map, stillLocations);
    });
    
//    $.getJSON("https://spreadsheets.google.com/feeds/list/1DzzJ15l2V-t4milyvF3j4KIqTM0GiuqVZ3h4vg9mnaw/od6/public/values?alt=json", function(data) {
//        for (var i = 0; i < data.feed.entry.length; i++) {
//            var tempLocation = {location: data.feed.entry[i]['gsx$title']['$t'], description: data.feed.entry[i]['gsx$description']['$t'], long: Number(data.feed.entry[i]['gsx$long']['$t']), lat: Number(data.feed.entry[i]['gsx$lat']['$t']), vimeoURL: data.feed.entry[i]['gsx$vimeoid']['$t']};
//            
//            storyLocations.push(tempLocation);
//
//        }
////        setStoryMarkers(map, storyLocations);
//        
//    });
    
} //end getContent

/**
 * Three Functions
 * Loops through Javascript Object array to create___Markers() method
 */

function setTLMarkers(map,markers) {
    for (var i = 0; i < markers.length; i++) {
        createTLMarker(markers[i],map);
    }
}

function setStoryMarkers(map,markers) {
    for (var i = 0; i < markers.length; i++) {
        createStoryMarker(markers[i],map);   
    }
}

function setStillMarkers(map,markers) {
    for (var i = 0; i < markers.length; i++) {
        createStillMarker(markers[i],map);
    }
}

/**
 * Three Functions
 * Creates Google Markers with InfoBox to display content, adds to region marker bounds, adds to spidifier feature,
 * pushes to marker array for later manipulation, and sets event listeners
 */
function createTLMarker(longtermTLLocation, map) {
    
    // Content for InfoBox
    var iFrameContentForInfoBox = '<iframe class="timelapse-video" src="http://player.vimeo.com/video/' + longtermTLLocation.vimeoURL + '"frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    var phocalstreamAccessTag = 'EXPLORE ALL IMAGES';                                             //The text a user clicks on to access Phocalstream images
    var phocalstreamBaseURL = 'http://images.plattebasintimelapse.com/photo/cameracollection?siteId=';     //The base url for phocalstreamAccessTag anchor tag
    
    var circle ={
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#6aaac3',
        fillOpacity: .8,
        scale: 8,
        strokeColor: 'rgba(106, 170, 195, 0.8)',
        strokeWeight: 1
    };
    var latlong = new google.maps.LatLng(longtermTLLocation.lat, longtermTLLocation.long);
    var marker = new google.maps.Marker({
        position: latlong,
        map: map,
        icon: circle,
        title: longtermTLLocation.location,
        html: '<h2 class="center">' + longtermTLLocation.location + '</h2>' + '<div class="timelapse-video-container">' + iFrameContentForInfoBox + '</div>' + '<p>' + longtermTLLocation.description + '</p>' 
//        + '<div class="phocalstream-link"><a class="center" target="_blank" href="' + phocalstreamBaseURL + longtermTLLocation.phocalstreamID + '">' + phocalstreamAccessTag + '</a></div>'
    });
    
    //add to whole basin bounds
    bounds.extend(latlong);
    
    //add to sub-basin bounds
    if (longtermTLLocation.sub_basin == "north") {
        north_bounds.extend(latlong);
    }
    if (longtermTLLocation.sub_basin == "south") {
        south_bounds.extend(latlong);
    }
    if (longtermTLLocation.sub_basin == "loups") {
        loups_bounds.extend(latlong);
    }
    if (longtermTLLocation.sub_basin == "central") {
        central_bounds.extend(latlong);
    }
    if (longtermTLLocation.sub_basin == "lower") {
        lower_bounds.extend(latlong);
    }
    
    oms.addMarker(marker);
    tlMarkers.push(marker);

    var boxText = document.createElement('div');
    boxText.className = 'info-window-inner tl-location map-box box-shadow';
    boxText.innerHTML = marker.html;

    var myOptions = {
        content: boxText,
        disableAutoPan: false,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(-300, 200),
        zIndex: null,
        closeBoxMargin: "15px;",
        closeBoxURL: "images/app/close.png",
        infoBoxClearance: new google.maps.Size(100, 100),
        isHidden: false,
        alignBottom: true,
        pane: "floatPane",
        enableEventPropagation: false
    };
    
    google.maps.event.addListener(marker, "click", function (e) {
        ib.close();
        ib.setOptions(myOptions);
        ib.open(map, marker);
        map.setCenter(marker.getPosition());
    });
    
    return marker;
    
} //end createTLMarker

function createStoryMarker(storyLocation, map) {

    // Content for InfoBox
    var iFrameContentForInfoBox = '<iframe class="timelapse-video" src="http://player.vimeo.com/video/' + storyLocation.vimeoURL + '"frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    
    var circle ={
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#f45555',
        fillOpacity: .8,
        scale: 8,
        strokeColor: '#f45555',
        strokeWeight: 1
    };
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(storyLocation.long, storyLocation.lat),
        map: map,
        icon: circle,
        title: storyLocation.location,
        html: '<h2>' + storyLocation.location + '</h2>' + '<div class="video-container">' + iFrameContentForInfoBox + '</div>' + '<p>' + storyLocation.description + '</p>' 
    });
    
    storyMarkers.push(marker);

    var boxText = document.createElement('div');
    boxText.className = 'info-window-inner story-location map-box box-shadow';
    boxText.innerHTML = marker.html;

    var myOptions = {
        content: boxText,
        disableAutoPan: false,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(-300, 200),
        zIndex: null,
        closeBoxMargin: "15px;",
        closeBoxURL: "images/app/close.png",
        infoBoxClearance: new google.maps.Size(150, 150),
        isHidden: false,
        alignBottom: true,
        pane: "floatPane",
        enableEventPropagation: false
    };

    google.maps.event.addListener(marker, "click", function (e) {
        ib.close();
        ib.setOptions(myOptions);
        ib.open(map, this);
        
//        map.setCenter(marker.getPosition());
    });
    
    return marker;
    
} //end createStoryMarker

function createStillMarker(stillLocation, map) {
    
    var circle ={
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#f45555',
        fillOpacity: .8,
        scale: 3,
        strokeColor: '#f45555',
        strokeWeight: 1
    };
    var latlong = new google.maps.LatLng(stillLocation.lat, stillLocation.long);
    var marker = new google.maps.Marker({
        position: latlong,
        map: map,
        icon: circle,
        title: stillLocation.location,
        html: '<h2>' + stillLocation.location + '</h2>' + '<img src=' + stillLocation.picSource + ' /> <p>' + stillLocation.description + '</p>'
    });
    
    stillMarkers.push(marker);

    var boxText = document.createElement('div');
    boxText.className = 'info-window-inner story-location map-box box-shadow';
    boxText.innerHTML = marker.html;

    var myOptions = {
        content: boxText,
        disableAutoPan: false,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(-300, 200),
        zIndex: null,
        closeBoxMargin: "15px;",
        closeBoxURL: "images/app/close.png",
        infoBoxClearance: new google.maps.Size(100, 100),
        isHidden: false,
        alignBottom: true,
        pane: "floatPane",
        enableEventPropagation: false
    };

    google.maps.event.addListener(marker, "click", function (e) {
        ib.close();
        ib.setOptions(myOptions);
        ib.open(map, this);
        
//        map.setCenter(marker.getPosition());
    });
    
    return marker;
    
}//end createStillMarker

var intro = $('#intro');
var side_legend = $('#legend');
var bottom_legend = $('#location-select');

function removeOverlay(){
    $('#overlay').fadeOut(1000);
    setTimeout(function() {
        $('#overlay').remove();
    }, 500);
}

function introPrompt() {
    intro.animate({'top':'45%'},500, 'swing');
    $('<div/>').attr({'id' : 'overlay'}).appendTo('body').fadeIn(1000);

    //on close
    $('#intro-close').click(function(){
        removeOverlay();
        intro.animate({'top':'140%'},500, 'swing').fadeOut(500);

        setTimeout(function() {intro.remove();}, 1000);
        setTimeout(function() {side_legend.animate({'right':'15px'},500, 'swing');}, 500);
        setTimeout(function() {bottom_legend.animate({'bottom':'0'},1000, 'swing');}, 500);
        setTimeout(function() {$('header').animate({'top':'0'},500, 'swing');}, 500);
    });
}

function toggleMarkers(m) {
    for (var i = 0; i < m.length; i++) {
        if(m[i].getVisible()) {
          m[i].setVisible(false); 
        }else {
          m[i].setVisible(true); 
        }
    }
}

function watchLegendChange() {
    $('#btn-timelapse').parent().addClass('active');
    $('#btn-stills').parent().addClass('active');
//    $('#btn-stories').parent().addClass('active');
    $('#btn-timelapse').change(function() {
        toggleMarkers(tlMarkers);
    });
    $('#btn-stills').change(function() {
        toggleMarkers(stillMarkers);
    });
    $('#btn-stories').change(function() {
        toggleMarkers(storyMarkers);
    });
    
    $('#btn-all').click(function() {
        map.fitBounds(bounds);
    });
    $('#btn-northplatte').click(function() {
        map.fitBounds(north_bounds);
    });
    $('#btn-southplatte').click(function() {
        map.fitBounds(south_bounds);
    });
    $('#btn-theloups').click(function() {
        map.fitBounds(loups_bounds);
    });
    $('#btn-centralplatte').click(function() {
        map.fitBounds(central_bounds);
    });
    $('#btn-lowerplatte').click(function() {
        map.fitBounds(lower_bounds);
    });
}

google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
    map.fitBounds(bounds);

    if ($( window ).width() <= 767 && s) {
        $('<div/>').attr({'id' : 'overlay'}).appendTo('body').fadeIn(1000);
        s = false;
    }
});
var s = true;

$(window).load(function () {
    if ($( window ).width() > 767) {
        initialize();
        introPrompt();
        watchLegendChange();
    }
});

$(document).ready(function () {
});
