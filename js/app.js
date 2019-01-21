let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        // Portland, OR
        center: { lat: 45.5122, lng: -122.6587 }
    });
    resturantData.forEach((resturant) => {
        new Resturant(resturant.title, resturant.position, map);
    })
}

