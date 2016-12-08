import { Injectable } from '@angular/core';

@Injectable()
export class GeocoderService {
    private geocoder: any;

    public initialize(google: any) {
        this.geocoder = new google.maps.Geocoder();
    }

    public geocode(location: string, region: string, isNewGeocoder: boolean): Promise<any> {
        let query = {
            address: location,
            newForwardGeocoder: isNewGeocoder
        };
        if (region !== '') {
            query['region'] = region;
        }

        return new Promise<any>((resolve, reject) => {
            this.geocoder.geocode(query, (results, status) => {
                if (status == 'OK') {
                    return resolve(results);
                } else {
                    return reject(status);
                }
            });
        });
    }
} 