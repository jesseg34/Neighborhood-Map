class Resturant {
    constructor(title, position, gmInstance, yelpId) {
        this.title = title;
        this.marker = new google.maps.Marker({
            position: position,
            label: title,
            map: gmInstance,
            animation: google.maps.Animation.DROP
        });
        this.infowindow = new google.maps.InfoWindow();
        this.yelpId = yelpId;
        // Called from Knockout.js
        this.markerClicked = () => { google.maps.event.trigger(this.marker, 'click'); }
    }
}