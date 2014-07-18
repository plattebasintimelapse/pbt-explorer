"use strict";function initialize(){var a=[{featureType:"water",stylers:[{color:"#446980"},{weight:2}]},{featureType:"road",stylers:[{visibility:"simplified"}]},{featureType:"road.highway",stylers:[{visibility:"off"},{color:"#202909"},{weight:.8}]},{featureType:"road.highway",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"poi",stylers:[{visibility:"off"}]},{featureType:"administrative",stylers:[{visibility:"on"}]},{featureType:"water",elementType:"labels",stylers:[{visibility:"off"}]},{},{featureType:"road",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"transit",stylers:[{visibility:"off"}]}],b=new google.maps.StyledMapType(a,{name:"Styled Map"}),c={zoom:5,maxZoom:13,minZoom:5,center:new google.maps.LatLng(41.643387,-101.612224),mapTypeControl:!1,panControl:!1,zoomControl:!0,zoomControlOptions:{style:google.maps.ZoomControlStyle.LARGE,position:google.maps.ControlPosition.LEFT_CENTER},scaleControl:!1,streetViewControl:!1};map=new google.maps.Map(document.getElementById("map-canvas"),c),map.mapTypes.set("map_style",b),map.setMapTypeId("map_style");var d={keepSpiderfied:!0,legWeight:1};oms=new OverlappingMarkerSpiderfier(map,d);var e=new google.maps.FusionTablesLayer({map:map,suppressInfoWindows:!0,query:{select:"col2",from:"1JvJgh-o4GfNRLKAreWD9UiFJa5N0rqpS_Wq3xSNf",where:"col1 = 'Streams'"},options:{styleId:2,templateId:2}});e.setMap(map);var e=new google.maps.KmlLayer("http://www.localhost:9000/data/plattebasin.kml"),f=new google.maps.weather.CloudLayer;f.setMap(map),getContent(),setPictureMarkers(map,pictureLocations);new google.maps.InfoWindow({content:"Loading..."})}function getContent(){$.getJSON("https://spreadsheets.google.com/feeds/list/1XZx5wnIEaFy7sJ85KI4cJOPrgx4o87ZilsDxp9VNfhs/od6/public/values?alt=json",function(a){for(var b=0;b<a.feed.entry.length;b++){var c={location:a.feed.entry[b].gsx$title.$t,description:a.feed.entry[b].gsx$description.$t,"long":Number(a.feed.entry[b].gsx$long.$t),lat:Number(a.feed.entry[b].gsx$lat.$t),vimeoURL:a.feed.entry[b].gsx$vimeoid.$t,phocalstreamID:a.feed.entry[b].gsx$phocalstreamid.$t};longtermTLLocations.push(c)}setTLMarkers(map,longtermTLLocations)}),$.getJSON("https://spreadsheets.google.com/feeds/list/1DzzJ15l2V-t4milyvF3j4KIqTM0GiuqVZ3h4vg9mnaw/od6/public/values?alt=json",function(a){for(var b=0;b<a.feed.entry.length;b++){var c={location:a.feed.entry[b].gsx$title.$t,description:a.feed.entry[b].gsx$description.$t,"long":Number(a.feed.entry[b].gsx$long.$t),lat:Number(a.feed.entry[b].gsx$lat.$t),vimeoURL:a.feed.entry[b].gsx$vimeoid.$t};storyLocations.push(c)}setStoryMarkers(map,storyLocations)})}function createTLMarker(a,b){var c='<iframe class="timelapse-video" src="http://player.vimeo.com/video/'+a.vimeoURL+'"frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',d="EXPLORE ALL IMAGES",e="http://images.plattebasintimelapse.com/photo/cameracollection?siteId=",f={path:google.maps.SymbolPath.CIRCLE,fillColor:"#f45555",fillOpacity:.8,scale:8,strokeColor:"#f45555",strokeWeight:1},g=new google.maps.Marker({position:new google.maps.LatLng(a.long,a.lat),map:b,icon:f,title:a.location,html:'<h2 class="center">'+a.location+'</h2><div class="timelapse-video-container">'+c+"</div><p>"+a.description+'</p><div class="phocalstream-link"><a class="center" target="_blank" href="'+e+a.phocalstreamID+'">'+d+"</a></div>"});oms.addMarker(g),tlMarkers.push(g);var h=document.createElement("div");h.className="info-window-inner tl-location map-box box-shadow",h.innerHTML=g.html;var i={content:h,disableAutoPan:!1,maxWidth:0,pixelOffset:new google.maps.Size(-300,200),zIndex:null,closeBoxMargin:"15px;",closeBoxURL:"images/app/close.png",infoBoxClearance:new google.maps.Size(100,100),isHidden:!1,alignBottom:!0,pane:"floatPane",enableEventPropagation:!1};return google.maps.event.addListener(g,"click",function(){ib.close(),ib.setOptions(i),ib.open(b,g)}),g}function createStoryMarker(a,b){var c='<iframe class="timelapse-video" src="http://player.vimeo.com/video/'+a.vimeoURL+'"frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',d={path:google.maps.SymbolPath.CIRCLE,fillColor:"#f45555",fillOpacity:.8,scale:8,strokeColor:"#f45555",strokeWeight:1},e=new google.maps.Marker({position:new google.maps.LatLng(a.long,a.lat),map:b,icon:d,title:a.location,html:"<h2>"+a.location+"</h2><p>"+a.description+"</p>"+c});storyMarkers.push(e);var f=document.createElement("div");f.className="info-window-inner story-location map-box box-shadow",f.innerHTML=e.html;var g={content:f,disableAutoPan:!1,maxWidth:0,pixelOffset:new google.maps.Size(-300,200),zIndex:null,closeBoxMargin:"15px;",closeBoxURL:"images/app/close.png",infoBoxClearance:new google.maps.Size(150,150),isHidden:!1,alignBottom:!0,pane:"floatPane",enableEventPropagation:!1};return google.maps.event.addListener(e,"click",function(){ib.close(),ib.setOptions(g),ib.open(b,this)}),e}function createPictureMarker(a,b){var c="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pellentesque dictum ligula, non vehicula sem ultricies nec. Phasellus luctus augue in pretium tempus.",d={path:google.maps.SymbolPath.CIRCLE,fillColor:"#f45555",fillOpacity:.8,scale:4,strokeColor:"#f45555",strokeWeight:1},e=new google.maps.Marker({position:new google.maps.LatLng(a.long,a.lat),map:b,icon:d,title:a.location,html:"<h2>"+a.location+"</h2><img src=images/uploads/"+a.image+" /> <p>"+c+"</p>"});pictureMarkers.push(e);var f=document.createElement("div");f.className="info-window-inner story-location map-box box-shadow",f.innerHTML=e.html;var g={content:f,disableAutoPan:!1,maxWidth:0,pixelOffset:new google.maps.Size(-300,200),zIndex:null,closeBoxMargin:"15px;",closeBoxURL:"images/app/close.png",infoBoxClearance:new google.maps.Size(150,150),isHidden:!1,alignBottom:!0,pane:"floatPane",enableEventPropagation:!1};return google.maps.event.addListener(e,"click",function(){ib.close(),ib.setOptions(g),ib.open(b,this)}),e}function setTLMarkers(a,b){for(var c=0;c<b.length;c++)createTLMarker(b[c],a)}function setStoryMarkers(a,b){for(var c=0;c<b.length;c++)createStoryMarker(b[c],a)}function setPictureMarkers(a,b){for(var c=0;c<b.length;c++)createPictureMarker(b[c],a)}function zoomMap(){map.setZoom(6)}function removeOverlay(){$("#overlay").fadeOut(1e3),setTimeout(function(){$("#overlay").remove()},500)}function introPrompt(){introDiv.animate({top:"45%"},500,"swing"),$("<div/>").attr({id:"overlay"}).appendTo("body").fadeIn(1e3),$("#intro-close").click(function(){removeOverlay(),introDiv.animate({top:"140%"},500,"swing").fadeOut(500),setTimeout(function(){introDiv.remove()},1e3),setTimeout(function(){zoomMap(6)},500)})}function slideOut(){legend.animate({right:"20px"},500,"swing")}function slideIn(){legend.animate({right:"-170px"},500,"swing")}function toggleMarkers(a){for(var b=0;b<a.length;b++)a[b].setVisible(a[b].getVisible()?!1:!0)}function watchLegendChange(){$("#btn-timelapse").parent().addClass("active"),$("#btn-pictures").parent().addClass("active"),$("#btn-stories").parent().addClass("active"),$("#btn-timelapse").change(function(){toggleMarkers(tlMarkers)}),$("#btn-pictures").change(function(){toggleMarkers(pictureMarkers)}),$("#btn-stories").change(function(){toggleMarkers(storyMarkers)})}var map,oms,ib=new InfoBox,tlMarkers=[],storyMarkers=[],pictureMarkers=[],longtermTLLocations=[],storyLocations=[],pictureLocations=[],introDiv=$("#intro"),legend=$("#legend");google.maps.event.addDomListener(window,"load",initialize),$(window).load(function(){setTimeout(function(){zoomMap(6)},500)}),$(document).ready(function(){});