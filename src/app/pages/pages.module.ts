import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TarefasComponent } from './tarefas/tarefas.component';
import { DespejosCerebraisComponent } from './despejos-cerebrais/despejos-cerebrais.component';
import { SessoesFocoComponent } from './sessoes-foco/sessoes-foco.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ripple } from "primeng/ripple";
import { ButtonDirective } from "primeng/button";
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CadastrarUsuarioFormComponent } from './usuarios/cadastrar-usuario-form/cadastrar-usuario-form.component';
import { EditarUsuarioFormComponent } from './usuarios/editar-usuario-form/editar-usuario-form.component';
import { TooltipModule } from "primeng/tooltip";

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    UsuariosComponent,
    TarefasComponent,
    DespejosCerebraisComponent,
    SessoesFocoComponent,
    CadastrarUsuarioFormComponent,
    EditarUsuarioFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    Ripple,
    ButtonDirective,
    TabViewModule,
    CardModule,
    ButtonModule,
    ToastModule,
    TableModule,
    InputTextModule,
    TooltipModule
]
})
export class PagesModule { }
