import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DefaultResponseType } from 'src/types/default-response';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userName: string = '';
  private subscription: Subscription = new Subscription();
  
  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    // запрашиваем первоначальное состояние пользователя
    this.isLogged = this.authService.getIsLogIn();
  }

  ngOnInit(): void {
    // актуальное состояние пользователя
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });
    
    
    if (this.isLogged) {
      this.authService.getUserName().subscribe({
        next: (userData: { id: string; name: string; email: string }) => {
          // получаем имя пользователя
          this.userName = userData.name;
          console.log('HEADER userData.id===',userData.id, userData.name)
        },
        error: () => {
          this.authService.removeTokens();
          throw new Error('Ошибка с токенами')
        }
      });
    }
  }
 
  

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    console.log('unsubscribe header-component');
  }


  logout(): void {
   this.subscription.add(this.authService.logout().subscribe({
      next: (data: DefaultResponseType) => {
        // если успешно вышли из системы
        this.doLogout();
      },
      error: () => {
        this.doLogout();
      },
    }));
  }

  doLogout(): void {
    // если успешно вышли из системы
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
