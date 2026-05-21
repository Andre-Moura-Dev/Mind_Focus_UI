import { Component, OnInit, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  // Pegar a Referência da sideBar PrimeNg
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  sidebarVisible: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
      
  }

  // Função para fechar/abrir a sideBar
  sideBarVisible(event: Event): void {
    this.sidebarVisible = false;

    if (this.sidebarRef) {
      this.sidebarRef.close(event);
    }
  }

  // Navegar para a home
  irParaHome(event: Event): void {
    this.sideBarVisible(event);
    this.router.navigate(['/home']);
  }

  // Logout
  logout(event: Event): void {
    this.sideBarVisible(event);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
