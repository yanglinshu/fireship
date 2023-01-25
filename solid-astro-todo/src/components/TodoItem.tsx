import type { Todo } from '../types/todo';
import './TodoItem.css';

interface Props extends Todo {
	onChange?: (event: Event) => void;
}

export default function TodoItem({ text, done, onChange }: Props) {
	return (
		<li>
			<input type="checkbox" checked={done} onChange={onChange} />
			<span class="text">{text}</span>
		</li>
	);
}
