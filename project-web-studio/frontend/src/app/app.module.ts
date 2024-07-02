import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { MainComponent } from './views/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatDialogModule} from '@angular/material/dialog';
import { PopupComponent } from './shared/components/popup/popup.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { PrivacyPolicyComponent } from './legal-documents/privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    PopupComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    CarouselModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AppRoutingModule,
    
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
