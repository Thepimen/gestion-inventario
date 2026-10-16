/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Configuración de Enrutamiento Principal:
 * - '' -> Redirige por defecto a 'registro'
 * - 'registro' -> RegistroPage (Formulario Reactivo / Model-Driven)
 * - 'driven' -> DrivenPage (Formulario Template-Driven / FormsModule)
 * - 'inventario' -> InventarioFormComponent (Gestión de Inventario WMS)
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'registro',
    pathMatch: 'full',
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./registro/registro.page').then((m) => m.RegistroPage),
  },
  {
    path: 'driven',
    loadComponent: () =>
      import('./driven/driven.page').then((m) => m.DrivenPage),
  },
  {
    path: 'inventario',
    loadComponent: () =>
      import('./components/inventario-form/inventario-form.component').then(
        (m) => m.InventarioFormComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'registro',
    pathMatch: 'full',
  },
];
