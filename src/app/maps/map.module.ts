import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MapComponent } from './map.component';
import { ResultComponent } from './result.component';
import { SearchComponent } from './search.component';
import { GeocoderService } from './geocoder.service';
import { GoogleMapsAPILoader } from './google-maps-api-loader';

@NgModule({
    imports: [
        FormsModule,
        CommonModule
    ],
    declarations: [
        MapComponent,
        ResultComponent,
        SearchComponent
    ],
    providers: [
        GeocoderService,
        GoogleMapsAPILoader
    ]
})
export class MapModule {}