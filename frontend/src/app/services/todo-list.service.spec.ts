import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TodoListService } from './todo-list.service';
import { TodoItem } from '../models/todo-item';

const apiUrl = 'http://localhost:5133/api/todos';
const item: TodoItem = {
  id: '123', title: 'Buy milk', isCompleted: false,
  createdAt: '2026-10-19T00:00:00Z', updatedAt: null
};

describe('TodoListService', () => {
  let service: TodoListService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TodoListService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify()); 

  it('loads all tasks', () => {
    let result: TodoItem[] | undefined;
    service.getAll().subscribe(value => result = value);
    const request = http.expectOne(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush([item]);
    expect(result).toEqual([item]);
  });

  it('loads a task by ID', () => {
    let result: TodoItem | undefined;
    service.getById(item.id).subscribe(value => result = value);
    const request = http.expectOne(`${apiUrl}/${item.id}`);
    expect(request.request.method).toBe('GET');
    request.flush(item);
    expect(result).toEqual(item);
  });

  it('creates a task with the correct request body', () => {
    let result: TodoItem | undefined;
    service.create({ title: 'Buy milk' }).subscribe(value => result = value);
    const request = http.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'Buy milk' });
    request.flush(item);
    expect(result).toEqual(item);
  });

  it('updates a task with its completion state', () => {
    service.update(item.id, { title: item.title, isCompleted: true }).subscribe();
    const request = http.expectOne(`${apiUrl}/${item.id}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ title: item.title, isCompleted: true });
    request.flush(null);
  });

  it('deletes a task by ID', () => {
    service.delete(item.id).subscribe();
    const request = http.expectOne(`${apiUrl}/${item.id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('passes HTTP errors to the caller', () => {
    let status: number | undefined;
    service.getAll().subscribe({ error: error => status = error.status });
    http.expectOne(apiUrl).flush('Server error', { status: 500, statusText: 'Server Error' });
    expect(status).toBe(500);
  });
});
