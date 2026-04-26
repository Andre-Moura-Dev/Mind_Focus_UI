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
    path: 'home', component: HomeComponent,
  },
  {
    path: 'usuarios', component: UsuariosComponent,
    children: [
      { path: '', component: UsuariosComponent },
      { path: 'cadastrar-usuario-form', component: CadastrarUsuarioFormComponent },
      { path: 'editar-usuario-form', component: EditarUsuarioFormComponent },
    ]
  },
  {
    path: 'tarefas', component: TarefasComponent
  },
  {
    path: 'sessoes-foco', component: SessoesFocoComponent
  },
  {
    path: 'despejos-cerebrais', component: DespejosCerebraisComponent
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
