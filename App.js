import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/todos`, { title: newTodo });
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const response = await axios.patch(`${API_URL}/todos/${id}`, { completed: !completed });
      if (response.data) {
        setTodos(todos.map(todo =>
          todo._id === id ? { ...todo, completed: !completed } : todo
        ));
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/todos/${id}`);
      if (response.data) {
        setTodos(todos.filter(todo => todo._id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Todo List
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={addTodo} style={{ display: 'flex', gap: '1rem' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a new todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Add
            </Button>
          </form>
        </Paper>

        <Paper elevation={3}>
          <List>
            {todos.map((todo) => (
              <ListItem
                key={todo._id}
                dense
                button
                onClick={() => toggleTodo(todo._id, todo.completed)}
              >
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText
                  primary={todo.title}
                  sx={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'text.secondary' : 'text.primary'
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTodo(todo._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
