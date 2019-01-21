let map;
let currentOpenedInfoWindow = null;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        // Portland, OR
        center: { lat: 45.5122, lng: -122.6587 }
    });

    // Create the markers and add click event
    resturantData.forEach((resturant) => {
        let resturantMarker = new Resturant(resturant.title, resturant.position, map);
        resturantMarker.marker.addListener('click', () => {
            gmMarkerClicked(resturantMarker);
        });
    })
}

function gmMarkerClicked(resturantMarker) {
    if (currentOpenedInfoWindow) {
        currentOpenedInfoWindow.close();
    }
    if (!resturantMarker.infowindow.content) {
        const info = buildInfoPanel(resturantMarker.title);
        resturantMarker.infowindow.setContent(info);
    }
    resturantMarker.infowindow.open(map, resturantMarker.marker);
    currentOpenedInfoWindow = resturantMarker.infowindow;
    resturantMarker.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => {
        resturantMarker.marker.setAnimation(null);
    }, 2000);
}

function buildInfoPanel(title) {
    const content = `<div><h2>${title}</h2></div>`;
    return content;
}

