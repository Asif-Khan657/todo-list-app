import { Component, signal, OnInit, inject, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { TodoItem } from '../../models/todo-item';
import { TodoListService } from '../../services/todo-list.service';
import { TodoForm } from '../todo-form/todo-form';
import { TodoItemRow } from '../todo-item/todo-item';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

type TodoFilter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoForm, TodoItemRow, Header, Footer],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss'
})
export class TodoList implements OnInit {
  private readonly todoListService = inject(TodoListService);
  @ViewChild(TodoForm) private todoFormComponent?: TodoForm;

  todoList = signal<TodoItem[]>([]);
  filter: TodoFilter = 'all';
  editingId: string | null = null;
  loading = signal(true);
  saving = false;
  errorMessage = '';


  ngOnInit(): void {
    this.loadTodoList();
  }

  get filteredTodoList(): TodoItem[] {
    switch (this.filter) {
      case 'active':
        return this.todoList().filter(todo => !todo.isCompleted);
      case 'completed':
        return this.todoList().filter(todo => todo.isCompleted);
      default:
        return this.todoList();
    }
  }

  get activeCount(): number {
    return this.todoList().filter(todo => !todo.isCompleted).length;
  }

  get completedCount(): number {
    return this.todoList().filter(todo => todo.isCompleted).length;
  }

  loadTodoList(): void {
    this.loading.set(true);
    this.errorMessage = '';

    this.todoListService.getAll().subscribe({
      next: todos => {
        this.todoList.set(todos);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to load your tasks. Please try again.'
        );
      }
    });
  }

  setFilter(filter: TodoFilter): void {
    this.filter = filter;
  }

  get editingTodo(): TodoItem | null {
    return this.todoList().find(todo => todo.id === this.editingId) ?? null;
  }

  saveTodo(title: string): void {
    if (this.saving) return;
    this.saving = true;
    this.errorMessage = '';

    if (this.editingId) {
      this.updateExistingTodo(this.editingId, title);
      return;
    }

    this.todoListService.create({ title }).subscribe({
      next: createdTodo => {
        this.todoList.update(list => [...list, createdTodo]);
        this.todoFormComponent?.resetForm();
        this.saving = false;
      },
      error: error => {
        this.saving = false;
        this.errorMessage = this.getErrorMessage(error, 'Unable to add the task. Please try again.');
      }
    });
  }

  startEditing(todo: TodoItem): void {
    this.editingId = todo.id;
    this.errorMessage = '';
  }

  cancelEditing(): void {
    this.editingId = null;
    this.todoFormComponent?.resetForm();
    this.errorMessage = '';
  }

  toggleCompleted(todo: TodoItem): void {
    this.errorMessage = '';

    this.todoListService.update(todo.id, {
      title: todo.title,
      isCompleted: !todo.isCompleted
    }).subscribe({
      next: () => {
        this.todoList.update((list) =>
          list.map(item =>
            item.id === todo.id
              ? { ...item, isCompleted: !item.isCompleted }
              : item
          )
        );
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to update the task status. Please try again.'
        );
      }
    });
  }

  deleteTodo(todo: TodoItem): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${todo.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';

    this.todoListService.delete(todo.id).subscribe({
      next: () => {
        this.todoList.update((list) => list.filter(item => item.id !== todo.id));

        if (this.editingId === todo.id) {
          this.cancelEditing();
        }
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to delete the task. Please try again.'
        );
      }
    });
  }

  private updateExistingTodo(id: string, title: string): void {
    const existing = this.todoList().find(todo => todo.id === id);

    if (!existing) {
      this.saving = false;
      this.cancelEditing();
      return;
    }

    this.todoListService.update(id, {
      title,
      isCompleted: existing.isCompleted
    }).subscribe({
      next: () => {
        this.todoList.update((list) =>
          list.map(todo =>
            todo.id === id ? { ...todo, title } : todo
          )
        );

        this.cancelEditing();
        this.saving = false;
      },
      error: error => {
        this.saving = false;
        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to save the changes. Please try again.'
        );
      }
    });
  }

  private getErrorMessage(
    error: unknown,
    fallback: string
  ): string {
    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'Cannot connect to the API. Check that the backend is running and its URL is correct.';
    }

    return fallback;
  }
}