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
},{
	title: 'Brazilian Coffee',
	location: {
		lat: 29.954711,
		lng: 31.262176
	}
},{
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
},{
	title: 'Bi Café',
	location: {
		lat: 31.033088,
		lng: 31.357357
	}
},{
	title: 'Cavally cafe',
	location: {
		lat: 30.470441,
		lng: 31.177356
	}
},{
	title: 'SunCity cafe',
	location: {
		lat: 29.962034,
		lng: 32.548483
	}
}, ]; 
var Cofe = function(data) {
		// console.log(data);
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
		// console.log(self.title, data);
		 console.log(data);
         $.each(data.response.venues, function(i,venues){
	        // self.URL = venues.url;
	        self.lat = venues.location.lat;
			self.lng = venues.location.lng;
			self.street = venues.location.formattedAddress[0];
	     	self.city = venues.location.formattedAddress[1];
	     	self.checkinsCount = venues.stats.checkinsCount;
		    if (typeof self.city === 'undefined' || typeof self.checkinsCount === 'undefined' || typeof self.street === 'undefined'){
			  self.city = "";
			  self.street = "";
			  self.checkinsCount = "";
		    }
	     	// self.hereNow = venues.count.hereNow;
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
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: {
			lat: 30.044420,
			lng: 31.235712
		},
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
		}
	});
	self.cofeeList = ko.observableArray([]);
	// var searchFilter = self.searchItem();
	modelLocation.forEach(function(Item) {
		// body...
		self.cofeeList.push(new Cofe(Item));
	});
	this.filteredCofee = ko.computed(function() {
	    var searchFilter = self.searchItem();
		if (searchFilter === "") {
			return self.cofeeList();	
		}
		else {
			return ko.utils.arrayFilter(self.cofeeList(), function(Item) {
				var seaRESULT = Item.title.toLowerCase().search(searchFilter);
				if(seaRESULT  >= 0) {
					// console.log(seaRESULT);
					return true;
				}

                else{
                	return false ;
                }
				// return seaRESULT;
			});
		}

	}, self);
	self.currentCofee = ko.observable(this.cofeeList[0]);
	    // this function handle action on list to make the info window appera
	self.clickHandler = function (cofeeList) {
		google.maps.event.trigger(cofeeList.marker, 'click');
	};
}
// start map that draw map, through taking an object from coffeModel
function startMap() {
	// activate knockout 
	ko.applyBindings(new viewCoffeModel());
}
