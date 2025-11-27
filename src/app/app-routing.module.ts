import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/landing-page/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'chat',
        loadChildren: () => import('./features/chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'mail',
        loadChildren: () => import('./features/mail/mail.module').then((m) => m.MailModule),
      },
      {
        path: 'calendar',
        loadChildren: () => import('./features/calendar/calendar.module').then((m) => m.CalendarModule),
      },
      {
        path: 'knowledge',
        loadChildren: () => import('./features/knowledge/knowledge.module').then((m) => m.KnowledgeModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

