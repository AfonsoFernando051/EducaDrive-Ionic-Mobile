import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { AgendaPage } from './pages/agenda/agenda.page';
import { ConfigPage } from './pages/config/config.page';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'agenda',
        component: AgendaPage
      },
      {
        path: 'config',
        component: ConfigPage
      },
      {
        path: '',
        redirectTo: 'agenda',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'config',
    loadComponent: () => import('./pages/config/config.page').then( m => m.ConfigPage)
  }
];
