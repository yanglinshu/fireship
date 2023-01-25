import {
  component$,
  useSignal,
  useStore,
  useStylesScoped$,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { Todo } from "~/types/todo";
import styles from "./index.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  const todoList = useStore<{ value: Todo[] }>(
    {
      value: [
        {
          text: "Learn Qwik",
          done: false,
        },
      ],
    },
    {
      recursive: true,
    }
  );

  const newTodoText = useSignal("");

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <div>
        <h4>Your TODO list here</h4>
        <ul class="todo-list">
          {todoList.value.map((todo, index) => {
            if (!todo.done) {
              return (
                <li class="done" key={index}>
                  {todo.text}
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onInput$={(event) => {
                      todo.done = (event.target as HTMLInputElement).checked;
                    }}
                  />
                </li>
              );
            }
          })}
        </ul>
        <div class="todo-list-add">
          <input
            type="text"
            onInput$={(event) => {
              newTodoText.value = (event.target as HTMLInputElement).value;
            }}
          />
          <button
            onClick$={() => {
              if (newTodoText.value) {
                todoList.value.push({
                  text: newTodoText.value,
                  done: false,
                });
                newTodoText.value = "";
              }
            }}
          >
            Add
          </button>
        </div>
        <ul class="todo-list">
          {todoList.value.map((todo, index) => {
            if (todo.done) {
              return (
                <li class="done" key={index}>
                  {todo.text}
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onInput$={(event) => {
                      todo.done = (event.target as HTMLInputElement).checked;
                    }}
                  />
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
