import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'result',
    templateUrl: '../templates/result.component.html',
    styleUrls: ['../styles/result.component.css'],
})
export class ResultComponent {
    @Input() resultsWithOldGeocoder: Array<any>;
    @Input() resultsWithNewGeocoder: Array<any>;
    @Output() centerChanged: EventEmitter<any> = new EventEmitter<any>();

    public zoomIn(latLng: any) {
        this.centerChanged.emit(latLng);
    }
} 