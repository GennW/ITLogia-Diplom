import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DefaultResponseType } from 'src/types/default-response';
import { LoginResponseType } from 'src/types/login-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private subscription: Subscription = new Subscription;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  })

  constructor(private fb: FormBuilder, private authService: AuthService,
    private _snackBar: MatSnackBar, private router: Router
  ) { }

  ngOnInit(): void {
  }
     

  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    console.log('unsubscribe login-component');
  }


  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.subscription.add(this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;

            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken
              || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            //set tokens
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            

            this._snackBar.open('Вы успешно авторизовались');
            this.router.navigate(['/'])

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка авторизации')
            }
          }
        }));
    }
  }

}
