import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Usuario } from '../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { 
  applyTheme, 
  chargeThemePreferences, 
  switchActualTheme 
} from '../../utils/TrocarTema';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  public listarTodos: any;
  public listarPorEmail: any;
  public listarPorId: any;
  filtro: string = '';
  actualTheme = 'light';
  themeIcon = '';

  listaUsuariosMockados: Usuario[] = [
    { idUsuario: 0, nome: 'André Oliveira', email: 'andreteste@email.com' },
    { idUsuario: 1, nome: 'Maria Silva', email: 'mariateste@email.com' },
    { idUsuario: 2, nome: 'João Santos', email: 'joaosantos@email.com' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appComponent: AppComponent,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.actualTheme = chargeThemePreferences();
    this.themeIcon = applyTheme(this.actualTheme)
  }

  getUsuarioLogado() {
    
  }

  getListarTodos() {
    this.appComponent.loadingSpinner = true;
  }

  getListarPorEmail() {
    this.appComponent.loadingSpinner = true;
  }

  getListarPorId() {
    this.appComponent.loadingSpinner = true;
  }

  toggleTheme(): void {
    this.actualTheme = switchActualTheme(this.actualTheme);
    this.themeIcon = applyTheme(this.actualTheme, this.toastr, true);
  }

  cadastrarUsuario() {
    console.log("Rota Encontrada!!!");
    this.router.navigate(['/usuarios/cadastrar-usuario-form']);
  }

  editarUsuario(idUsuario: number) {
    console.log("Rota Encontrada!!!");
    this.router.navigate(['/usuarios/editar-usuario-form'], { queryParams: { id: idUsuario } });
  }

  excluirUsuario(user: Usuario) {
    this.listaUsuariosMockados = this.listaUsuariosMockados.filter(u => u.idUsuario !== user.idUsuario);
    this.toastr.success(`Usuário ${user.nome} removido!`, 'Sucesso')
  }
}
