import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { MainComponent } from './views/main/main.component';
import { PrivacyPolicyComponent } from './legal-documents/privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      { path: 'privacy-policy', component: PrivacyPolicyComponent }, // Добавление маршрута для PrivacyPolicyComponent
      {path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)},
      {path: '', loadChildren: () => import('./views/article/article.module').then(m => m.ArticleModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
