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

// App States
var INTRO = true;
var LOADED = false;


// Global jQuery objects
var $intro = $('#intro');
var $side_legend = $('#legend');
var $bottom_legend = $('#location-select');
var $loadingPrompt = $('#loading .map-box-wrapper');

// Keep running counts
var totalTLs;
var totalStills;
var totalStories;

/**
 * Uses getJSON method to call google docs spreadsheet for each content type, pushes to Javascript Object array,
 * and calls set___Markers() method
 */
function getContent() {
    var count = 0;

    // TL Content
    $.getJSON("https://spreadsheets.google.com/feeds/list/1XZx5wnIEaFy7sJ85KI4cJOPrgx4o87ZilsDxp9VNfhs/od6/public/values?alt=json", function(data) {
        for (var i = 0; i < data.feed.entry.length; i++) {
            var tempLocation = {
                location: data.feed.entry[i]['gsx$title']['$t'],
                description: data.feed.entry[i]['gsx$description']['$t'],
                lat: Number(data.feed.entry[i]['gsx$lat']['$t']),
                long: Number(data.feed.entry[i]['gsx$long']['$t']),
                sub_basin: data.feed.entry[i]['gsx$basin']['$t'],
                vimeoURL: data.feed.entry[i]['gsx$vimeoid']['$t'],
                phocalstreamID: data.feed.entry[i]['gsx$phocalstreamid']['$t'],
                themes: data.feed.entry[i]['gsx$themes']['$t']
            };

            createTLMarker(tempLocation,map);

        }

    }).done(function() {
        count = count+1;
        loadedCheck(count, $loadingPrompt, 'Timelapses');
    }).fail(function() {
        count = count+1;
        loadingError(count, $loadingPrompt, 'Timelapses');
    });

    // Still Content
    $.getJSON("https://spreadsheets.google.com/feeds/list/1Ko2Fnm2hLN-B_BpTkza-Mmp5X3c1aDBbwusvTpwo5Hc/od6/public/values?alt=json", function(data) {
        for (var i = 0; i < data.feed.entry.length; i++) {
            var tempLocation = {
                location: data.feed.entry[i]['gsx$title']['$t'],
                description: data.feed.entry[i]['gsx$description']['$t'],
                lat: Number(data.feed.entry[i]['gsx$lat']['$t']),
                long: Number(data.feed.entry[i]['gsx$long']['$t']),
                sub_basin: data.feed.entry[i]['gsx$basin']['$t'],
                picSource: data.feed.entry[i]['gsx$source']['$t'],
                themes: data.feed.entry[i]['gsx$themes']['$t']
            };

            createStillMarker(tempLocation,map);
        }

    }).done(function() {
        count = count+1;
        loadedCheck(count, $loadingPrompt, 'Stills');
    }).fail(function() {
        count = count+1;
        loadingError(count, $loadingPrompt, 'Stills');
    });

    // Story Content
    $.getJSON("https://spreadsheets.google.com/feeds/list/1DzzJ15l2V-t4milyvF3j4KIqTM0GiuqVZ3h4vg9mnaw/od6/public/values?alt=json", function(data) {
        for (var i = 0; i < data.feed.entry.length; i++) {
            var tempLocation = {
                title: data.feed.entry[i]['gsx$title']['$t'],
                description: data.feed.entry[i]['gsx$description']['$t'],
                lat: Number(data.feed.entry[i]['gsx$lat']['$t']),
                long: Number(data.feed.entry[i]['gsx$long']['$t']),
                sub_basin: data.feed.entry[i]['gsx$basin']['$t'],
                link: data.feed.entry[i]['gsx$link']['$t'],
                themes: data.feed.entry[i]['gsx$themes']['$t']
            };

            createStoryMarker(tempLocation,map);

        }

    }).done(function() {
        count = count+1;
        loadedCheck(count, $loadingPrompt, 'Stories');
    }).fail(function() {
        count = count+1;
        loadingError(count, $loadingPrompt, 'Stories');
    });

} //end getContent

function loadedCheck(c, $p, content) {
    console.log(content + ' loaded');
    if (c == 3) {
        fadeOutAndRemove($('#loading'));
        LOADED = true;
    } else if (c < 3 ) {
        setTimeout(function() {
            $('#loading').animate({'top':'10%'},500, 'swing');
            $p.html("<p>Still loading... <i class='fa fa-spinner fa-spin'></i></p>");
        }, 5000);
    }
}

