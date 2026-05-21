import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { TarefasComponent } from './pages/tarefas/tarefas.component';
import { SessoesFocoComponent } from './pages/sessoes-foco/sessoes-foco.component';
import { DespejosCerebraisComponent } from './pages/despejos-cerebrais/despejos-cerebrais.component';
import { AuthGuard } from './guards/auth.guard';
import { CadastrarUsuarioFormComponent } from './pages/usuarios/cadastrar-usuario-form/cadastrar-usuario-form.component';
import { EditarUsuarioFormComponent } from './pages/usuarios/editar-usuario-form/editar-usuario-form.component';

const routes: Routes = [
  
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: UsuariosComponent
      },
      {
        path: 'cadastrar-usuario-form',
        component: CadastrarUsuarioFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'editar-usuario-form',
        component: EditarUsuarioFormComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'tarefas', component: TarefasComponent, canActivate: [AuthGuard]
  },
  {
    path: 'sessoes-foco', component: SessoesFocoComponent, canActivate: [AuthGuard]
  },
  {
    path: 'despejos-cerebrais', component: DespejosCerebraisComponent, canActivate: [AuthGuard]
  },
  {
    path: '**', redirectTo: 'login'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
