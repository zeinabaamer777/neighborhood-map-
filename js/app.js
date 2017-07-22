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
		// self.URL = "";
		self.street = "";
		self.city = "";
		self.checkinsCount ="";
		self.visible = ko.observable(true);
// https://api.foursquare.com/v2/venues/search
//   ?client_id=CLIENT_ID
//   &client_secret=CLIENT_SECRET
//   &ll=40.7,-74
//   &query=sushi
//   &v=YYYYMMDD
//   &m=foursquare
        // JSON request and response 
		$.getJSON('https://api.foursquare.com/v2/venues/search?ll='+ self.lat + ',' + self.lng + ',' + '&query=' + self.title + ',' + '&client_id=0Z5CLW5WEVJCHJZIBRFRI4E0SBMVQXYA1KRS44ZQNKHOQEMW&client_secret=YAAR5XQXDKZ1SLCGJ0DCEOXH2MYHHXOURY0QCUWJP4BBY133&v=20161016&m=foursquare',function(data){
		console.log(self.title, data);
         $.each(data.response.venues, function(i,venues){
	        // self.URL = venues.url;
	        self.lat = venues.location.lat;
			self.lng = venues.location.lng;
			self.street = venues.location.formattedAddress[0];
	     	self.city = venues.location.formattedAddress[1];
	     	self.checkinsCount = venues.stats.checkinsCount;
	      	// self.phone = venues.Cofe.phone;
	    });
			// self.extrContent =  self.street + self.city +self.checkinsCount;
			self.getContent = '<div class="window-content" style="background-color:#a0785c;padding:5px;color:#fff;text-transform:uppercase; border-radius:5px;"><div class="title"><h4>' + self.title
			    + "</h4></div>" +'<div class="extrContent"> ( '+ self.lat + ' , '+ self.lng+" ) </div>" + '<div class="extrContent"> city ->'+" "+ self.city+ "</div>" 
			    +'<div class="extrContent"> Street ->' + " " + self.street+"</div>"+'<div class="extrContent">'+ self.checkinsCount +" checkins </div></div>";
		});

        self.getContent = '<div class="window-content" style="background-color:#a0785c;padding:5px;color:#fff;text-transform:uppercase; border-radius:5px;"><div class="title"><h4>' + self.title
			    + "</h4></div>"+'<div class="extrContent">' + self.city+"</div>" +'<div class="extrContent">' 
			    + self.street+"</div>" +'<div class="extrContent">' + self.checkinsCount+"</div></div>";
	    // define infoWindow 
	    self.infoWindow = new google.maps.InfoWindow({content: self.getContent});
		// add and show markers
		self.marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.location.lat, data.location.lng),
			map: map,
			title: data.title,
		});
		// function to show markers on map
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
			// declare info window
			self.infoWindow = new google.maps.InfoWindow({
				content: self.getContent
			});
			self.infoWindow.setContent(self.getContent);
			self.infoWindow.open(map, this);
			// set marker animation 
			self.marker.setAnimation(google.maps.Animation.DROP);
		});
	};
	/* ----------------------------- model part ----------------*/
var viewCoffeModel = function() {
	var self = this;
	self.searchItem = ko.observable("");
	// define map with a fixed zoom & center 
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
	self.cofeeList = ko.observableArray([]);
	modelLocation.forEach(function(cofeeItem) {
		// body...
		self.cofeeList.push(new Cofe(cofeeItem));
	});
	this.filteredCofee = ko.computed(function() {
		// var search = self.searchItem();
		var searchFilter = self.searchItem();
		if (searchFilter === '') {
			self.cofeeList().forEach(function(cofeeItem) {
				cofeeItem.visible(true);
			});
			return self.cofeeList();
		}
	}, self);
	self.currentCofee = ko.observable(this.cofeeList[0]);
}
// start map that draw map, through taking an object from coffeModel
function startMap() {
	// activate knockout 
	ko.applyBindings(new viewCoffeModel());
}
