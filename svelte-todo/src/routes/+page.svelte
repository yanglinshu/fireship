<script lang="ts">
	import { todoList } from '$lib/stores/todo-list';
	import type { Todo } from '$lib/types/todos';

	$: unfinishedTodo = $todoList.filter((todo) => {
		return todo.done === false;
	});

	$: finishedTodo = $todoList.filter((todo) => {
		return todo.done === true;
	});

	let newTodo: Todo = {
		text: '',
		done: false
	};

	function addTodo(event: Event) {
		if (newTodo.text === '') return;
		console.log(event, newTodo);
		todoList.update((list) => {
			return [
				{
					...newTodo
				},
				...list
			];
		});
		newTodo.text = '';
	}
</script>

<svelte:head>
	<title>Svelte TODO</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="box">
		<p class="title is-5">
			<center> Your TODO list here </center>
		</p>
		<div class="todo-list">
			<!-- {@debug unfinishedTodo} -->
			{#each unfinishedTodo as todo, index (index)}
				<div class="outlined todo-unfinished">
					<label class="checkbox subtitle is-5 ">
						<input type="checkbox" bind:checked={todo.done} />
						<span style="transform: translate(0, -0.1rem); display: inline-block">{todo.text}</span>
					</label>
				</div>
			{/each}
		</div>
		<div class="add-todo">
			<form on:submit|preventDefault={addTodo} class="add-todo-form">
				<input
					type="text"
					style="height: 1.85rem;"
					bind:value={newTodo.text}
					placeholder="Add a TODO"
				/>
				<button class="button is-primary is-small"> Add TODO </button>
			</form>
		</div>
		<div class="todo-list">
			<!-- {@debug unfinishedTodo} -->
			{#each finishedTodo as todo, index (index)}
				<div class="outlined todo-finished">
					<label class="checkbox subtitle is-5 ">
						<input type="checkbox" bind:checked={todo.done} />
						<span class="todo-label-text">{todo.text}</span>
					</label>
				</div>
			{/each}
		</div>
	</div>
</section>

<style scoped>
	section {
		display: flex;
		justify-content: center;
	}

	div[class~='box'] {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	.todo-list {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		width: 80%;
	}

	.todo-list input[type='checkbox'] {
		height: 1rem;
		aspect-ratio: 1/1;
	}

	.todo-list .outlined {
		border-radius: 5px;
		padding: 1rem 2rem;
		margin: 0.5rem;
		width: 100%;
	}

	.todo-list .todo-unfinished {
		border: 1px solid #f14668;
	}

	.todo-list .todo-finished {
		border: 1px solid #00d1b2;
	}

	.todo-list .todo-label-text {
		transform: translate(0, -0.1rem);
		display: inline-block;
	}

	.add-todo {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.add-todo-form {
		border: 1px solid #3e8ed0;
		border-radius: 5px;
		padding: 0.5rem 2rem;
		margin: 0.5rem;
		width: 80%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
</style>
