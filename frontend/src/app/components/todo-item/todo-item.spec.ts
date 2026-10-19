import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TodoItemRow } from './todo-item';

const todo = { id: '1', title: 'Buy milk', isCompleted: false, createdAt: '', updatedAt: null };

describe('TodoItemRow', () => {
  it('renders the title and emits user actions', async () => {
    await TestBed.configureTestingModule({ imports: [TodoItemRow] }).compileComponents();
    const fixture = TestBed.createComponent(TodoItemRow);
    fixture.componentInstance.todo = todo;
    const edit = vi.fn();
    const toggle = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.toggleComplete.subscribe(toggle);
    fixture.componentInstance.remove.subscribe(remove);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Buy milk');
    (element.querySelector('input[type="checkbox"]') as HTMLInputElement).click();
    (element.querySelector('[aria-label="Edit Buy milk"]') as HTMLButtonElement).click();
    (element.querySelector('[aria-label="Delete Buy milk"]') as HTMLButtonElement).click();
    expect(toggle).toHaveBeenCalledWith(todo);
    expect(edit).toHaveBeenCalledWith(todo);
    expect(remove).toHaveBeenCalledWith(todo);
  });
});
