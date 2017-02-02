import { Component, ViewChild, NgZone, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { MapComponent } from './map.component';
import { GeocoderService } from './geocoder.service';
import { Location } from '@angular/common';

@Component({
    selector: 'search',
    template: `
    <form class="float-on-map" [style.width]="inputWidth + '%'">
        <div class="form-group box">
            <input #addressInput (keyup)="updateInputWidth(addressInput.value)"
            (keyup.enter)="geocode(addressInput.value)"
            [disabled]="isGeocodingNow"
            type="text" class="form-control" id="addressInput" 
            name="addressInput" placeholder="Input address to test">
            <small>
                API loaded with language=<b>{{language}}</b><p style="display:inline" *ngIf="region !== ''">&region=<b>{{region}}</b></p>
            </small>
        </div>
        <div class="form-group">
            <result (centerChanged)="zoomIn($event)"
             [resultsWithOldGeocoder]="resultsWithOldGeocoder" 
             [resultsWithNewGeocoder]="resultsWithNewGeocoder"
             [errorFromOldGeocoder]="errorFromOldGeocoder"
             [errorFromNewGeocoder]="errorFromNewGeocoder">
            </result>
        </div>
    </form>
    `,
    styles: [`
    .float-on-map {
        float: right;
        position: absolute;
        z-index: 3;
        margin: 1em;
    }
    .box {
        background-color: rgba(255, 255, 255, 0.8);
        padding: 10px;
        border-radius: 10px;  
        -webkit-border-radius: 10px;  
        -moz-border-radius: 10px;   
    }
    `]
})
export class SearchComponent implements OnChanges {
    private isGeocodingNow: boolean;
    private resultsWithNewGeocoder: Array<any> = new Array<any>();
    private resultsWithOldGeocoder: Array<any> = new Array<any>();
    private errorFromNewGeocoder: string = '';
    private errorFromOldGeocoder: string = '';
    private inputWidth: number = 40; // min: 40, max: 90
    private allLocations: Array<any> = new Array<any>();
    @Output() bounds: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(MapComponent) private mapComponent: MapComponent;
    @Input() region: string;
    @Input() address: string;
    @Input() language: string;
    @Output() onGeocodingStarted: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCenterChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() onMarkerAdded: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _ngZone: NgZone, private geocoderService: GeocoderService, private location: Location) {
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (typeof changes['address'].currentValue !== 'undefined' && changes['address'].currentValue !== '')
            this.geocode(changes['address'].currentValue);
    }

    public geocode(location: string): void {
        if (location.length === 0) return; // if empty string provided, do nothing

        this.isGeocodingNow = true;
        this.allLocations = new Array<any>();
        // replace zenkaku space with +
        let zenkakuSpaceRemoved = location.replace(/　/g, '+');
        // and then replace hankaku space with +
        let spaceRemoved = zenkakuSpaceRemoved.replace(/ /g, '+');
        if (this.region !== '') {
            this.location.go(`/${this.language};region=${this.region};address=${spaceRemoved};`);
        } else {
            this.location.go(`/${this.language};address=${spaceRemoved};`);
        }
        this.onGeocodingStarted.emit();
        this.resultsWithNewGeocoder = new Array<any>();
        this.resultsWithOldGeocoder = new Array<any>();
        this.errorFromNewGeocoder = '';
        this.errorFromOldGeocoder = '';
        console.log("FIRING GEOCODER=======================")
        this.fireGeocode(location, true).then(() => {
            this.fireGeocode(location, false).then(() => {
                console.log("DONE=======================");
                this.isGeocodingNow = false;
                this.getNorthEastSouthWest().then((northEastSouthWest) => {
                    this.bounds.emit(northEastSouthWest);
                });
            });
        });
    }

    public fireGeocode(location: string, isNewGeocoder: boolean): Promise<any> {
        let iconBase = 'https://maps.google.com/mapfiles/ms/micons/';
        console.log((isNewGeocoder? "NEW GEOCODER" : "OLD GEOCODER") + " | QUERYING: [" + location + "]");
        return new Promise<any>((resolve, reject) => this.geocoderService.geocode(location, isNewGeocoder).then((result) => {
            console.log(result);
            for (let index = 0; index < result.results.length; index++) {
                let iconUrl = isNewGeocoder ? iconBase + 'orange.png' : iconBase + 'ltblu-pushpin.png';
                let latLng = result.results[index].geometry.location;

                this.allLocations.push(latLng);

                let content = `Result for ${location} `;
                if (isNewGeocoder) {
                    content += 'by <b>New</b> Geocoder<br>';
                    this.resultsWithNewGeocoder.push(result.results[index]);
                } else {
                    content += 'by <b>Old</b> Geocoder<br>';
                    this.resultsWithOldGeocoder.push(result.results[index]);
                }
                content += `latLng = (${latLng.lat()}, ${latLng.lng()})<br>`;
                content += `<small><b>formatted_address:</b> ${result.results[index].formatted_address}</small><br>`;
                content += `<small><b>place_id:</b> ${result.results[index].place_id}</small><br>`;

                this.onMarkerAdded.emit({ location: latLng, iconUrl: iconUrl, content: content });
                if (index == result.results.length - 1) resolve();
            }
        }).catch((result) => {
            if(isNewGeocoder) {
                this.errorFromNewGeocoder = result.status;
            } else {
                this.errorFromOldGeocoder = result.status;
            }
            resolve();
        }));
    }

    public zoomIn(latLng: any) {
        this.onCenterChanged.emit({ center: latLng, zoom: 15 });
    }

    public updateInputWidth(location: string) {
        if (location.length > 30 && this.inputWidth === 40) {
            this.inputWidth = 60;
        } else if (location.length > 60 && this.inputWidth === 60) {
            this.inputWidth = 90;
        } else if (location.length === 0) {
            this.inputWidth = 40; // change back to default
        }
    }

    public getNorthEastSouthWest(): Promise<any> {
        let north, south, east, west = 0;
        return new Promise<any>((resolve, reject) => {
            for (let index = 0; index < this.allLocations.length; index++) {
                let latLng = this.allLocations[index];
                if (index === 0) {
                    north = latLng.lat();
                    south = latLng.lat();
                    east = latLng.lng();
                    west = latLng.lng();
                } else {
                    if (south >= latLng.lat()) south = latLng.lat();
                    if (north <= latLng.lat()) north = latLng.lat();
                    if (west >= latLng.lng()) west = latLng.lng();
                    if (east <= latLng.lng()) east = latLng.lng();
                }
                if (index === this.allLocations.length - 1) {
                    return resolve({
                        northEast: { lat: north, lng: east },
                        southWest: { lat: south, lng: west }
                    });
                }
            }
        });
    }
}