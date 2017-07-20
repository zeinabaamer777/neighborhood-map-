// declare our main & global variables
var map;
// var marker = [];
// declare our model locations  
var modelLocation = [{
	title: 'cavello cafe',
	location: {
		lat: 30.473895,
		lng: 31.177214
	}
},{
	title: 'we lessa yama cafe',
	location: {
		lat: 30.474411,
		lng: 31.177381
	}
}, {
	title: 'El Gouna Coffee Shop',
	location: {
		lat: 27.408790,
		lng: 33.677226
	}
}, {
	title: 'Muslem Coffee',
	location: {
		lat: 30.471193,
		lng: 31.177211
	}
}, {
	title: 'SunCity',
	location: {
		lat: 30.470441,
		lng: 31.177356
	}
}, {
	title: 'Lebnan cafe',
	location: {
		lat: 29.970702,
		lng: 31.247586
	}
}, {
	title: 'El Zaeem',
	location: {
		lat: 30.597304,
		lng: 32.271835
	}
}, ];
var Cofe = function(data) {
		console.log(data);
		var self = this;
		self.title = data.title;
		self.lat = data.location.lat;
		self.lng = data.location.lng;
		self.URL = "";
		self.street = "";
		self.city = "";
		self.visible = ko.observable(true);
		$.getJSON('https://api.foursquare.com/v2/venues/search?ll=' + self.lat + ',' + self.lng + ',' + '&query=' + self.title + ',' + '&limit=30&client_id=0Z5CLW5WEVJCHJZIBRFRI4E0SBMVQXYA1KRS44ZQNKHOQEMW&client_secret=YAAR5XQXDKZ1SLCGJ0DCEOXH2MYHHXOURY0QCUWJP4BBY133&v=20161016').done(function(data) {
			console.log(self.title, data)
			var lists = data.response.venues[0];
			self.URL = lists.url;
			self.street = lists.location.formattedAddress[0];
			self.city = lists.location.formattedAddress[1];
			self.extrContent = self.URL + self.street + self.city;
			self.getContent = '<div class="window-content"><div class="title"><h3>' + data.title + "</b></div>" + '<div><a target="_blank" href="' + self.URL + '">' + self.URL + "</a></div>" + '<div class="extrContent">' + this.extrContent+"</div>";
		});

        self.getContent = '<div class="window-content"><div class="title"><h3>' + data.title + "</b></div>" + '<div><a target="_blank" href="' + self.URL + '">' + self.URL + "</a></div>" + '<div class="extrContent">' + this.extrContent+"</div>";
	    self.infoWindow = new google.maps.InfoWindow({content: self.getContent});
		// add and show markers
		self.marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.location.lat, data.location.lng),
			map: map,
			title: data.title,
		});
		self.showMarker = ko.computed(function() {
			if (self.visible() === true) {
				self.marker.setMap(map);
			} else {
				self.marker.setMap(null);
			}
			return true;
		}, self);
		// Get contect infowindows
		self.marker.addListener('click', function() {
			// self.getContent = '<div class="window-content"><div class="title"><h3>' + data.title + "</b></div>" + '<div class="foursquareURL"><a target="_blank" href="' + self.URL + '">' + self.URL + "</a></div>" + '<div class="extrContent">' + self.extrContent;
			// declare info window
			self.infoWindow = new google.maps.InfoWindow({
				content: self.getContent
			});
			self.infoWindow.setContent(this.getContent);
			self.infoWindow.open(map, this);
			// set marker animation 
			self.marker.setAnimation(google.maps.Animation.DROP);
		});
		// url: 'https://api.foursquare.com/v2/venues/explore?ll=' + '&query=' + self.title + ',' + self.lat + ',' + self.lng + ',' + '&limit=30&client_id=0Z5CLW5WEVJCHJZIBRFRI4E0SBMVQXYA1KRS44ZQNKHOQEMW&client_secret=YAAR5XQXDKZ1SLCGJ0DCEOXH2MYHHXOURY0QCUWJP4BBY133&v=20161016',
		// declare foursquaresite to get data
		// //json call
		//    $.getJSON('https://api.foursquare.com/v2/venues/search?ll=' + '&query=' + self.title + ',' + self.lat + ',' + self.lng + ',' +'&client_id=0Z5CLW5WEVJCHJZIBRFRI4E0SBMVQXYA1KRS44ZQNKHOQEMW'+'&client_secret=YAAR5XQXDKZ1SLCGJ0DCEOXH2MYHHXOURY0QCUWJP4BBY133'+'&v=20161016').done(function(data) {
		//         $.each(data.response.venues, function(i,venues){
		//         self.URL = venues.url;
		// 		self.street = venues.location.formattedAddress[0];
		//      	self.city = venues.location.formattedAddress[1];
		//       	self.phone = venues.location.phone;
		//     })
		//    });
	}
	/* ----------------------------- model part ----------------*/
var viewCoffeModel = function() {
	var self = this;
	this.searchItem = ko.observable("");
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: {
			lat: 30.4659929,
			lng: 31.18483070000002
		},
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
		}
	});
	this.cofeeList = ko.observableArray([]);
	modelLocation.forEach(function(cofeeItem) {
		// body...
		self.cofeeList.push(new Cofe(cofeeItem));
	});
	this.filteredCofee = ko.computed(function() {
		var search = self.searchItem();
		if (search === null) {
			self.cofeeList().forEach(function(cofeeItem) {
				cofeeItem.visible(true);
			});
			return self.cofeeList();
		}
	}, self);
	self.currentCofee = ko.observable(this.cofeeList[0]);
}

function startMap() {
	// activate knockout 
	ko.applyBindings(new viewCoffeModel());
}
