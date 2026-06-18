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
    path: 'comparador',
    loadComponent: () =>
      import('./features/comparator/comparator.component').then((m) => m.ComparatorComponent),
    title: 'Comparador · Road to Mundial 2026',
  },
  {
    path: 'partidos',
    loadComponent: () =>
      import('./features/matches-list/matches-list.component').then((m) => m.MatchesListComponent),
    title: 'Match Center · Road to Mundial 2026',
  },
  {
    path: 'equipos',
    loadComponent: () =>
      import('./features/teams-list/teams-list.component').then((m) => m.TeamsListComponent),
    title: 'Selecciones · Road to Mundial 2026',
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./features/stats/stats.component').then((m) => m.StatsComponent),
    title: 'Estadísticas · Road to Mundial 2026',
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
