import { writable } from 'svelte/store';
import type { Todo } from '$lib/types/todos';

export const todoList = writable<Todo[]>([
	{
		text: 'Todo 1',
		done: false
	}
]);
