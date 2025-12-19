import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAll(completed?: boolean): Observable<Task[]> {
    let params = new HttpParams();

    if (completed !== undefined) {
      params = params.set('completed', completed);
    }

    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  create(title: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { title });
  }

  update(id: string, title: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { title });
  }

  changeStatus(id: string, isCompleted: boolean): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}/status`,
      { isCompleted }
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
