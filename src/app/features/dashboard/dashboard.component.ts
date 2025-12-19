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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
        MatTooltipModule,
        MatSnackBarModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
    // Informe
    totalTareas = 0;
    tareasCompletadas = 0;
    tareasPendientes = 0;
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
    tareas!: Task[];

    constructor(
        private fb: FormBuilder,
        private tasksService: TasksService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
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
        this.tareas = tasks;
        this.dataSource.data = tasks;   // 🔥 ESTA LÍNEA ES LA CLAVE
        this.calcularMetricas();
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
            this.notify('Tarea actualizada con éxito');
            this.mostrarFormulario = false;
            this.loadTasks();
            });
        } else {
            this.tasksService.create(titulo).subscribe(() => {
            this.notify('Tarea creada con éxito');
            this.mostrarFormulario = false;
            this.loadTasks();
            });
        }
    }

  // ------------------ ESTADO ------------------
    cambiarEstado(task: Task, estado: 'pendiente' | 'completada'): void {
    this.tasksService
        .changeStatus(task.id, estado === 'completada')
        .subscribe(() => {
        this.notify('Estado actualizado');
        this.loadTasks();
        });
    }

  // ------------------ DELETE ------------------
    eliminar(id: string): void {
        this.tasksService.delete(id).subscribe(() => {
            this.notify('Tarea eliminada');
            this.loadTasks();
        });
    }

  // ------------------ LOGOUT ------------------
    logout(): void {
        this.authService.logout();
        this.notify('Sesión cerrada');
        this.router.navigateByUrl('/login', { replaceUrl: true });
    }


    private notify(message: string, type: 'success' | 'error' = 'success'): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
        });
    }

    private calcularMetricas(): void {
        this.totalTareas = this.tareas.length;
        this.tareasCompletadas = this.tareas.filter(t => t.isCompleted).length;
        this.tareasPendientes = this.tareas.filter(t => !t.isCompleted).length;
    }
}
