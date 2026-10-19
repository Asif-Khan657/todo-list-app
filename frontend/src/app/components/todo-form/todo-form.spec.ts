import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TodoForm } from './todo-form';

const todo = { id: '1', title: 'Original', isCompleted: false, createdAt: '', updatedAt: null };

describe('TodoForm', () => {
  let component: TodoForm;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TodoForm] }).compileComponents();
    const fixture = TestBed.createComponent(TodoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits a trimmed title', () => {
    const save = vi.fn();
    component.save.subscribe(save);
    component.form.controls.title.setValue('  Buy milk  ');
    component.submitTodo();
    expect(save).toHaveBeenCalledWith('Buy milk');
  });

  it('rejects empty, whitespace-only and overlong titles', () => {
    const save = vi.fn();
    component.save.subscribe(save);
    for (const title of ['', '   ', 'x'.repeat(201)]) {
      component.form.controls.title.setValue(title);
      component.submitTodo();
    }
    expect(save).not.toHaveBeenCalled();
  });

  it('loads the selected task for editing', () => {
    component.todo = todo;
    component.ngOnChanges({ todo: { currentValue: todo, previousValue: null, firstChange: false, isFirstChange: () => false } });
    expect(component.form.controls.title.value).toBe('Original');
  });

  it('does not submit while saving', () => {
    const save = vi.fn();
    component.save.subscribe(save);
    component.saving = true;
    component.form.controls.title.setValue('New title');
    component.submitTodo();
    expect(save).not.toHaveBeenCalled();
  });
});
