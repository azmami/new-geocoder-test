import { Component, ViewChild, NgZone, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { MapComponent } from './map.component';
import { GeocoderService } from './geocoder.service';

@Component({
    selector: 'search',
    template: `
    <form class="float-on-map">
        <div class="form-group box">
            <input #addressInput (keyup.enter)="geocode(addressInput.value)" 
            type="text" class="form-control" id="addressInput" 
            name="addressInput" placeholder="Input address to test">
            <small>region={{region}}</small>
        </div>
        <div class="form-group">
            <result (centerChanged)="zoomIn($event)"
             [resultsWithOldGeocoder]="resultsWithOldGeocoder" 
             [resultsWithNewGeocoder]="resultsWithNewGeocoder">
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
        background: white;
        padding: 10px;
        border-radius: 10px;  
        -webkit-border-radius: 10px;  
        -moz-border-radius: 10px;   
    }
    `]
})
export class SearchComponent implements OnChanges {
    private resultsWithNewGeocoder: Array<any> = new Array<any>();
    private resultsWithOldGeocoder: Array<any> = new Array<any>();
    @ViewChild(MapComponent)
    private mapComponent: MapComponent;
    @Input() region: string;
    @Input() address: string;
    @Output() onGeocodingStarted: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCenterChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() onMarkerAdded: EventEmitter<any> = new EventEmitter<any>();

    constructor (private _ngZone: NgZone, private geocoderService: GeocoderService) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (typeof changes['address'].currentValue !== 'undefined' && changes['address'].currentValue !== '')
            this.geocode(changes['address'].currentValue);
    }

    public geocode(location: string): void {
        this.onGeocodingStarted.emit();
        this.resultsWithNewGeocoder = new Array<any>();
        this.resultsWithOldGeocoder = new Array<any>();
        this.fireGeocode(location, this.region, true);
        this.fireGeocode(location, this.region, false);
    }

    public fireGeocode(location: string, region: string, isNewGeocoder: boolean): void {
        let iconBase = 'https://maps.google.com/mapfiles/ms/micons/';
        
        this.geocoderService.geocode(location, region, isNewGeocoder).then(results => {
            for (let index = 0; index < results.length; index++) {
                let iconUrl = isNewGeocoder ? iconBase + 'orange.png' : iconBase + 'ltblu-pushpin.png';
                let latLng = results[index].geometry.location;

                let content = `Result for ${location} `;
                if (isNewGeocoder) {
                    content += 'by <b>New</b> Geocoder<br>';
                    this.resultsWithNewGeocoder.push(results[index]);
                } else {
                    content += 'by <b>Old</b> Geocoder<br>';
                    this.resultsWithOldGeocoder.push(results[index]);
                }
                content += `latLng = (${latLng.lat()}, ${latLng.lng()})<br>`;
                content += `<small><b>formatted_address:</b> ${results[index].formatted_address}</small><br>`;
                content += `<small><b>place_id:</b> ${results[index].place_id}</small><br>`;

                this.onMarkerAdded.emit({ location: latLng, iconUrl: iconUrl, content: content });
            }
        }).catch(status => {
            console.error("error: " + status);
        });
    }

    public zoomIn(latLng: any) {
        this.onCenterChanged.emit({ center: latLng, zoom: 15});
    }

    public onRegionChanged(location: string) {
        if (location !== '') this.geocode(location);
    }
}