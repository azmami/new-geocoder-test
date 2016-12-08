import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MapComponent } from './maps/map.component';

const appRoutes: Routes = [
    {
        path: ':language',
        component: MapComponent
    },
    {
        path: '',
        redirectTo: '/ja',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}