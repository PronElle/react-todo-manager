import React from 'react';
import { useState, useEffect } from 'react';
// react-bootstrap
import { Container } from 'react-bootstrap';

// components import
import NavBar from './components/NavBar';
import TodoForm from './components/TodoForm';
import TodoPageBody from './components/TodoPageBody'
import LoginForm from './components/LoginForm';

import API from './api/api';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { UserContext } from './UserContext';


// mapping between filter class and filter name
let filters = {
  'all': 'All',
  'important': 'Important',
  'today': 'Today',
  'sevendays': 'Next 7 Days',
  'private': 'Private'
};

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); 
  const [loading, setLoading] = useState(true);


  // auth after first mount 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getUserInfo();
        setLoggedIn(true);
      } catch (err) {
        setLoading(false); // not logged but loaded
      }
    };
    checkAuth();
  }, []);



  // mount and filtering 
  useEffect(() => {
    function filterTodos() {
      if(loggedIn)
        API.getTasks(filter)
          .then(tasks => {
            setTodos(tasks);
            setLoading(false);
          })
          .catch();

    };
    filterTodos();
  }, [filter, loggedIn]);

  /**
   * adds or edits a task:
   *  if the passed task an id, then it
   *  must be updated, otherwise it must be
   * created
   * @param {*} task 
   */
  const addOrEditTodo = (task) => {
    if (task.id) { // edit (the task already has the id)
      API.updateTask(task)
        .then(() => {
          API.getTasks(filter).then((tasks) => setTodos(tasks))
        })
        .catch();
    } else { // add (the task doesn't have the id)
      API.addTask(task)
        .then(() => {
          API.getTasks(filter).then((tasks) => setTodos(tasks))
        })
        .catch();
    }
  }

  /**
   * deletes a task according to the id
   * @param {*} id 
   */
  const deleteTodo = (id) => {
    API.deleteTask(id)
      .then(() => {
        API.getTasks(filter).then(tasks => {
          setTodos(tasks);
        })
      })
      .catch();
  }

  /**
   * logs user in and sets proper states
   * @param {*} credentials 
   */
  const login = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setLoggedIn(true);
      setMessage( `Welcome, ${user}!`);
    } catch (err) {
      setMessage(err);
    }
  }


  /**
   * logs user out and clears states
   */
  const logout = async () => {
    await API.logout();
    setLoggedIn(false);
    setMessage('');
    setTodos([]);
  }

  // param for custom context
  const context = {
    loggedIn: loggedIn,
    loading: loading,
    message: message,
    setMessage: setMessage
  }

  return (
    <UserContext.Provider value={context}>
      <Container fluid>
        <NavBar logout={logout}/>
        <Switch>
          <Route path="/login" render={() => {
              return loggedIn ? <Redirect to="/tasks" /> : <LoginForm login={login} />
          }}/>

          {/* route for filters (including "all"/no filter) */}
          <Route path="/tasks">
              <Switch>
                <Route path="/tasks/:filter" render={({ match }) => {
                  // to protect from invalid urls (e.g. /tasks/foo)
                    return filters[match.params.filter] ?
                      <TodoPageBody setFilter={setFilter} filter={match.params.filter} filters={filters}
                        todos={todos} updateTodo={addOrEditTodo} deleteTodo={deleteTodo} />
                      : <Redirect to='/login' />;
                }} />

                <Route render={() => {
                  return <TodoPageBody setFilter={setFilter} filter={"all"} filters={filters}
                    todos={todos} updateTodo={addOrEditTodo} deleteTodo={deleteTodo} />
                }} />
              </Switch>
          </Route> 


          <Route path="/add" render={() => {
              return <>
                <TodoPageBody setFilter={setFilter} filter={filter} filters={filters}
                  todos={todos} updateTodo={addOrEditTodo} deleteTodo={deleteTodo}/>
                <TodoForm filter={filter} addOrEditTodo={addOrEditTodo} />
              </>
          }} />

          <Route path='/update/:id' render={({ match }) => {
            // must wait server to load task inside "todos"
            // if accessed from url
            if (!loading) {
              // eslint-disable-next-line 
              const todoToEdit = todos.find(t => t.id == match.params.id);
              // to protect from invalid urls (e.g. /update/foo)           
              return todoToEdit ?
                <>
                  <TodoPageBody setFilter={setFilter} filter={filter} filters={filters}
                    todos={todos} updateTodo={addOrEditTodo} deleteTodo={deleteTodo} />
                  <TodoForm filter={filter}
                    todo={todoToEdit}
                    addOrEditTodo={addOrEditTodo} />
                </>
                : <Redirect to='/tasks' />;
            }
          }} />


          <Route>
            <Redirect to='/tasks' />
          </Route>

        </Switch>
      </Container>
    </UserContext.Provider>
  );
}

export default withRouter(App);
