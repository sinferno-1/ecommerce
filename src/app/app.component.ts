// app.component.ts
// Root component that hosts the router outlet and global layout.

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // used in index.html title binding but not critical
  title = 'ecommerce-app';
}
