import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Usuario } from '../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { 
  applyTheme, 
  chargeThemePreferences, 
  switchActualTheme 
} from '../../utils/TrocarTema';
import { UserServiceService } from '../../services/user-service.service';
import { interval, Subscription } from 'rxjs';
import { UsuarioLogadoStorageService } from '../../services/usuario-logado-storage.service';
import { TokenRenewalService } from '../../services/auth/token-renewal.service';
import { AuthService } from '../../services/auth/auth.service';
import { formatarNomeUsuario } from '../../utils/FormatarNome';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public usuarios: Usuario[] = [];
  filtro: string = '';
  actualTheme = 'light';
  themeIcon = '';
  codUsuarioLogado: any;
  nomeUsuarioLogado: string = '';

  _remainingTimeToken: string = '00:00';
  private remainingSeconds: number = 0;
  private timerSubscription?: Subscription;
  
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appComponent: AppComponent,
    private toastr: ToastrService,
    private userService: UserServiceService,
    private authService: AuthService,
    private tokenRenewalService: TokenRenewalService,
    private usuarioLogadoStorage: UsuarioLogadoStorageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.actualTheme = chargeThemePreferences();
    this.themeIcon = applyTheme(this.actualTheme);
    this.getUsuarioLogado();
    this.initializerTimerSession();
    this.getListarTodos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.tokenRenewalService.stopTokenRenewal();
  }

  private getUsuarioLogado() {
    const usuario = this.usuarioLogadoStorage.getUsuario();

    if (usuario) {
      const nome = usuario.nome || usuario.email?.split('@')[0] || '';
      this.nomeUsuarioLogado = formatarNomeUsuario(nome);
    }
  }

  getListarTodos() {
    setTimeout(() => this.appComponent.loadingSpinner = true);

    this.userService.getAll().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.appComponent.loadingSpinner = false;
      },
      error: (err) => {
        this.toastr.error(
          "Erro ao carregar os usuários",
          "Erro"
        );
        this.appComponent.loadingSpinner = false;
      },
    });
  }

  getListarPorEmail(email: string) {
    this.appComponent.loadingSpinner = true;

    this.userService.getUsuarioEmail(email).subscribe({
      next: (res) => {
        this.usuarios = res;
        this.appComponent.loadingSpinner = false;
      },
      error: (err) => {
        this.toastr.error(
          "Erro ao listar por e-mail",
          "Erro"
        );
        this.appComponent.loadingSpinner = false;
      },
    });
  }

  getListarPorId(id: number) {
    this.appComponent.loadingSpinner = true;

    this.userService.getPorId(id).subscribe({
      next: (res) => {
        this.usuarios = res;
        this.appComponent.loadingSpinner = false;
      },
      error: (err) => {
        this.toastr.error(
          "Erro ao listar por ID",
          "Erro"
        );
        this.appComponent.loadingSpinner = false;
      }
    })
  }

  toggleTheme(): void {
    this.actualTheme = switchActualTheme(this.actualTheme);
    this.themeIcon = applyTheme(this.actualTheme, this.toastr, true);
  }

  cadastrarUsuario() {
    this.router.navigate(['/usuarios/cadastrar-usuario-form']);
  }

  editarUsuario(idUsuario: any) {
    this.router.navigate(['/usuarios/editar-usuario-form'], { queryParams: { id: idUsuario } });
  }

  deletarUsuario(idUsuario: number, event?: MouseEvent) {
    this.confirmationService.confirm({
      target: event?.currentTarget as HTMLElement,
      message: 'Você tem certeza que deseja excluir?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUsuarios(idUsuario).subscribe({
          next: (res) => {
            this.toastr.success("Usuário deletado com sucesso.", 'Sucesso');
            this.getListarTodos();
          },
          error: (e) => {
            this.toastr.error("Não foi possível excluir o usuário", 'Erro');
          }
        });
      },
      reject: () => {
        this.toastr.warning("Ação cancelada.");
      }
    });
  }

  // Funções RefreshToken
  initializerTimerSession() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.remainingSeconds = this.usuarioLogadoStorage.getTempoRestanteTokenEmSegundos();
    this.updateFormaterTimer();
    
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateFormaterTimer();
      } else {
        this.expiredSession();
      }
    });
  }

  updateFormaterTimer() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    this._remainingTimeToken = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  refreshSession() {
    this.appComponent.loadingSpinner = true;

    this.authService.refreshToken().subscribe({
      next: (res) => {
        const currentUser = this.usuarioLogadoStorage.getUsuario();
        if (currentUser) {
          currentUser.token = res.accessToken ?? res.token;
          this.usuarioLogadoStorage.setUsuario(currentUser);
        }

        this.toastr.success("Sessão renovada com Sucesso!");
        this.initializerTimerSession();
        this.appComponent.loadingSpinner = false;
      },
      error: (err) => {
        this.toastr.error("Não foi possível renovar a sessão. Faça login novamente!");
        this.appComponent.loadingSpinner = false;
        this.expiredSession();
      }
    });
  }

  expiredSession() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    if (!this.usuarioLogadoStorage.getUsuario()) {
      return;
    }

    this.usuarioLogadoStorage.limparCache();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    this.toastr.warning("Sua sessão expirou por inatividade.", "Aviso");

    this.router.navigate(['/login']);
  }
}