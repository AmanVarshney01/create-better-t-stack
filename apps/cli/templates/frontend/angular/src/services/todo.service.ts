import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos = new BehaviorSubject<Todo[]>([
    { id: 1, text: 'Add', completed: true },
    { id: 2, text: 'hgk', completed: false }
  ]);

  todos$ = this.todos.asObservable();

  constructor() {
    // Load todos from localStorage if available
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos.next(JSON.parse(savedTodos));
    }
  }

  private saveTodos(todos: Todo[]): void {
    localStorage.setItem('todos', JSON.stringify(todos));
    this.todos.next(todos);
  }

  addTodo(text: string): void {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false
    };

    const updatedTodos = [...this.todos.value, newTodo];
    this.saveTodos(updatedTodos);
  }

  toggleTodo(id: number): void {
    const updatedTodos = this.todos.value.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.saveTodos(updatedTodos);
  }

  deleteTodo(id: number): void {
    const updatedTodos = this.todos.value.filter(todo => todo.id !== id);
    this.saveTodos(updatedTodos);
  }
}
