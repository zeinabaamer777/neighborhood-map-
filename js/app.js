 // declare our main & global variables
 var map;
 // var marker = [];
 // declare our model locations 
 var modelLocation = [{
 	title: 'espresso lab',
 	// id: "57f91e60498e0e907a965499",
 	location: {
 		lat: 30.020943,
 		lng: 31.494939
 	}
 }, {
 	title: 'Brazilian Coffee',
 	location: {
 		lat: 29.954711,
 		lng: 31.262176
 	}
 }, {
 	title: 'Sea Door',
 	location: {
 		lat: 31.414980,
 		lng: 31.809121
 	}
 }, {
 	title: 'Starbucks',
 	location: {
 		lat: 29.954711,
 		lng: 31.262176
 	}
 }, {
 	title: 'Caffé Greco',
 	location: {
 		lat: 29.955704,
 		lng: 31.261489
 	}
 }, {
 	title: 'Pickn Go',
 	location: {
 		lat: 31.228638,
 		lng: 29.944885
 	}
 }, {
 	title: 'Zainab Khatoon',
 	location: {
 		lat: 30.044704,
 		lng: 31.263250
 	}
 }, {
 	title: 'Tres Bon',
 	location: {
 		lat: 30.094931,
 		lng: 31.320931
 	}
 }, {
 	title: 'Bi Café',
 	location: {
 		lat: 31.033088,
 		lng: 31.357357
 	}
 }, {
 	title: 'SunCity cafe',
 	location: {
 		lat: 30.470441,
 		lng: 31.177356
 	}
 }, {
 	title: 'Cavally cafe',
 	location: {
 		lat: 29.962034,
 		lng: 32.548483
 	}
 }, ];
 /* ----------------------------- map and it's content  part ----------------*/
 var mapInit = function() {
 	var self = this;
 	self.searchItem = ko.observable("");
 	self.cofeeList = ko.observableArray([]);
var styledMapType=new google.maps.StyledMapType([{elementType:'geometry',stylers:[{color:'#242f3e'}]},{elementType:'labels.text.stroke',stylers:[{color:'#242f3e'}]},{elementType:'labels.text.fill',stylers:[{color:'#746855'}]},{featureType:'administrative.locality',elementType:'labels.text.fill',stylers:[{color:'#d59563'}]},{featureType:'poi',elementType:'labels.text.fill',stylers:[{color:'#d59563'}]},{featureType:'poi.park',elementType:'geometry',stylers:[{color:'#263c3f'}]},{featureType:'poi.park',elementType:'labels.text.fill',stylers:[{color:'#6b9a76'}]},{featureType:'road',elementType:'geometry',stylers:[{color:'#38414e'}]},{featureType:'road',elementType:'geometry.stroke',stylers:[{color:'#212a37'}]},{featureType:'road',elementType:'labels.text.fill',stylers:[{color:'#9ca5b3'}]},{featureType:'road.highway',elementType:'geometry',stylers:[{color:'#746855'}]},{featureType:'road.highway',elementType:'geometry.stroke',stylers:[{color:'#1f2835'}]},{featureType:'road.highway',elementType:'labels.text.fill',stylers:[{color:'#f3d19c'}]},{featureType:'transit',elementType:'geometry',stylers:[{color:'#2f3948'}]},{featureType:'transit.station',elementType:'labels.text.fill',stylers:[{color:'#d59563'}]},{featureType:'water',elementType:'geometry',stylers:[{color:'#17263c'}]},{featureType:'water',elementType:'labels.text.fill',stylers:[{color:'#515c6d'}]},{featureType:'water',elementType:'labels.text.stroke',stylers:[{color:'#17263c'}]}],{name:'Night Mode'})
 	// define map with a fixed zoom & center 
 	map = new google.maps.Map(document.getElementById('map'), {
 		zoom: 7,
 		mapTypeId: google.maps.MapTypeId.ROADMAP,
 		center: {
 			lat: 30.044420,
 			lng: 31.235712
 		},
 		mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite','styled_map']
          }
 	});
 	        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');
 	// var searchFilter = self.searchItem();
 	modelLocation.forEach(function(Item) {
 		// body...
 		self.cofeeList.push(new foursquareData(Item));
 	});
 	this.filteredCofee = ko.computed(function() {
 		var searchFilter = self.searchItem();
 		if (searchFilter === "") {
 			return self.cofeeList();
 		} else {
 			return ko.utils.arrayFilter(self.cofeeList(), function(Item) {
 				var seaRESULT = Item.title.toLowerCase().search(searchFilter);
 				if (seaRESULT >= 0) {
 					// console.log(seaRESULT);
 					return true;
 				} else {
 					return false;

 				}
 				// return seaRESULT;
 			});
 		}
 	}, self);
 	self.currentCofee = ko.observable(this.cofeeList[0]);
 	// this function handle action on list to make the info window appera
 	self.clickHandler = function(cofeeList) {
 		google.maps.event.trigger(cofeeList.marker, 'click');
 		cofeeList.marker.setAnimation(google.maps.Animation.DROP);
 	};
 }
 var foursquareData = function(data) {
 	console.log(data);
 	var self = this;
 	self.title = data.title;
 	self.lat = data.location.lat;
 	self.lng = data.location.lng;
 	self.street = "";
 	self.city = "";
 	self.checkinsCount = "";
 	self.setVisible = ko.observable(true);
 	// https://api.foursquare.com/v2/venues/search
 	//   ?client_id=CLIENT_ID
 	//   &client_secret=CLIENT_SECRET
 	//   &ll=##,##
 	//   &query=wtf?
 	//   &v=YYYYMMDD
 	//   &m=foursquare
 	// JSON request and response 
 	$.getJSON('https://api.foursquare.com/v2/venues/search?ll=' + self.lat + ',' + self.lng + ',' + '&query=' + self.title + ',' + '&client_id=0Z5CLW5WEVJCHJZIBRFRI4E0SBMVQXYA1KRS44ZQNKHOQEMW&client_secret=YAAR5XQXDKZ1SLCGJ0DCEOXH2MYHHXOURY0QCUWJP4BBY133&v=20161016&m=foursquare', function(data) {
 		// console.log(self.title, data);
 		console.log(data);
 		$.each(data.response.venues, function(i, venues) {
 			// self.URL = venues.url;
 			self.lat = venues.location.lat;
 			self.lng = venues.location.lng;
 			self.street = venues.location.formattedAddress[0];
 			self.city = venues.location.formattedAddress[1];
 			self.checkinsCount = venues.stats.checkinsCount;
 			if (typeof self.city === 'undefined' || typeof self.checkinsCount === 'undefined' || typeof self.street === 'undefined') {
 				self.city = "";
 				self.street = "";
 				self.checkinsCount = "";
 			}
 			// self.hereNow = venues.count.hereNow;
 			// self.phone = venues.Cofe.phone;
 		});
 		// self.extrContent =  self.street + self.city +self.checkinsCount;
 		// self.getContent = '<div class="window-content" style="background-color:#a0785c;padding:5px;color:#fff;text-transform:uppercase; border-radius:5px;"><div class="title"><h4 style="color:#38c3ea;">' + self.title + "</h4></div>" + '<div class="extrContent"> ( ' + self.lat + ' , ' + self.lng + " ) </div>" + '<div class="extrContent"> city ->' + " " + self.city + "</div>" + '<div class="extrContent"> Street ->' + " " + self.street + "</div>" + '<div class="extrContent">' + self.checkinsCount + " checkins </div></div>";
 	});
 	self.getContent = '<div class="window-content" style="background-color:#4d7b98;padding:5px;color:#fff;text-transform:uppercase; border-radius:5px;"><div class="title"><h4 style="color:#ece8dd;">' + self.title + "</h4></div>" + '<div class="extrContent"> ( ' + self.lat + ' , ' + self.lng + " ) </div>" + '<div class="extrContent"> city ->' + " " + self.city + "</div>" + '<div class="extrContent"> Street ->' + " " + self.street + "</div>" + '<div class="extrContent">' + self.checkinsCount + " checkins </div></div>"; // define infoWindow 
 	self.infoWindow = new google.maps.InfoWindow({
 		content: '',
 		maxWidth: 220 
 	});
 	google.maps.event.addDomListener(window, 'load', function() {
 		//create markers here
 		self.marker = new google.maps.Marker({
 			position: new google.maps.LatLng(data.location.lat, data.location.lng),
 			map: map,
 			title: data.title,
 			animation: google.maps.Animation.DROP,
 			 icon: 'images/pin-first.png'

 		});
 		// function to show markers on map
 		this.isVisible = ko.observable(false);
 		this.isVisible.subscribe(function(currentMark) {
 			if (currentMark) {
 				self.marker.setMap(map);
 			} else {
 				self.marker.setMap(null);
 			}
 		});
 		this.isVisible(true);
 		// open info window of the marker when click 
 		google.maps.event.addListener(self.marker, 'click', function() {
 			self.infoWindow.close();
 			self.infoWindow.setContent(self.getContent);
 			self.infoWindow.open(map, self.marker);
 			self.marker.setAnimation(google.maps.Animation.DROP);
 			map.setZoom(8);
 			self.marker.setIcon('images/pin-second.png');
 		});
 	});
 };
 // ko.applyBindings(mapInit);
 function MapInit() {
 	// Apply the binding
 	ko.applyBindings(new mapInit());
 }
