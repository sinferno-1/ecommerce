// app.component.ts
// Root component that hosts the router outlet and global layout.

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, HeaderComponent, RouterModule, RouterOutlet]
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  title = 'ecommerce-app';
  isLoggedIn = false;

  ngOnInit(): void {
    // Subscribe to auth state to show/hide header
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = user !== null;
    });
  }
}
