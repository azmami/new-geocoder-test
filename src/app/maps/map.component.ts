import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GoogleMapsAPILoader } from './google-maps-api-loader';
import { GeocoderService } from './geocoder.service';

@Component({ 
    template: `
        <search 
        (onGeocodingStarted)="clearAllMarkers($event)"
        (onCenterChanged)="zoomIn($event.center, $event.zoom)"
        (onMarkerAdded)="addMarkerWithInfoWindow($event.location, $event.iconUrl, $event.content)"
        (bounds)="onBoundsChanged($event)"
        [address]="address"
        [region]="region"
        [language]="language"></search>
        <div id="map"></div>
    `,
    styles: [`
    #map {
        height: 100%;
        width: 100%;
    }
    `]
})
export class MapComponent implements OnInit {
    private center: any;
    private zoom: number;
    private google: any;
    private map: any = null;
    private openInfoWindow: any = null;
    private markers: Array<any> = new Array<any>();
    private apiLoader: GoogleMapsAPILoader;
    private region: string;
    private address: string;
    private language: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private geocoderService: GeocoderService
    ) {}

    ngOnInit() {
        this.region = typeof this.route.params['value'].region !== 'undefined' ? 
            this.route.params['value'].region : '';
        this.language = this.route.params['value'].language;        
        this.apiLoader = new GoogleMapsAPILoader(
            this.language,
            this.region,
            'AIzaSyCAvlq4lkpxhovrO2khvJv9dAZHMsNY1g0',
            '3.exp');
        this.apiLoader.loadAPI().then(google => {
            this.google = google;
            this.geocoderService.initialize(google);
            this.center = { lat: 35.664, lng: 139.729 }; // Roppongi, by default
            this.zoom = 5;
            let map = new this.google.maps.Map(document.getElementById('map'), {
                center: this.center,
                zoom: this.zoom,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: this.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: this.google.maps.ControlPosition.TOP_RIGHT
                }
            });
            this.map = map;
            if (typeof this.route.params['value'].address !== 'undefined') {
                this.address = this.route.params['value'].address;
            } else {
                this.address = '';
            }
        });
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
            this.zoomIn(marker.position, 13);
        });

        this.markers.push(marker);
    }

    public zoomIn(location: any, zoomLevel: number) {
        this.map.setCenter(location);
        this.map.setZoom(zoomLevel);
    }

    public clearAllMarkers(event: any) {
        for (let marker of this.markers) {
            marker.setMap(null);
        }
    }
    
    public onBoundsChanged(updatedBound: any) {
        this.map.fitBounds(
            new this.google.maps.LatLngBounds(updatedBound['southWest'], updatedBound['northEast']));
    }
}