function loadingError(c, $p, content) {
    if ( c == 3 ) {
        $p.html("<p>I'm sorry. We can't load the " + content + " right now.</p><p>Continue on or try again later.</p>");
        setTimeout(function() {
            fadeOutAndRemove($('#loading'));
        }, 5000);
        LOADED = true;
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

    var camera = {
        path: fontawesome.markers.CAMERA_RETRO,
        fillColor: '#6aaac3',
        fillOpacity: 1,
        scale: .4,
        strokeColor: '#6aaac3',
        strokeWeight: .4,
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0, -20)
    };
    var latlong = new google.maps.LatLng(longtermTLLocation.lat, longtermTLLocation.long);
    var tl_image = 'images/app/video.png';
    var marker = new google.maps.Marker({
        position: latlong,
        map: map,
        icon: tl_image,
        title: longtermTLLocation.location,
        category: longtermTLLocation.themes,
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
    boxText.className = 'info-window-inner tl-info-window-inner map-box box-shadow';
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

    var latlong = new google.maps.LatLng(storyLocation.lat, storyLocation.long);
    var book_image = 'images/app/book.png';
    var marker = new google.maps.Marker({
        position: latlong,
        map: map,
        icon: book_image,
        title: storyLocation.title,
        category: storyLocation.themes,
        html: '<h2>' + storyLocation.title + '</h2>' + '<p>' + storyLocation.description + '</p>' + '<a target="_blank" href=' + storyLocation.link + '>Read the Story</a>'
    });

    storyMarkers.push(marker);

    var boxText = document.createElement('div');
    boxText.className = 'info-window-inner story-info-window-inner map-box box-shadow';
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

    var latlong = new google.maps.LatLng(stillLocation.lat, stillLocation.long);
    var still_image = 'images/app/camera.png';
    var marker = new google.maps.Marker({
        position: latlong,
        map: map,
        icon: still_image,
        title: stillLocation.location,
        category: stillLocation.themes,
        html: '<h2>' + stillLocation.location + '</h2>' + '<img class="unveil" src=' + stillLocation.picSource + ' /> <p>' + stillLocation.description + '</p>'
    });

    stillMarkers.push(marker);

    var boxText = document.createElement('div');
    boxText.className = 'info-window-inner still-info-window-inner map-box box-shadow';
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

        var t = ib.getContent().getElementsByClassName('unveil')[0];
        // console.log( t );
        var jt = $(t);
        // console.log( jt );
        jt.trigger('unveil');
    });

    return marker;

}//end createStillMarker

function fadeOutAndRemove($thing){
    $thing.fadeOut(1000);
    setTimeout(function() {
        $thing.remove();
    }, 500);
}

function introPrompt() {
    $intro.animate({'top':'45%'},500, 'swing');
    $('<div/>').attr({'id' : 'overlay'}).appendTo('body').fadeIn(1000);

    //on close
    $('#intro-close').click(function(){
        fadeOutAndRemove($('#overlay'));
        $intro.animate({'top':'140%'},500, 'swing').fadeOut(500);

        setTimeout(function() {$intro.remove();}, 1000);
        setTimeout(function() {$side_legend.animate({'right':'15px'},500, 'swing');}, 500);
        setTimeout(function() {$bottom_legend.animate({'bottom':'0'},1000, 'swing');}, 500);
        setTimeout(function() {$('header').animate({'top':'0'},500, 'swing');}, 500);

        $('#loading').toggleClass('hide');

        INTRO = false;
    });
}

function toggleMarkers(m) {
    for (var i = 0; i < m.length; i++) {
        if(m[i].getVisible()) {
            m[i].setVisible(false);
        }else{
            m[i].setVisible(true);
        }
    }
}

function displayMarkers(m) {
    for (var i = 0; i < m.length; i++) {
        m[i].setVisible(true);
    }
}

function hideMarkers(m) {
    for (var i = 0; i < m.length; i++) {
        m[i].setVisible(false);
    }
}

function toggleGroup(m, selection) {
    for (var i = 0; i < m.length; i++) {
        if ('all' == selection){
            m[i].setVisible(true);
        } else {
            var c = m[i].get('category');
            if ( c.indexOf(selection) > -1 ) {
                m[i].setVisible(true);
            } else {
                m[i].setVisible(false);
            }
        }
    }
}

(function () {
    $('#btn-timelapse').parent().addClass('active');
    $('#btn-stills').parent().addClass('active');
    $('#btn-stories').parent().addClass('active');

    var tl_on = true,
    stills_on = true,
    stories_on = true;

    $('#btn-timelapse').change(function() {
        $('.theme-select input[value=all').prop('checked', true);
        if (tl_on) {
            hideMarkers(tlMarkers);
            tl_on = false;
        } else {
            displayMarkers(tlMarkers);
            tl_on = true;
        }
    });
    $('#btn-stills').change(function() {
        $('.theme-select input[value=all').prop('checked', true);
        if (stills_on) {
            hideMarkers(stillMarkers);
            stills_on = false;
        } else {
            displayMarkers(stillMarkers);
            stills_on = true;
        }
    });
    $('#btn-stories').change(function() {
        $('.theme-select input[value=all').prop('checked', true);
        if (stories_on) {
            hideMarkers(storyMarkers);
            stories_on = false;
        } else {
            displayMarkers(storyMarkers);
            stories_on = true;
        }
    });

    $('.theme-select input').change(function() {
        var t = $(this).attr('value');
        if (tl_on) {
            toggleGroup(tlMarkers, t);
        }

        if (stories_on) {
            toggleGroup(storyMarkers, t);
        }

        if (stills_on) {
            toggleGroup(stillMarkers, t);
        }
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
})();

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

$(window).load(function () {
    if ($( window ).width() > 767) {
        initialize();
        introPrompt();
    }
});
