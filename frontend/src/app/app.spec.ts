import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { TodoListService } from './services/todo-list.service';

describe('App', () => {
  it('renders the task list page', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: TodoListService, useValue: { getAll: () => of([]) } }]
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('My Todo App');
  });
});