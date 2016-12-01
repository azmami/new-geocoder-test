import { Injectable } from '@angular/core';

const url = 'https://maps.googleapis.com/maps/api/js?callback=__MapsAPILoaded';

@Injectable()
export class GoogleMapsAPILoader {
   private loadAPIPromise: Promise<any>;
   constructor(private apiKey: string, private version: string) {
      this.loadAPIPromise = new Promise(resolve => {
         window['__MapsAPILoaded'] = () => {
            resolve(window['google']);
         };
         this.loadScript();
      });
   }

   public loadAPI() {
      return this.loadAPIPromise.then(google => {
         return google;
      });
   }

   private loadScript() {
      let node = document.createElement('script');
      node.src = url + `&key=${this.apiKey}&v=${this.version}&language=ja` ;
      node.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(node);
   }
}