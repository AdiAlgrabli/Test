/// <reference types="@types/googlemaps" />
import { Directive, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import { GeoLocationService } from './services/geo-location.service';
import { Market } from './models/market';
import { MarketsService } from './services/markets.service';


@Directive({
    selector: '[google-place]'
})
export class GooglePlacesDirective implements OnInit {

    @Output()
    public onSelect: EventEmitter<any> = new EventEmitter();

    private element: HTMLInputElement;
    public location: any;
    public marketBrands: Market[];

    constructor (
        private el: ElementRef,
        private geoLocationService: GeoLocationService,
        private marketService: MarketsService
    ) {
        this.element = el.nativeElement;
    }

    ngOnInit() {
        const autocomplete = new google.maps.places.Autocomplete(this.element)
        google.maps.event.addListener(
            autocomplete,
            'place_changed',
            () => {
                this.onSelect.emit(this.getFormattedAddress(autocomplete.getPlace()));
            }
        );

        this.marketService.getMarketBrandsList().subscribe (
            (markets: Market[]) => {
                this.marketBrands = markets;
            })
    }

    // to get the place's coordinates
    // var lat = place.geometry.location.lat();
    // var lng = place.geometry.location.lng();

    public displayAddresses(place) {       
        this.marketService.calculateDistFromUserAddress(place.geometry.location);
    }

    public getFormattedAddress(place) {
        //@params: place - Google Autocomplete place object
        //@returns: location_obj - An address object in human readable format
        const london = new google.maps.LatLng(51.506, -0.119);
        let location_obj = {};
        let myCoords = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
        for (let i in place.address_components) {
            let item = place.address_components[i];

            location_obj['formatted_address'] = place.formatted_address; // formatted_address: "New York, NY, USA"
            if (item['types'].indexOf("locality") > -1) {
                location_obj['locality'] = item['long_name']
            } else if (item['types'].indexOf("administrative_area_level_1") > -1) {
                location_obj['admin_area_l1'] = item['short_name']
            } else if (item['types'].indexOf("street_number") > -1) {
                location_obj['street_number'] = item['short_name']
            } else if (item['types'].indexOf("route") > -1) {
                location_obj['route'] = item['long_name']
            } else if (item['types'].indexOf("country") > -1) {
                location_obj['country'] = item['long_name']
            } else if (item['types'].indexOf("postal_code") > -1) {
                location_obj['postal_code'] = item['short_name']
            }
        }
        location_obj['distanceFromLondon'] = google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, london);
        location_obj['latCoord'] = place.geometry.location.lat();
        location_obj['lngCoord'] = place.geometry.location.lng();

        // location_obj['distanceFromLondon'] = google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, london);
        //return location_obj;
        return myCoords;
    }
}