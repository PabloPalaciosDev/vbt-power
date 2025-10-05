import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'vbt',
    loadComponent: () => import('./vbt/vbt.page').then((m) => m.VbtPage),
  },
  {
    path: 'vbt-config',
    loadComponent: () => import('./vbt-config/vbt-config.page').then((m) => m.VbtConfigPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
