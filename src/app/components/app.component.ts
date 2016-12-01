import { Component, NgZone, Input, ViewChild, OnInit } from '@angular/core';
import { GoogleMapsAPILoader } from '../google-maps-api-loader';
import { MapComponent } from './map.component';
import { GeocoderService } from '../services/geocoder.service';
/*
import { Router, Params, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
*/

@Component({
  selector: 'app-root',
  templateUrl: '../templates/app.component.html',
  styleUrls: ['../styles/app.component.css'],
  providers: [GeocoderService] //, ActivatedRoute]
})
export class AppComponent implements OnInit {
  private apiLoader: GoogleMapsAPILoader;
  private google: any;
  private resultsWithNewGeocoder: Array<any> = new Array<any>();
  private resultsWithOldGeocoder: Array<any> = new Array<any>();
  private markers: Array<any> = new Array<any>();
  private centerLocation: any;
  private zoomLevel: number;
  //private address: Observable<string>;

  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  private region: boolean = true;

  constructor(private _ngZone: NgZone, private geocoderService: GeocoderService) { //, private route: ActivatedRoute) {

    this.apiLoader = new GoogleMapsAPILoader('AIzaSyCAvlq4lkpxhovrO2khvJv9dAZHMsNY1g0', '3.exp');
    this.apiLoader.loadAPI().then(google => {
      this.google = google;
      this.centerLocation = { lat: 35.664, lng: 139.729 }; // Roppongi, by default
      this.zoomLevel = 5;
      this.geocoderService.initialize(google);
    });
  }

  ngOnInit() {
    //this.address = this.route.params.switchMap((params: Params, index: number) => {
     // console.log(params['address']);
     // return params['address']
    //});
  }

  public geocode(location: string) {
    this.mapComponent.clearAllMarkers();
    this.resultsWithNewGeocoder = new Array<any>();
    this.resultsWithOldGeocoder = new Array<any>();
    this.fireGeocode(location, this.region, true);
    this.fireGeocode(location, this.region, false);
  }

  public fireGeocode(location: string, region: boolean, isNewGeocoder: boolean) {
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

        this.mapComponent.addMarkerWithInfoWindow(latLng, iconUrl, content);
      }
    }).catch(status => {
      // error handling?
    });
  }

  public updateResult(resultMessage: string, isNewGeocoder: boolean) {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.run(() => {
        
      });
    });
  }

  public zoomIn(latLng: any) {
    this.mapComponent.zoomIn(latLng, 15);
  }
  
  public onRegionChanged(location: string) {
    this.region = !this.region;
    if (location !== '') this.geocode(location);
  }
}
