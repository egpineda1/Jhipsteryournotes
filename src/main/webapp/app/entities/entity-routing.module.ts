import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'usuario',
        data: { pageTitle: 'yournotesApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'rol',
        data: { pageTitle: 'yournotesApp.rol.home.title' },
        loadChildren: () => import('./rol/rol.module').then(m => m.RolModule),
      },
      {
        path: 'direccion',
        data: { pageTitle: 'yournotesApp.direccion.home.title' },
        loadChildren: () => import('./direccion/direccion.module').then(m => m.DireccionModule),
      },
      {
        path: 'sede',
        data: { pageTitle: 'yournotesApp.sede.home.title' },
        loadChildren: () => import('./sede/sede.module').then(m => m.SedeModule),
      },
      {
        path: 'asignatura',
        data: { pageTitle: 'yournotesApp.asignatura.home.title' },
        loadChildren: () => import('./asignatura/asignatura.module').then(m => m.AsignaturaModule),
      },
      {
        path: 'reporte',
        data: { pageTitle: 'yournotesApp.reporte.home.title' },
        loadChildren: () => import('./reporte/reporte.module').then(m => m.ReporteModule),
      },
      {
        path: 'aula',
        data: { pageTitle: 'yournotesApp.aula.home.title' },
        loadChildren: () => import('./aula/aula.module').then(m => m.AulaModule),
      },
      {
        path: 'nota',
        data: { pageTitle: 'yournotesApp.nota.home.title' },
        loadChildren: () => import('./nota/nota.module').then(m => m.NotaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
