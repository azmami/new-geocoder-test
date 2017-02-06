import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'result',
    template: `
    <div class="result-box">
        <label class="tag tag-pill tag-info">OLD Geocoder</label> 
        <span class="seconds">{{oldGeocoderElapsedTime}} seconds</span>
        <ul class="results">
            <li (click)="zoomIn(result.geometry.location)" *ngFor="let result of resultsWithOldGeocoder">
                <small (click)="zoomIn(result.geometry.location)">{{result.formatted_address}}</small>
            </li>
        </ul>
        <span *ngIf="errorFromOldGeocoder" class="error">ZERO_RESULTS</span>
        <hr>
        <label class="tag tag-pill tag-warning">NEW Geocoder</label>
        <span class="seconds">{{newGeocoderElapsedTime}} seconds</span>
        <ul class="results">
            <li (click)="zoomIn(result.geometry.location)" *ngFor="let result of resultsWithNewGeocoder">
                <small>{{result.formatted_address}}</small>
            </li>
        </ul>
        <span *ngIf="errorFromNewGeocoder" class="error">ZERO_RESULTS</span>
    </div>
    `,
    styles: [`
    .result-box {
        background-color: rgba(255, 255, 255, 0.8);
        padding: 10px;
        border-radius: 10px;  
        -webkit-border-radius: 10px;  
        -moz-border-radius: 10px; 
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    .results li {
        cursor: pointer;
        border-radius: 4px;
    }
    .results li.selected:hover {
        background-color: #BBD8DC !important;
        color: white;
    }
    .results li:hover {
        color: #607D8B;
        background-color: #DDD;
        left: .1em;
    }
    .error {
        font-size: 0.8em;
        color: red;
    }
    .seconds { 
        font-size: 0.7em;
        font-style: italic;
    }
    `]
})
export class ResultComponent {
    @Input() resultsWithOldGeocoder: Array<any>;
    @Input() resultsWithNewGeocoder: Array<any>;
    @Input() errorFromOldGeocoder: string;
    @Input() errorFromNewGeocoder: string;
    @Input() oldGeocoderElapsedTime: number;
    @Input() newGeocoderElapsedTime: number;
    @Output() centerChanged: EventEmitter<any> = new EventEmitter<any>();

    public zoomIn(latLng: any): void {
        this.centerChanged.emit(latLng);
    }
} 