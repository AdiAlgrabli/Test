import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { filter, catchError, tap, map, switchMap } from 'rxjs/operators';
///<reference types="@types/googlemaps" />

@Injectable({
    providedIn: 'root'
})
export class GeoLocationService {

    public coordinates: any;
    private geocoder: any;

    public geocodeAddress(locationInput: string): Observable<any> {
        this.geocoder = new google.maps.Geocoder();
        return new Observable(observer => { 
            if(this.geocoder){
                this.geocoder.geocode({ 'address': locationInput }, (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                        observer.next({
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng()
                        });
                    } else {
                        console.log('Error - ', results, ' & Status - ', status);
                        observer.next({ lat: 0, lng: 0 });
                    }
                    observer.complete();
                });
            }
        })
    }



    // public getPosition(): Observable<Position> {
    //     return Observable.create(
    //         (observer) => {
    //             navigator.geolocation.watchPosition((pos: Position) => {
    //                 observer.next(pos);
    //             }),
    //                 () => {
    //                     console.log('Position is not available');
    //                 },
    //                 {
    //                     enableHighAccuracy: true
    //                 };
    //         }
    //     )
    // }
}
