import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public showPassword: boolean = false;
  public showEyeIcon: boolean = false;

  mockedData = {
    email: 'teste@testeemail.com',
    senha: '12345678'
  }

  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {}

  fazerLogin() {
    if (this.formLogin.valid) {
      const { email, senha } = this.formLogin.value;

      if (
        email === this.mockedData.email && 
        senha === this.mockedData.senha
      ) {

        this.toastr.success("Login realizado com sucesso!");
        this.router.navigate(['/home']);

      } else {  
        this.toastr.error("Credenciais Inválidas!");
      }

    } else {
      this.toastr.warning("Preencha todos os campos!");
    }
  }

  mostrarSenha() {
    this.showPassword = !this.showPassword;
    this.showEyeIcon = !this.showEyeIcon;
  }
}