import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Market } from '../models/market';
import { HttpClient } from '@angular/common/http';
import { GeoLocationService } from './geo-location.service';

@Injectable({
    providedIn: 'root'
})
export class MarketsService {

    private marketBrands: Market[];
    public coords: any[] = [];
    public distances: number[] = [];

    constructor(
        private httpClient: HttpClient,
        private geoLocationService: GeoLocationService
    ) { }

    public getMarketBrandsList(): Observable<Market[]> {
        return this.httpClient.get<Market[]>("/assets/json/markets.json");
    }

    public calculateDistFromUserAddress(userCoords: any): number[] {
        //google.maps.geometry.spherical.computeDistanceBetween(place.geometry.location, london);
        let dist: number;
        for (let i = 0; i < this.coords.length; i++) {
            dist = google.maps.geometry.spherical.computeDistanceBetween(userCoords, this.coords[i]);
            this.distances.push(dist);
        }  
        this.distances.sort((a, b) => a - b);    
        return this.distances;
    }

    public getAllBrandsAddresses() {
        this.getMarketBrandsList().subscribe(
            (markets: Market[]) => {
                this.marketBrands = markets;

                for (let i = 0; i < this.marketBrands.length; i++) {
                    this.findCoordsOfAddress(this.marketBrands[i].address);                   
                }
            });
    }

    public findCoordsOfAddress(address: string) {
        this.geoLocationService.geocodeAddress(address)
            .subscribe((location) => {
                let coord = new google.maps.LatLng(location.lat, location.lng);
                this.coords.push(coord);
            });
    }

}
