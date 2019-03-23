import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { GooglePlacesDirective } from './google-places.directive';

@NgModule({
  declarations: [
    AppComponent,
    GooglePlacesDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyAgrlemDoPXy0kJz67REKAc704J0edHMF4',
        libraries: ["places", "geometry"]
    })   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
