import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoItem, CreateTodoRequest, UpdateTodoRequest } from '../models/todo-item';

@Injectable({ providedIn: 'root'})
export class TodoListService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5133/api/todos';

  getAll(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl);
  }

  getById(id: string): Observable<TodoItem> {
    return this.http.get<TodoItem>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateTodoRequest): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.apiUrl, request);
  }

  update(id: string, request: UpdateTodoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}