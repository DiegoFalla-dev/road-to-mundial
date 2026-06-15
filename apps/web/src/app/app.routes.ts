import { Routes } from '@angular/router';

/**
 * Rutas con lazy loading (carga diferida) por característica.
 * Cada vista es un componente standalone cargado bajo demanda.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    title: 'Dashboard · Road to Mundial 2026',
  },
  {
    path: 'grupos',
    loadComponent: () =>
      import('./features/standings/standings.component').then((m) => m.StandingsComponent),
    title: 'Grupos · Road to Mundial 2026',
  },
  {
    path: 'comparador',
    loadComponent: () =>
      import('./features/comparator/comparator.component').then((m) => m.ComparatorComponent),
    title: 'Comparador · Road to Mundial 2026',
  },
  {
    path: 'partido/:id',
    loadComponent: () =>
      import('./features/match/match.component').then((m) => m.MatchComponent),
    title: 'Partido · Road to Mundial 2026',
  },
  {
    path: 'seleccion/:id',
    loadComponent: () =>
      import('./features/team/team.component').then((m) => m.TeamComponent),
    title: 'Selección · Road to Mundial 2026',
  },
  { path: '**', redirectTo: '' },
];
