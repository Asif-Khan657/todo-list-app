import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { TodoList } from './todo-list';
import { TodoListService } from '../../services/todo-list.service';
import { TodoItem } from '../../models/todo-item';
import { TodoForm } from '../todo-form/todo-form';
import { By } from '@angular/platform-browser';

const active: TodoItem = {
  id: '1', title: 'Buy milk', isCompleted: false,
  createdAt: '2026-10-19T00:00:00Z', updatedAt: null
};
const completed: TodoItem = { ...active, id: '2', title: 'Read book', isCompleted: true };

describe('TodoList', () => {
  let component: TodoList;
  let form: TodoForm;
  let service: {
    getAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    service = {
      getAll: vi.fn().mockReturnValue(of([active, completed])),
      create: vi.fn().mockReturnValue(of(active)),
      update: vi.fn().mockReturnValue(of(undefined)),
      delete: vi.fn().mockReturnValue(of(undefined))
    };
    await TestBed.configureTestingModule({
      imports: [TodoList],
      providers: [{ provide: TodoListService, useValue: service }]
    }).compileComponents();
    const fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    const formDebugElement = fixture.debugElement.query(
      By.directive(TodoForm)
    );

    if (!formDebugElement) {
      throw new Error('TodoForm component was not found');
    }

    form = formDebugElement.componentInstance as TodoForm;
  });

  it('loads tasks and calculates counts', () => {
    expect(service.getAll).toHaveBeenCalledOnce();
    expect(component.loading()).toBe(false);
    expect(component.todoList()).toHaveLength(2);
    expect(component.activeCount).toBe(1);
    expect(component.completedCount).toBe(1);
  });

  it('filters active and completed tasks', () => {
    component.setFilter('active');
    expect(component.filteredTodoList.map(todo => todo.id)).toEqual(['1']);
    component.setFilter('completed');
    expect(component.filteredTodoList.map(todo => todo.id)).toEqual(['2']);
    component.setFilter('all');
    expect(component.filteredTodoList).toHaveLength(2);
  });

  it('does not submit an empty or whitespace-only title', () => {
    form.form.controls.title.setValue('');
    form.submitTodo();
    form.form.controls.title.setValue('   ');
    form.submitTodo();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('does not submit a title over 200 characters', () => {
    form.form.controls.title.setValue('x'.repeat(201));
    form.submitTodo();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('creates a task with a trimmed title and clears the form', () => {
    const created = { ...active, id: '3', title: 'New task' };
    service.create.mockReturnValue(of(created));
    form.form.controls.title.setValue('  New task  ');

    form.submitTodo();

    expect(service.create).toHaveBeenCalledWith({ title: 'New task' });
    expect(component.todoList()).toContainEqual(created);
    expect(form.form.controls.title.value).toBe('');
    expect(component.saving).toBe(false);
  });

  it('edits an existing task without changing completion state', () => {
    component.startEditing(completed);
    form.todo = completed;
    form.ngOnChanges({ todo: { currentValue: completed, previousValue: null, firstChange: false, isFirstChange: () => false } });
    form.form.controls.title.setValue('  Finished book  ');
    form.submitTodo();

    expect(service.update).toHaveBeenCalledWith('2', {
      title: 'Finished book', isCompleted: true
    });
    expect(component.todoList().find(todo => todo.id === '2')?.title).toBe('Finished book');
    expect(component.editingId).toBeNull();
  });

  it('cancels editing without modifying the task', () => {
    component.startEditing(active);
    component.cancelEditing();
    expect(component.editingId).toBeNull();
    expect(form.form.controls.title.value).toBe('');
    expect(component.todoList()[0].title).toBe('Buy milk');
  });

  it('toggles completion only after the API succeeds', () => {
    component.toggleCompleted(active);
    expect(service.update).toHaveBeenCalledWith('1', {
      title: 'Buy milk', isCompleted: true
    });
    expect(component.todoList()[0].isCompleted).toBe(true);
    expect(component.activeCount).toBe(0);
  });

  it('keeps task unchanged when completion update fails', () => {
    service.update.mockReturnValue(throwError(() => new Error('Failed')));
    component.toggleCompleted(active);
    expect(component.todoList()[0].isCompleted).toBe(false);
    expect(component.errorMessage).toContain('Unable to update');
  });

  it('does not delete when confirmation is cancelled', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    try {
      component.deleteTodo(active);
      expect(service.delete).not.toHaveBeenCalled();
      expect(component.todoList()).toHaveLength(2);
    } finally {
      confirm.mockRestore();
    }
  });

  it('deletes a task after confirmation', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    try {
      component.deleteTodo(active);
      expect(service.delete).toHaveBeenCalledWith('1');
      expect(component.todoList().map(todo => todo.id)).toEqual(['2']);
    } finally {
      confirm.mockRestore();
    }
  });

  it('shows a connection message when loading fails', () => {
    service.getAll.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    component.loadTodoList();
    expect(component.loading()).toBe(false);
    expect(component.errorMessage).toContain('Cannot connect to the API');
  });

  it('keeps the form value if creation fails', () => {
    service.create.mockReturnValue(throwError(() => new Error('Failed')));
    form.form.controls.title.setValue('Try again');
    form.submitTodo();
    expect(form.form.controls.title.value).toBe('Try again');
    expect(component.errorMessage).toContain('Unable to add');
    expect(component.saving).toBe(false);
  });
});