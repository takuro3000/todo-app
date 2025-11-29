import { useState, useEffect } from 'react'
import './App.css'

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8080/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodoTitle.trim()) return;
    try {
      const response = await fetch('http://localhost:8080/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodoTitle, completed: false }),
      });
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id: number, currentCompleted: boolean, currentTitle: string) => {
    try {
      const response = await fetch(`http://localhost:8080/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: currentTitle, completed: !currentCompleted }),
      });
      if (response.ok) {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed: !currentCompleted } : todo
        ));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      <div className="add-todo-container">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new task"
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span onClick={() => toggleTodo(todo.id, todo.completed, todo.title)}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
