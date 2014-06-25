'use strict';

var map;
var oms;
var ib = new InfoBox();
var tlMarkers = [];
var storyMarkers = [];
var pictureMarkers = [];

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
    
    var platteBasinLayer = new google.maps.KmlLayer('http://www.localhost:9000/data/plattebasin.kml');
//    var platteBasinLayer = new google.maps.KmlLayer({
//        driveFileId: "0B7FEptRuAHpMa1ZldS1WUE9vMVE"
//    });
//    platteBasinLayer.setMap(map);

    // load in Google Maps cloud layer
    var cloudLayer = new google.maps.weather.CloudLayer();
    cloudLayer.setMap(map);

    getContent();
    setPictureMarkers(map, pictureLocations);
    
    var infowindow = new google.maps.InfoWindow({
        content: "Loading..."

    });
    
}

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
        setStoryMarkers(map, storyLocations);
        
    });    
}

var pictureLocations = [
//        {location: 'Whalen Diversion Dam', long: 42.42360, lat: -107.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 42.32360, lat: -105.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 42.82360, lat: -106.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 41.32360, lat: -100.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 42.42360, lat: -99.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 42.52360, lat: -100.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 41.02360, lat: -105.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 42.32360, lat: -104.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 42.62360, lat: -101.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 41.82360, lat: -100.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 42.22360, lat: -101.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 42.12360, lat: -102.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 42.02360, lat: -105.99740, image: 'whalen.jpg'},
//        {location: 'Whalen Diversion Dam', long: 41.72360, lat: -106.99740, image: 'whalen.jpg'},
//        {location: 'North Park',	long:41.05813407,	lat:-106.18438713,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.73327337,	lat:-106.49516759,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.6853497,	lat:-105.88738791,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.8987622,	lat:-106.5299724,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.63017235,	lat:-106.48748021,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.82074244,	lat:-105.87992717,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.71704002,	lat:-106.23192591,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:41.0116346,	lat:-106.1846855,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.61682109,	lat:-105.90131082,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.56700937,	lat:-106.48167793,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.67889584,	lat:-106.17020393,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.97853825,	lat:-106.35788,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.99980469,	lat:-106.06642245,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.78420701,	lat:-105.86102226,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.6657689,	lat:-106.36292346,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.76241399,	lat:-106.69739978,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.94013258,	lat:-106.28871553,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.76328308,	lat:-105.92928685,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.85903475,	lat:-106.10107886,	 image: 'whalen.jpg'},
//        {location: 'North Park',	long:40.51659716,	lat:-106.29932994,	 image: 'whalen.jpg'},
//        {"location":"The Front Range","long":39.55818639,"lat":-105.231513,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.86803556,"lat":-104.6636001,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.45166733,"lat":-105.0933374,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.40853089,"lat":-104.8537637,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.29578247,"lat":-104.8399642,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.80764225,"lat":-104.6270677,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.91520803,"lat":-104.5650337,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.56149384,"lat":-105.4351263,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.28095347,"lat":-105.0474486,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.99426124,"lat":-104.5263732,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.07930912,"lat":-105.3724665,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.43520221,"lat":-105.3352201,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.40673786,"lat":-105.4237626,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.45689203,"lat":-104.4819678,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.41302898,"lat":-105.3743766,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.78896886,"lat":-105.3753276,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.66037015,"lat":-105.3064667,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.097404,"lat":-105.4025436,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.69436348,"lat":-104.2768299,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.56621649,"lat":-104.9149075,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.54915258,"lat":-104.6886981,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.72855629,"lat":-105.3453094,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.81497579,"lat":-104.7130065,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.77555636,"lat":-104.5450596,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.74265196,"lat":-105.4785612,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.19888066,"lat":-104.7750559,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.84796217,"lat":-105.4011978,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.40995744,"lat":-104.5460403,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.87570056,"lat":-104.6101499,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.68592463,"lat":-105.438709,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.47638826,"lat":-105.0914455,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.89236676,"lat":-104.7435136,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.64243083,"lat":-104.7389292,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.56761944,"lat":-104.5204519,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.13836564,"lat":-104.8190583,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.13174884,"lat":-105.4681115,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.79313525,"lat":-104.7028232,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.97308531,"lat":-105.4763147,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.62013339,"lat":-104.4885149,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.0510258,"lat":-104.4931575,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.84436456,"lat":-104.4025976,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.55105464,"lat":-104.7266908,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.89693925,"lat":-105.2924048,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.54779772,"lat":-105.2113671,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.58190451,"lat":-105.597985,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.01315405,"lat":-104.6191721,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.85248735,"lat":-105.0630495,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.87582892,"lat":-104.85294,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.24566014,"lat":-104.8540264,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.1512638,"lat":-105.3349737,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.08014573,"lat":-105.2127329,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.74519677,"lat":-105.6658695,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.80894437,"lat":-105.3367461,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.43807255,"lat":-105.2851247,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.82734095,"lat":-104.6632985,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.99530178,"lat":-104.9173236,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.16489812,"lat":-104.8986828,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.99883625,"lat":-105.3185566,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.4905575,"lat":-105.5378,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.81675548,"lat":-104.2699881,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.9014169,"lat":-105.4797616,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.75872896,"lat":-104.8613529,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.75792323,"lat":-105.6572239,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.79198642,"lat":-105.2820586,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.41858727,"lat":-104.9331146,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.18047812,"lat":-104.8664532,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.61102318,"lat":-104.6846215,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.01997561,"lat":-105.6343,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.72703626,"lat":-105.5554917,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.41081662,"lat":-105.2061016,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.84250631,"lat":-104.3907754,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.09824819,"lat":-105.2203431,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.58541563,"lat":-105.1812319,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.03159436,"lat":-105.2320592,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.63130434,"lat":-105.6917646,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.72761042,"lat":-104.4834033,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.6797495,"lat":-104.5855383,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.25538771,"lat":-104.7016355,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.21843643,"lat":-104.8217986,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.55414636,"lat":-104.3813264,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.30948717,"lat":-105.4709988,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.52400244,"lat":-105.0722888,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.85266804,"lat":-104.5426775,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.84645047,"lat":-104.2941668,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.34456249,"lat":-105.0331333,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.20545935,"lat":-105.0664772,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.43720223,"lat":-105.1009058,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.92432753,"lat":-104.3293374,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.73339932,"lat":-105.393143,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.24562157,"lat":-105.1434948,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.87982021,"lat":-104.8188203,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.10553107,"lat":-104.4642739,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.75860871,"lat":-105.7171361,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.11524719,"lat":-105.1363599,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.48257099,"lat":-104.3883847,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.5682826,"lat":-104.6325483,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.39906081,"lat":-104.6740035,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.25032579,"lat":-105.114435,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.21941022,"lat":-105.0631228,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.64341632,"lat":-104.8572778,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.84854615,"lat":-105.0684735,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.75082592,"lat":-105.6967573,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.1534582,"lat":-105.3037828,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.67255298,"lat":-104.7222531,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.28186342,"lat":-105.2277553,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.06314109,"lat":-105.4504296,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.46813515,"lat":-105.4774205,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.03194696,"lat":-105.468107,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.45777999,"lat":-104.4862188,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.77754261,"lat":-104.7410665,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.27769786,"lat":-104.9262992,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.59983227,"lat":-104.5186311,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.31215689,"lat":-104.6111011,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.56546659,"lat":-104.3458913,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.09976991,"lat":-104.4844027,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.19089772,"lat":-104.8643002,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.98377457,"lat":-104.3406683,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.44686122,"lat":-105.0331593,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":39.89270006,"lat":-104.478907,"image":"whalen.jpg"},
//        {"location":"The Front Range","long":40.03940166,"lat":-104.8017036,"image":"whalen.jpg"},
//        {"location":"Water Delivery","long":41.94560808,"lat":-103.8240959,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":42.02034816,"lat":-103.8834095,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.81835315,"lat":-103.3776833,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":42.06927074,"lat":-103.4330633,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.76618517,"lat":-103.768221,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.96898596,"lat":-103.6316055,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.84834337,"lat":-103.7113031,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.850559,"lat":-103.9823584,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.72430316,"lat":-103.8357644,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.76437759,"lat":-103.7047938,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":42.07928123,"lat":-103.5983577,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.66409863,"lat":-103.6144863,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":42.04222918,"lat":-103.7687392,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.83456693,"lat":-103.5288163,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.8533315,"lat":-103.8558839,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":42.03954612,"lat":-103.8245906,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":42.11062705,"lat":-103.6392142,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":42.09456364,"lat":-103.762143,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.87463738,"lat":-103.60236,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.9602385,"lat":-104.026753,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":42.08007605,"lat":-103.6579722,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.86372647,"lat":-103.6711268,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.91809592,"lat":-103.8521216,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.85113322,"lat":-103.831048,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.78921161,"lat":-103.7312415,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.66804865,"lat":-103.738429,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.72349192,"lat":-103.8138321,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.82880196,"lat":-103.2907397,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.59286929,"lat":-103.6926745,"image":"guernsey.jpg"},
//        {"location":"Water Delivery","long":41.7488786,"lat":-103.3349185,"image":"guernsey.jpg"},
//        {"location":"Salt Creek Watershed","long":40.96217597,"lat":-96.67139983,"image":"whalen.jpg"},
//        {"location":"Salt Creek Watershed","long":40.59032799,"lat":-96.47791748,"image":"whalen.jpg"},
//        {"location":"Salt Creek Watershed","long":41.01847231,"lat":-96.51683784,"image":"whalen.jpg"},
//        {"location":"Salt Creek Watershed","long":40.80769318,"lat":-96.2976352,"image":"whalen.jpg"},
//        {"location":"Salt Creek Watershed","long":41.00126177,"lat":-96.46419778,"image":"whalen.jpg"},
//        {"location":"Salt Creek Watershed","long":40.78907735,"lat":-96.91001797,"image":"whalen.jpg"},
//        {"location":"Salt Creek Watershed","long":40.77575474,"lat":-96.8487222,"image":"whalen.jpg"},
//        {"location":"Salt Creek Watershed","long":40.83544681,"lat":-96.40580464,"image":"whalen.jpg"},
//        {"location":"Salt Creek Watershed","long":40.64357654,"lat":-96.37476092,"image":"whalen.jpg"},
//        {"location":"Salt Creek Watershed","long":40.60915113,"lat":-96.65309871,"image":"whalen.jpg"},
//        {location: 'Seminoe Canyon', long: 42.42360, lat: -98.99740, image: 'seminoe-canyon.jpg'},
//        {"location":"Central Platte","long":41.6337778,"lat":-99.22757626,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.00067232,"lat":-99.06337644,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.17956154,"lat":-98.83032767,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.63997332,"lat":-98.67137665,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.62322833,"lat":-99.18112392,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.35108625,"lat":-99.68079713,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.47252269,"lat":-98.67308881,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.0892575,"lat":-98.94662032,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.87142867,"lat":-100.3630236,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.70545527,"lat":-100.1057957,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.21836421,"lat":-98.94591318,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.94968225,"lat":-100.2835737,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.42679156,"lat":-99.66716613,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.66867592,"lat":-100.0074324,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.35097195,"lat":-99.83721621,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.97393973,"lat":-99.79027857,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.54563309,"lat":-100.4894559,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.06902949,"lat":-99.25637225,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.70813121,"lat":-99.87124338,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.55778558,"lat":-99.63128651,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.09859214,"lat":-100.0675164,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.03539895,"lat":-99.40608386,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.50556953,"lat":-100.3217516,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.9576434,"lat":-98.97459603,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.21099962,"lat":-99.28219631,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.56812236,"lat":-98.73548636,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.81399193,"lat":-100.2136406,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.0195338,"lat":-99.89419566,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.11055529,"lat":-99.59364596,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.17480436,"lat":-99.27486897,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.86056355,"lat":-99.53303007,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.7125609,"lat":-100.6166016,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.74239882,"lat":-100.213187,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.0294759,"lat":-99.25908071,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.3589923,"lat":-99.73370743,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.43043913,"lat":-99.56575787,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.72546462,"lat":-100.5932247,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.22093339,"lat":-100.2663319,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.30621381,"lat":-98.65011076,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.47311424,"lat":-99.22516951,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.92562173,"lat":-100.0141957,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.14460149,"lat":-99.32648203,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.39048287,"lat":-98.95433013,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.67120182,"lat":-100.3071698,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.34133811,"lat":-99.65670615,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.68760793,"lat":-99.86815104,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.05879235,"lat":-99.25779107,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.790651,"lat":-100.3108439,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.48173246,"lat":-100.0819241,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.51500739,"lat":-100.5147074,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.19726214,"lat":-100.2736769,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.60895053,"lat":-99.18764345,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":42.12616329,"lat":-99.86027952,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.17832881,"lat":-100.4548915,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.03249331,"lat":-99.57811228,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.69794941,"lat":-99.00660165,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.69399791,"lat":-100.5555627,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.69649048,"lat":-99.99611581,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.00821761,"lat":-99.22900918,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.76041136,"lat":-98.85656449,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.15600292,"lat":-98.67761418,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":42.01561501,"lat":-99.95686327,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.77431838,"lat":-99.03443857,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.66722376,"lat":-99.95270339,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.28761835,"lat":-99.25278022,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.32087194,"lat":-98.70875382,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.31728166,"lat":-100.3378696,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.05662648,"lat":-99.16507997,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.80146872,"lat":-98.80899127,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.41530261,"lat":-99.22575102,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.37696173,"lat":-99.76702622,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.62473233,"lat":-100.4243746,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.86543418,"lat":-99.22596855,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.14403988,"lat":-100.2989639,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.43237289,"lat":-99.77347939,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.68824166,"lat":-99.99389345,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.17848294,"lat":-99.84060333,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.48290225,"lat":-100.181189,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.65131649,"lat":-99.92348414,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.38572779,"lat":-100.2747736,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.30380076,"lat":-99.71542324,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.75747198,"lat":-99.98281018,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.93684205,"lat":-100.2917922,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.78220639,"lat":-99.37473401,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.34548951,"lat":-100.3655843,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":42.12510583,"lat":-99.45572442,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.66461347,"lat":-98.80116396,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":42.13145539,"lat":-100.025992,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.86488506,"lat":-99.05679451,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.55735063,"lat":-98.7525939,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.40299713,"lat":-100.6449016,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.74924996,"lat":-100.2024285,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":40.91453742,"lat":-98.83304803,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.00493802,"lat":-99.00409826,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":42.06848633,"lat":-99.60905208,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.16978466,"lat":-99.99606642,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.50949098,"lat":-99.29451256,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.96622837,"lat":-99.46468349,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.82587278,"lat":-99.80033495,"image":"whalen.jpg"},
//        {"location":"Central Platte","long":41.87167321,"lat":-99.85555521,"image":"whalen.jpg"}
    ];

