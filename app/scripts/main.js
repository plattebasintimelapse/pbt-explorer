'use strict';

var map;
var oms;
var ib = new InfoBox();
var bounds;

// array of Google Markers
var tlMarkers = [];
var storyMarkers = [];
var pictureMarkers = [];

// array of Javascript objects to build Google Markers, created from JSON HTTP requests to Google doc
var longtermTLLocations = [];
var storyLocations = [];



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
    
    bounds = new google.maps.LatLngBounds();

    getContent();
//    setPictureMarkers(map, pictureLocations);
    
    var infowindow = new google.maps.InfoWindow({
        content: "Loading..."

    });
    
} //end initialize

function getContent() {
    $.getJSON("https://spreadsheets.google.com/feeds/list/1XZx5wnIEaFy7sJ85KI4cJOPrgx4o87ZilsDxp9VNfhs/od6/public/values?alt=json", function(data) {
        for (var i = 0; i < data.feed.entry.length; i++) {
            var tempLocation = {location: data.feed.entry[i]['gsx$title']['$t'], description: data.feed.entry[i]['gsx$description']['$t'], long: Number(data.feed.entry[i]['gsx$long']['$t']), lat: Number(data.feed.entry[i]['gsx$lat']['$t']), vimeoURL: data.feed.entry[i]['gsx$vimeoid']['$t'], phocalstreamID: data.feed.entry[i]['gsx$phocalstreamid']['$t']};
            
            longtermTLLocations.push(tempLocation);

        }
        setTLMarkers(map, longtermTLLocations);
//        createClusters();
    });
    
    $.getJSON("https://spreadsheets.google.com/feeds/list/1DzzJ15l2V-t4milyvF3j4KIqTM0GiuqVZ3h4vg9mnaw/od6/public/values?alt=json", function(data) {
        for (var i = 0; i < data.feed.entry.length; i++) {
            var tempLocation = {location: data.feed.entry[i]['gsx$title']['$t'], description: data.feed.entry[i]['gsx$description']['$t'], long: Number(data.feed.entry[i]['gsx$long']['$t']), lat: Number(data.feed.entry[i]['gsx$lat']['$t']), vimeoURL: data.feed.entry[i]['gsx$vimeoid']['$t']};
            
            storyLocations.push(tempLocation);

        }
//        setStoryMarkers(map, storyLocations);
        
    });    
}

function createTLMarker(longtermTLLocation, map) {
    
    // Content for InfoBox
    var iFrameContentForInfoBox = '<iframe class="timelapse-video" src="http://player.vimeo.com/video/' + longtermTLLocation.vimeoURL + '"frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    var phocalstreamAccessTag = 'EXPLORE ALL IMAGES';                                             //The text a user clicks on to access Phocalstream images
    var phocalstreamBaseURL = 'http://images.plattebasintimelapse.com/photo/cameracollection?siteId=';     //The base url for phocalstreamAccessTag anchor tag
    
    var circle ={
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#f45555',
        fillOpacity: .8,
        scale: 8,
        strokeColor: '#f45555',
        strokeWeight: 1
    };
    var latlong = new google.maps.LatLng(longtermTLLocation.long, longtermTLLocation.lat)
    var marker = new google.maps.Marker({
        position: latlong,
        map: map,
        icon: circle,
        title: longtermTLLocation.location,
        html: '<h2 class="center">' + longtermTLLocation.location + '</h2>' + '<div class="timelapse-video-container">' + iFrameContentForInfoBox + '</div>' + '<p>' + longtermTLLocation.description + '</p>' 
//        + '<div class="phocalstream-link"><a class="center" target="_blank" href="' + phocalstreamBaseURL + longtermTLLocation.phocalstreamID + '">' + phocalstreamAccessTag + '</a></div>'
    });
    
    bounds.extend(latlong);
    
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

function createPictureMarker(pictureLocation, map) {

    // Content for InfoBox
    var tempFillText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pellentesque dictum ligula, non vehicula sem ultricies nec. Phasellus luctus augue in pretium tempus.';
    
    var circle ={
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#f45555',
        fillOpacity: .8,
        scale: 4,
        strokeColor: '#f45555',
        strokeWeight: 1
    };
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(pictureLocation.long, pictureLocation.lat),
        map: map,
        icon: circle,
        title: pictureLocation.location,
        html: '<h2>' + pictureLocation.location + '</h2>' + '<img src=images/uploads/' + pictureLocation.image + ' /> <p>' + tempFillText + '</p>'
    });
    
    pictureMarkers.push(marker);

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
    
}//end createPictureMarker

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

function setPictureMarkers(map,markers) {
    for (var i = 0; i < markers.length; i++) {
        createPictureMarker(markers[i],map);   
    }
}

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
    $('#btn-pictures').parent().addClass('active');
    $('#btn-stories').parent().addClass('active');
    $('#btn-timelapse').change(function() {
        toggleMarkers(tlMarkers);
    });
    $('#btn-pictures').change(function() {
        toggleMarkers(pictureMarkers);
    });
    $('#btn-stories').change(function() {
        toggleMarkers(storyMarkers);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
    map.fitBounds(bounds);
});

$(window).load(function () {
//    introPrompt();
//    setTimeout(function() {zoomMap(6);}, 500);
//    watchLegendChange();
//    legend.hover(slideOut, slideIn);
});

$(document).ready(function () {
    
    
});

