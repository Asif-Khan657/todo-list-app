import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoItem } from '../../models/todo-item';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss'
})
export class TodoForm implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input() todo: TodoItem | null = null;
  @Input() saving = false;
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['todo']) return;
    this.form.setValue({ title: this.todo?.title ?? '' });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  submitTodo(): void {
    if (this.saving || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const title = this.form.controls.title.value.trim();
    if (!title) {
      this.form.controls.title.setErrors({ required: true });
      this.form.controls.title.markAsTouched();
      return;
    }
    this.save.emit(title);
  }

  resetForm(): void {
    this.form.reset();
  }
}
