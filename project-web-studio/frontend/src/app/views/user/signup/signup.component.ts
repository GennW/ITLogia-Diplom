import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response';
import { LoginResponseType } from 'src/types/login-response';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  privacyLink = `${window.location.protocol}//${window.location.hostname}`;
  personalLink = `${window.location.protocol}//${window.location.hostname}`;
  private subscription: Subscription = new Subscription;




  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я\- ]+$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  })

  constructor(private fb: FormBuilder, private authService: AuthService,
    private _snackBar: MatSnackBar, private router: Router) {

  }

  ngOnInit(): void {
    this.initPrivacyLink();
    this.initPersonalLink();
  }



  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    console.log('unsubscribe main-component');
  }

  initPrivacyLink(): void {
    if (!environment.production) {
      this.privacyLink += `:${window.location.port}`
    }
    this.privacyLink += '/privacy-policy?section=privacy';
  }
  initPersonalLink(): void {
    if (!environment.production) {
      this.personalLink += `:${window.location.port}`
    }
    this.personalLink += '/privacy-policy?section=personal';
  }

  signUp() {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password
      && this.signupForm.value.agree) {
      this.subscription.add(this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка регистрации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            //set tokens
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this._snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка регистрации')

            }
          }
        }));
    }
  }


}
