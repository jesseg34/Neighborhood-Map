class Resturant {
    constructor(title, position, gmInstance) {
        this.title = title;
        this.marker = new google.maps.Marker({
            position: position,
            label: title,
            map: gmInstance,
            animation: google.maps.Animation.DROP
        });
        this.infowindow = new google.maps.InfoWindow();
    }
}