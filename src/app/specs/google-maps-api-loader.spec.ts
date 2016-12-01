import { TestBed, async } from '@angular/core/testing';
import { GoogleMapsAPILoader } from '../google-maps-api-loader';

describe('Google Maps API Loader Test', () => {
    it('should load Google Maps API to app', done => {
        let loader = new GoogleMapsAPILoader('AIzaSyCk-1ljJ7MENzb793QoOnxMXiXOJE0TOW4', '3.exp');
        loader.loadAPI().then((google) => {
            expect(google.maps.TravelMode.WALKING).toBe('WALKING');
            done();
        });
    });
});