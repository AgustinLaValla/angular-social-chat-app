import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeoLocationService {
    constructor(private http: HttpClient) { }

    getGeoLocation() {
        return this.http.get('https://ipapi.co/json/').pipe(
            switchMap((resp) =>
                this.http.put(`${environment.URL}/user/set-location`, { city: resp['city'], country: resp['country_name'] })
            )
        )
    }

}