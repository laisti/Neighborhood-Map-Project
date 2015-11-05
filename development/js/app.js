// Model
var attractions = ko.observableArray ([
    {
        name: "Central Park",
        position: {
            lat: 40.7828647,
            lng: -73.9675491
        }
    },
    {
        name: "Empire State Building",
        position: {
            lat: 40.7484404,
            lng: -73.9878494
        }
    },
    {
        name: "Rockfeller Center",
        position: {
            lat: 40.7587402,
            lng: -73.9808676
        }
    },
    {
        name: "Times Square",
        position: {
            lat: 40.758895,
            lng: -73.987325
        }
    },
    {
        name: "American Museum of Natural History",
        position: {
            lat: 40.7813241,
            lng: -73.9761822
        }
    },
    {
        name: "Museum of Modern Art",
        position: {
            lat: 40.7614327,
            lng: -73.9798156
        }
    },
    {
        name: "Columbus Circle",
        position: {
            lat: 40.7680441,
            lng: -73.9845662
        }
    }
]);

var map, infowindow, marker;
var markers = ko.observableArray();

// Draw the map and markers on the webpage
function initialize() {
    var centerLatLng = new google.maps.LatLng(40.7680441, -73.9845662);
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: centerLatLng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(mapCanvas, mapOptions);
    infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < attractions().length; i++) {
        createMarker(attractions()[i].position, attractions()[i].name);
        clickMarker(markers()[i], markers()[i].title);
    }
}

// Error handling if Google Map is not available
if (typeof google !== 'undefined') {
    google.maps.event.addDomListener(window, 'load', initialize);
} else {
    $('#map').html('<h4>Oops...There are errors when retrieving map data. Please try refresh page later.</h4>');
}

// Create marker object and collect it in the markers array
var createMarker = function(attractionPosition, attractionName) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(attractionPosition),
        title: attractionName,
        animation: google.maps.Animation.DROP,
        map: map
    });
    markers.push(marker);
};

// Set animation to marker and open infowindow with Wikipedia link when the marker is clicked
var clickMarker = function (markerObj, markerObjTitle) {
    google.maps.event.addListener(markerObj, 'click', (function(markerObj) {
        return function() {
            markerObj.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {markerObj.setAnimation(null);}, 725);

            getWikiRecourse(markerObj, markerObjTitle);

            // Close infowindow if marker become hidden
            google.maps.event.addListenerOnce(markerObj, "visible_changed", function() {
                infowindow.close();
            });
        };
    })(markerObj));
};

// Use Wikipedia API to receive data asynchronously
var getWikiRecourse = function(markerObject, markerTitle) {
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + markerTitle + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
        infowindow.setContent("Wikipedia Article Could Not Be Loaded. Please try request data later.");
        infowindow.open(map, markerObject);
    }, 2000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function (response) {
            var articleStr = response[0];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            content = url;
            infowindow.setContent('<h4>' + articleStr + '</h4>' + '<a href="' + content + '" target="_blank">' + 'Wikipedia Link to ' + articleStr + '</a>');
            infowindow.open(map, markerObject);
            clearTimeout(wikiRequestTimeout);
        }
    });
};

// ViewModel
var ViewModel = function() {
    var self = this;

    self.locations = markers;
    self.query = ko.observable('');

    // Bind the item in list with marker on the map when item is clicked
    self.clickHandler = function(data) {
        google.maps.event.trigger(data, 'click');
    };

    // Receive user input from searchBar and filter the list and markers on the map
    self.search = ko.computed(function(){
        return ko.utils.arrayFilter(self.locations(), function(location){
            var doesMatch = location.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
            location.setVisible(doesMatch);
            return doesMatch;
        });
    });
};

// Create new object of ViewModel()
var viewModel = new ViewModel();

// Make bindings between Model and View
ko.applyBindings(viewModel);
