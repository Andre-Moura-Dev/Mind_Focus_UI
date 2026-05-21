import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { Subscription, interval } from 'rxjs';
import { UserServiceService } from '../../../services/user-service.service';
import { 
  applyTheme, 
  switchActualTheme, 
  chargeThemePreferences 
} from '../../../utils/TrocarTema';
import { formatarNomeUsuario } from '../../../utils/FormatarNome';
import { UsuarioLogadoStorageService } from '../../../services/usuario-logado-storage.service';
import { TokenRenewalService } from '../../../services/auth/token-renewal.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-editar-usuario-form',
  templateUrl: './editar-usuario-form.component.html',
  styleUrl: './editar-usuario-form.component.scss'
})
export class EditarUsuarioFormComponent implements OnInit, OnDestroy {

  idUsuario!: number;
  actualTheme = 'light';
  themeIcon = '';
  public showPassword: boolean = false;
  public showEyeIcon: boolean = false;
  nomeUsuarioLogado: any;

  private subscription: Subscription = new Subscription();

  _remainingTimeToken: string = '00:00';
  private remainingSeconds: number = 0;
  private timerSubscription?: Subscription;

  formEditarUsuarios = new FormGroup({
    id: new FormControl(0),
    nome: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.minLength(8)])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appComponent: AppComponent,
    private toastr: ToastrService,
    private userService: UserServiceService,
    private usuarioLogadoStorage: UsuarioLogadoStorageService,
    private tokenRenewalService: TokenRenewalService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.actualTheme = chargeThemePreferences();
    this.themeIcon = applyTheme(this.actualTheme);
    this.initializeTimerSession();
    this.getUsuarioLogado();

    const idParam = this.route.snapshot.queryParamMap.get('id');

    if (idParam) {
      this.idUsuario = Number(idParam);

      this.getDadosUsuarioForm(this.idUsuario);
    }
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.tokenRenewalService.stopTokenRenewal();
  }
  
  getDadosUsuarioForm(id: number): void {
    this.userService.getPorId(id).subscribe({
      next: (res) => {

        const usuario = Array.isArray(res)
          ? res[0]
          : res;

        this.formEditarUsuarios.patchValue({
          id: usuario.idUsuario,
          nome: usuario.nome,
          email: usuario.email,
          senha: ''
        });
        this.idUsuario = usuario.idUsuario ?? id;
      },
      error: (err) => {
        this.toastr.error("Erro ao carregar os dados para edição");
        this.voltar();
      }
    });

  }

  putEditarUsuario(id: number) {
    if (this.formEditarUsuarios.invalid) {
      this.toastr.warning(
        "Por favor, preencha os campos corretamente!"
      );

      return;
    }

    this.appComponent.loadingSpinner = true;

    const usuarioEditadoDTO: Usuario = {
      idUsuario: this.formEditarUsuarios.value.id!,
      nome: this.formEditarUsuarios.value.nome!,
      email: this.formEditarUsuarios.value.email!
    };

    if (this.formEditarUsuarios.value.senha && this.formEditarUsuarios.value.senha.trim()) {
      usuarioEditadoDTO.senha = this.formEditarUsuarios.value.senha;
    }

    this.userService.putUsuarios(this.idUsuario, usuarioEditadoDTO).subscribe({
      next: () => {
        this.appComponent.loadingSpinner = false;

        this.toastr.success(
          "Usuário atualizado com sucesso!"
        );

        setTimeout(() => {
          this.voltar();
        }, 2000);
      },
      error: (err) => {
        this.toastr.error(
          "Erro", "não foi possível editar"
        );

        setTimeout(() => {
          this.voltar();
        }, 2000);
      }
    });
  }

  voltar() {
    this.router.navigate(['/usuarios']);
  }

  toggleTheme(): void {
    this.actualTheme = switchActualTheme(this.actualTheme);
    this.themeIcon = applyTheme(this.actualTheme, this.toastr, true);
  }

  mostrarSenha() {
    this.showPassword = !this.showPassword;
    this.showEyeIcon = !this.showEyeIcon;
  }

  initializeTimerSession() {
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
          this.initializeTimerSession();
          this.appComponent.loadingSpinner = false;
        },
        error: (err) => {
          this.toastr.error("Não foi possível renovar a sessão. Faça login novamente.");
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
  
    getUsuarioLogado(): void {
      const usuario = this.usuarioLogadoStorage.getUsuario();
  
      if (usuario) {
        const nome = usuario.nome || usuario.email?.split('@')[0] || '';
        this.nomeUsuarioLogado = formatarNomeUsuario(nome);
      }
    }

}
