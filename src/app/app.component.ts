import { Component, OnInit, NgZone } from '@angular/core';
import { GeoLocationService } from './services/geo-location.service';
import { MarketsService } from './services/markets.service';
import { Market } from './models/market';
// import { FormControl } from '@angular/forms';
// import { MapsAPILoader } from '@agm/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public latitude: number = 51.67841;
    public longitude: number = 7.809007;
    public locationWasChosen: boolean = false;

    public title: string = "Places";
    public addrKeys: string[];
    public addr: object;
    public marketBrands: Market[];
    public distArr: number[];
    public distArrBool: boolean = false;

    //public marketAddresses: 

    //   @ViewChild("search") 
    //   public searchElementRef: ElementRef;

    // coordinates: any;
    // coordinates2: {
    //     latitude: number,
    //     longitude: number
    // };

    constructor(
        // private geoLocationService: GeoLocationService,
        // private mapsAPILoader,
        // private ngZone: NgZone
        private zone: NgZone,
        private marketService: MarketsService

    ) { }

    ngOnInit() {

        // Get the market brand names
        this.marketService.getMarketBrandsList().subscribe(
            (markets: Market[]) => {
                this.marketBrands = markets;              
            });
        //   this.geoLocationService.getPosition().subscribe (
        //       (pos: Position) => {
        //           this.coordinates = {
        //               latitude: pos.coords.latitude,
        //               longitude: pos.coords.longitude
        //           };
        //           console.log("Current coordinates: " + this.coordinates.latitude + ", " + this.coordinates.longitude);
        //       }
        //   );

        this.marketService.getAllBrandsAddresses();
    }

    onChoseLocation(event) {
        this.latitude = event.coords.lat;
        this.longitude = event.coords.lng;
        this.locationWasChosen = true;
    }

    setAddress(addrObj) {
        //We are wrapping this in a zone method to reflect the changes
        //to the object in the DOM.
        this.zone.run(() => {
            this.addr = addrObj;
            this.addrKeys = Object.keys(addrObj);

            this.distArr = this.marketService.calculateDistFromUserAddress(this.addr);
            this.distArrBool = true;
        });
    }
}
