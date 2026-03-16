import React, { useState } from 'react';
import { NhostClient, NhostProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';
import { useQuery, useMutation, gql } from '@apollo/client';

const nhost = new NhostClient({
  subdomain: 'dgmrckuwwovtmpahvqza',
  region: 'ap-south-1'
});

const GET_TODOS = gql`
  query GetTodos {
    todos(order_by: { created_at: desc }) {
      id
      title
      is_completed
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    insert_todos_one(object: { title: $title }) {
      id
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: uuid!, $is_completed: Boolean!) {
    update_todos_by_pk(pk_columns: { id: $id }, _set: { is_completed: $is_completed }) {
      id
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_todos_by_pk(id: $id) {
      id
    }
  }
`;

function TodoApp() {
  const [todoTitle, setTodoTitle] = useState('');
  const { loading, error, data } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO, { refetchQueries: [{ query: GET_TODOS }] });
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO, { refetchQueries: [{ query: GET_TODOS }] });

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error) return <div style={styles.container}>Error: {error.message}</div>;

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!todoTitle.trim()) return;
    try {
      await addTodo({ variables: { title: todoTitle } });
      setTodoTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Nhost Todo App</h1>
      <form onSubmit={handleAddTodo} style={styles.form}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Add</button>
      </form>
      <ul style={styles.list}>
        {data.todos.map((todo) => (
          <li key={todo.id} style={styles.listItem}>
            <input
              type="checkbox"
              checked={todo.is_completed}
              onChange={() => toggleTodo({ variables: { id: todo.id, is_completed: !todo.is_completed } })}
              style={styles.checkbox}
            />
            <span style={{ ...styles.todoText, textDecoration: todo.is_completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo({ variables: { id: todo.id } })}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  header: { textAlign: 'center', color: '#333' },
  form: { display: 'flex', marginBottom: '20px' },
  input: { flex: 1, padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px 0 0 4px' },
  addButton: { padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' },
  checkbox: { marginRight: '10px', cursor: 'pointer' },
  todoText: { flex: 1, fontSize: '16px' },
  deleteButton: { backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }
};

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <TodoApp />
      </NhostApolloProvider>
    </NhostProvider>
  );
}

export default App;