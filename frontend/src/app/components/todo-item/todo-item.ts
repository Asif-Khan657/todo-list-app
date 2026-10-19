import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoItem } from '../../models/todo-item';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss'
})
export class TodoItemRow {
  @Input({ required: true }) todo!: TodoItem;
  @Output() edit = new EventEmitter<TodoItem>();
  @Output() toggleComplete = new EventEmitter<TodoItem>();
  @Output() remove = new EventEmitter<TodoItem>();
}
