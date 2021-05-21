import React from 'react';
import { useState, useEffect } from 'react';
// react-bootstrap
import { Container, Button, Row, Col, Collapse } from 'react-bootstrap';

// components import
import NavBar from './components/NavBar';
import Filters from './components/Filters';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import API from './api/api';

import { Switch, Route, Link, withRouter, Redirect } from 'react-router-dom';

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
  
  // component mount 
 // useEffect(() => {
  //  API.getTasks()
  //    .then(tasks => setTodos(tasks))
  //    .catch(); // do smthg here
  //}, []);

  // filtering 
  useEffect(() => {
    function filterTodos() {
      API.getTasks(filter)
        .then(tasks => {
          setTodos(tasks);
        })
        .catch() // do smthg here
    };
    filterTodos(filter);
  }, [filter]);

  const addTodo = (task) => {
    
    API.addTask(task)
    .then(() => {
      API.getTasks().then((tasks) => setTodos(tasks))
    })
    .catch();

  }

  const updateTodo = (task) => {

    API.updateTask(task)
    .then(() => {
      API.getTasks().then((tasks) => setTodos(tasks))
    })
    .catch();
    
  }

  const deleteTodo = (id) => {
    // elle's suggestion: 
    // (feel free to improve)
    // API.deleteTask(id)
    //    .then(() => {
    //       API.getTasks(filter).then(tasks=> {
    //         setTodos(tasks);
    //       })
    //   })
    //   .catch();

    // TODO: to be implemented
  }


  return (
    <>
      <Container fluid>
        <NavBar />
        <Switch>
          <Route path="/tasks">
            <Row className="vheight-100">
              <Switch>

                <Route path="/tasks/:filter" render={({ match }) => {
                  // to protect from invalid urls (e.g. /todos/foo)
                  return filters[match.params.filter] ?
                    <>
                      <Collapse>
                        <Col sm={4} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                          <Filters setFilter={setFilter} activeFilter={match.params.filter} />
                        </Col>
                      </Collapse>

                      <Col sm={8} className="below-nav">
                        <h1>{filters[filter]}</h1>
                        <TodoList todos={todos} addTodo={addTodo} deleteTodo={deleteTodo} />
                        <Link to="/add"><Button variant="success" size="lg" className="fixed-right-bottom">&#43;</Button></Link>
                      </Col>
                    </>
                    : <Redirect to='/tasks' />;
                }} />

                <Route render={() => {
                  return <>
                    <Collapse>
                      <Col sm={4} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                        <Filters setFilter={setFilter} activeFilter="all" />
                      </Col>
                    </Collapse>

                    <Col sm={8} className="below-nav">
                      <h1>{filters[filter]}</h1>
                      <TodoList todos={todos} deleteTodo={deleteTodo} />
                      <Link to="/add"><Button variant="success" size="lg" className="fixed-right-bottom">&#43;</Button></Link>
                    </Col>
                  </>;
                }} />

              </Switch>
            </Row>
          </Route>

          <Route path="/add">
            <Col sm={8} className="below-nav">
              <TodoForm todos={todos}
                addOrEditTodo={addTodo} />
            </Col>
          </Route>

          <Route exact path='/update/:id' render={({ match }) => {
            // eslint-disable-next-line 
            const todoToEdit = todos.find(t => t.id == match.params.id);
            // to protect from invalid urls (e.g. /update/foo)           
            return todoToEdit ? <Col sm={8} className="below-nav">
              <TodoForm todos={todos}
                todo={todoToEdit}
                addOrEditTodo={updateTodo} />
            </Col> : <Redirect to='/tasks' />;
          }} />

          <Route>
            <Redirect to='/tasks' />
          </Route>

        </Switch>
      </Container>
    </>
  );
}

export default withRouter(App);
