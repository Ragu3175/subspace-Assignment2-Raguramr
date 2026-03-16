import React, { useState } from 'react';
import { NhostClient, NhostProvider, useAuthenticationStatus, useSignInEmailPassword, useSignUpEmailPassword, useSignOut } from '@nhost/react';
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

function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signInEmailPassword, isLoading: isSignInLoading, isError: isSignInError, error: signInError } = useSignInEmailPassword();
  const { signUpEmailPassword, isLoading: isSignUpLoading, isError: isSignUpError, error: signUpError } = useSignUpEmailPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignIn) {
      await signInEmailPassword(email, password);
    } else {
      await signUpEmailPassword(email, password);
    }
  };

  const isLoading = isSignInLoading || isSignUpLoading;
  const isError = isSignInError || isSignUpError;
  const error = signInError || signUpError;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoComplete={isSignIn ? "current-password" : "new-password"}
          required
        />
        <button type="submit" style={styles.addButton} disabled={isLoading}>
          {isLoading ? 'Loading...' : isSignIn ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      {isError && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '10px', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
          {error?.message || 'An error occurred'}
        </div>
      )}
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        {isSignIn ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => setIsSignIn(!isSignIn)} 
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSignIn ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
}

function TodoApp() {
  const [todoTitle, setTodoTitle] = useState('');
  const { loading, error, data } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO, { refetchQueries: [{ query: GET_TODOS }] });
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO, { refetchQueries: [{ query: GET_TODOS }] });
  const { signOut } = useSignOut();

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={styles.header}>Nhost Todo App</h1>
        <button onClick={signOut} style={styles.signOutButton}>Sign Out</button>
      </div>
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
  header: { color: '#333' },
  form: { display: 'flex', marginBottom: '20px' },
  input: { flex: 1, padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' },
  addButton: { padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  signOutButton: { backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' },
  checkbox: { marginRight: '10px', cursor: 'pointer' },
  todoText: { flex: 1, fontSize: '16px' },
  deleteButton: { backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }
};

function AppContent() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) return <div style={styles.container}>Checking auth status...</div>;

  if (isAuthenticated) {
    return (
      <NhostApolloProvider nhost={nhost}>
        <TodoApp />
      </NhostApolloProvider>
    );
  }

  return <Auth />;
}

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <AppContent />
    </NhostProvider>
  );
}

export default App;