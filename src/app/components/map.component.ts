import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'map',
    templateUrl: '../templates/map.component.html',
    styleUrls: ['../styles/map.component.css'],
})
export class MapComponent implements OnChanges {
    @Input() center: any;
    @Input() zoom: number;
    @Input() google: any;
    private map: any = null;
    private openInfoWindow: any = null;
    private markers: Array<any> = new Array<any>();

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (typeof changes['google'].currentValue !== 'undefined') {
            this.google = changes['google'].currentValue;
            let map = new this.google.maps.Map(document.getElementById('map'), {
                center: changes['center'].currentValue,
                zoom: changes['zoom'].currentValue,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: this.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: this.google.maps.ControlPosition.TOP_RIGHT
                }
            });
            this.map = map;
        } 
    }
    public addMarkerWithInfoWindow(location: any, iconUrl: any, content: string) {
        let marker = new this.google.maps.Marker({
            position: location,
            icon: iconUrl,
            animation: this.google.maps.Animation.DROP,
            map: this.map
        });

        let infoWindow = new this.google.maps.InfoWindow({
            content: content
        });

        marker.addListener('click', () => {
            if (this.openInfoWindow != null) this.openInfoWindow.close();
            infoWindow.open(this.map, marker);
            this.openInfoWindow = infoWindow;
            this.zoomIn(marker.position, 15);
        });

        this.markers.push(marker);
    }

    public zoomIn(location: any, zoomLevel: number) {
        this.map.setCenter(location);
        this.map.setZoom(zoomLevel);
    }

    public clearAllMarkers() {
        for (let marker of this.markers) {
            marker.setMap(null);
        }
    }
}