function createTLMarker(longtermTLLocation, map) {
    
    // Content for InfoBox
    var iFrameContentForInfoBox = '<iframe class="timelapse-video" src="http://player.vimeo.com/video/' + longtermTLLocation.vimeoURL + '"frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    var phocalstreamAccessTag = 'EXPLORE ALL IMAGES';                                             //The text a user clicks on to access Phocalstream images
    var phocalstreamBaseURL = 'http://raikes-rogue20.unl.edu/photo/cameracollection?siteId=';     //The base url for phocalstreamAccessTag anchor tag
    
    var circle ={
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#f45555',
        fillOpacity: .8,
        scale: 8,
        strokeColor: '#f45555',
        strokeWeight: 1
    };
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(longtermTLLocation.long, longtermTLLocation.lat),
        map: map,
        icon: circle,
        title: longtermTLLocation.location,
        html: '<h2>' + longtermTLLocation.location + '</h2>' + '<p>' + longtermTLLocation.description + '</p>' + iFrameContentForInfoBox + '<div class="phocalstream-link"><a target="_blank" href="' + phocalstreamBaseURL + longtermTLLocation.phocalstreamID + '">' + phocalstreamAccessTag + '</a></div>'
    });
    
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
        infoBoxClearance: new google.maps.Size(150, 150),
        isHidden: false,
        alignBottom: true,
        pane: "floatPane",
        enableEventPropagation: false
    };
    
    google.maps.event.addListener(marker, "click", function (e) {
        ib.close();
        ib.setOptions(myOptions);
        ib.open(map, marker);
        
//        map.setCenter(marker.getPosition());
    });
    return marker;
}

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
        html: '<h2>' + storyLocation.location + '</h2>' + '<p>' + storyLocation.description + '</p>' + iFrameContentForInfoBox
    });
    
    storyMarkers.push(marker);

    var boxText = document.createElement('div');
    boxText.className = 'info-window-inner story-location map-box shadow';
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
}

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
    boxText.className = 'info-window-inner story-location map-box shadow';
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
}

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


google.maps.event.addDomListener(window, 'load', initialize);

//function createClusters() {
//    var mcOptions = {gridSize: 20};
//    var markerClusterer = new MarkerClusterer(map, tlMarkers, mcOptions);
//}

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

$(window).load(function () {
    introPrompt();
    watchLegendChange();
    legend.hover(slideOut, slideIn);
});

$(document).ready(function () {
    
    
});

