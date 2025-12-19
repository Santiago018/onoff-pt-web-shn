import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { TasksService } from '../../core/services/tasks.service';
import { Task } from '../../core/models/task.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // UI
  mostrarFiltro = false;
  mostrarFormulario = false;
  editando = false;

  filtroEstado: 'todas' | 'pendiente' | 'completada' = 'todas';

  // Tabla
  displayedColumns = ['titulo', 'estado', 'acciones'];

  dataSource = new MatTableDataSource<Task>([]);

  // Form
  form!: FormGroup;
  tareaEditandoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required]
    });
  }

  // ------------------ INIT ------------------
  ngOnInit(): void {
    this.loadTasks();
  }

  // ------------------ API ------------------
    loadTasks(): void {
    let completed: boolean | undefined;

    if (this.filtroEstado === 'pendiente') completed = false;
    if (this.filtroEstado === 'completada') completed = true;

    this.tasksService.getAll(completed).subscribe(tasks => {
        this.dataSource.data = tasks; // 🔥 AQUÍ ESTÁ LA MAGIA
    });
    }

  // ------------------ FILTRO ------------------
  consultar(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
    this.loadTasks();
  }

  aplicarFiltro(): void {
    this.loadTasks();
  }

  // ------------------ FORM ------------------
  crear(): void {
    this.form.reset();
    this.mostrarFormulario = true;
    this.editando = false;
    this.tareaEditandoId = null;
  }

  editar(task: Task): void {
    this.form.patchValue({ titulo: task.title });
    this.mostrarFormulario = true;
    this.editando = true;
    this.tareaEditandoId = task.id;
  }

  guardar(): void {
    if (this.form.invalid) return;

    const { titulo } = this.form.value;

    if (this.editando && this.tareaEditandoId) {
      this.tasksService.update(this.tareaEditandoId, titulo).subscribe(() => {
        this.mostrarFormulario = false;
        this.loadTasks();
      });
    } else {
      this.tasksService.create(titulo).subscribe(() => {
        this.mostrarFormulario = false;
        this.loadTasks();
      });
    }
  }

  // ------------------ ESTADO ------------------
  cambiarEstado(task: Task, estado: 'pendiente' | 'completada'): void {
    this.tasksService
      .changeStatus(task.id, estado === 'completada')
      .subscribe(() => this.loadTasks());
  }

  // ------------------ DELETE ------------------
  eliminar(id: string): void {
    this.tasksService.delete(id).subscribe(() => {
      this.loadTasks();
    });
  }

  // ------------------ LOGOUT ------------------
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
