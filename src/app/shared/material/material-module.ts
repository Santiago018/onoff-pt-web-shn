import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

@NgModule({
  exports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule
  ]
})
export class MaterialModule {}
