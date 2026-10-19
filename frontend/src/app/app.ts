import { Component } from '@angular/core';
import { TodoList } from './components/todo-list/todo-list';

@Component({
  imports: [TodoList],
  selector: 'app-root',
  template: '<app-todo-list/>',
})
export class App { }