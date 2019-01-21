let map;
let currentOpenedInfoWindow = null;

// Called by the google api
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        // Portland, OR
        center: { lat: 45.5122, lng: -122.6587 }
    });

    ko.applyBindings(new ViewModel());
}

// Fetch the yelp info if not already and show the info window
async function gmMarkerClicked(resturantMarker) {
    let yelpInfo;

    if (currentOpenedInfoWindow) {
        currentOpenedInfoWindow.close();
    }

    if (!resturantMarker.infowindow.content) {
        const fetchYelpInfo = fetchYelpInformation(resturantMarker.yelpId);
        try {
            yelpInfo = await fetchYelpInfo;
        } catch (err) {
            console.log(err);
            return alert('There was a problem fetching the yelp data. Please try again later.');
        }
        const info = buildInfoWindow(
            resturantMarker.title, 
            yelpInfo.rating, 
            yelpInfo.location.display_address);
        resturantMarker.infowindow.setContent(info);
    }

    // Open the info window and animate marker
    resturantMarker.infowindow.open(map, resturantMarker.marker);
    currentOpenedInfoWindow = resturantMarker.infowindow;
    resturantMarker.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => {
        resturantMarker.marker.setAnimation(null);
    }, 2000);
}

// Generate the html for the info window
function buildInfoWindow(title, rating, displayAddress) {
    const content = `<div><h2>${title}</h2>
        Yelp: ${rating} out of 5 <br />
        Address: ${displayAddress[0]} <br />
        ${displayAddress[1]} <br />
        </div>`;
    return content;
}

function fetchYelpInformation(yelpId) {
    const access_token = 'jBnjZ7DSRcNbIs_m3zqS0cxmB910Kb-13shJTO8ZTUiSKQxpL-zLGKzHcs0xnFwYyvZ9aduzO36vJq6CL4RAT3FLn5fA1nKANo2ByIWuPETeJ1rn-Yq9t2wSRufhW3Yx';
    const results = jQuery.ajax({
        url: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/' + yelpId,
        type: 'GET',
        headers: {
            'Authorization': 'BEARER ' + access_token
        },
    });
    return results;
}

function ViewModel () {
    let self = this;

    self.resturants = ko.observableArray();
    self.activeLocation = ko.observable();
    self.search = ko.observable('');

    // Create the markers and add click event
    resturantData.forEach((resturant) => {
        let resturantMarker = new Resturant(
            resturant.title,
            resturant.position,
            map,
            resturant.yelpId);
        resturantMarker.marker.addListener('click', () => {
            gmMarkerClicked(resturantMarker);
        });

        // Add marker to the observable
        self.resturants.push(resturantMarker);
    });

    // Compare the search bar with the resturants on each search keypress
    self.searchResults = ko.computed(() => {
        return this.resturants().filter((resturant) => {
            var isMatched = resturant.title.toLowerCase().includes(this.search().toLowerCase());
            resturant.marker.setVisible(isMatched);
            return isMatched;
        }, this);
    }, this);
}

function gmError() {
    alert("There was a problem loading google maps. Please try again later.");
}