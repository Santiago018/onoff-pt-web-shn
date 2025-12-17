import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false, // 🔥 ESTA LÍNEA ES LA CLAVE
  templateUrl: './app.html',
})
export class AppComponent {}
