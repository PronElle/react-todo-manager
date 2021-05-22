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

  // mount and filtering 
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

  /**
   * adds or edits a task:
   *  if the passed task an id, then it
   *  must be updated, otherwise it must be
   * created
   * @param {*} task 
   */
  const addOrEditTodo = (task) => {
    if(task.id){ // edit (the task already has the id)
      API.updateTask(task)
      .then(() => {
        API.getTasks(filter).then((tasks) => setTodos(tasks))
      })
      .catch();
    }else{ // add (the task doesn't have the id)
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
          API.getTasks(filter).then(tasks=> {
            setTodos(tasks);
          })
      })
      .catch();
  }


  return (
    <>
      <Container fluid>
        <NavBar />
        <Switch>
          {/* route for filters (including "all"/no filter) */}
          <Route path="/tasks">
            <Row className="vheight-100">
              <Switch>
                <Route path="/tasks/:filter" render={({ match }) => {
                  // to protect from invalid urls (e.g. /tasks/foo)
                  return filters[match.params.filter] ?
                    <>
                      <Collapse>
                        <Col sm={4} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                          <Filters setFilter={setFilter} activeFilter={match.params.filter} />
                        </Col>
                      </Collapse>

                      <Col sm={8} className="below-nav">
                        <h1>{filters[filter]}</h1>
                        <TodoList todos={todos} updateTodo={addOrEditTodo}  deleteTodo={deleteTodo} />
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
                      <TodoList todos={todos} updateTodo={addOrEditTodo} deleteTodo={deleteTodo} />
                      <Link to="/add"><Button variant="success" size="lg" className="fixed-right-bottom">&#43;</Button></Link>
                    </Col>
                  </>;
                }} />

              </Switch>
            </Row>
          </Route>
          
          {/* if no path is matched, then we're editing or adding so filtered tasks
          are displayed */}
          <Row className="vheight-100">
            <Collapse>
              <Col sm={4} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                <Filters setFilter={setFilter} activeFilter={filter} />
              </Col>
            </Collapse>

            <Col sm={8} className="below-nav">
              <h1>{filters[filter]}</h1>
              <TodoList todos={todos} updateTodo={addOrEditTodo} deleteTodo={deleteTodo} />
            </Col>

            {/* TodoForm overlaps (modal)  */}
            <Route path="/add" render={() => {
              return <TodoForm  filter={filter} addOrEditTodo={addOrEditTodo} />
            }} />
            
            {/* TodoForm overlaps (modal) */}
            <Route path='/update/:id' render={({ match }) => {
              // eslint-disable-next-line 
              const todoToEdit = todos.find(t => t.id == match.params.id);
              // to protect from invalid urls (e.g. /update/foo)           
              return todoToEdit ? <Col sm={8} className="below-nav">
                <TodoForm filter={filter}
                  todo={todoToEdit}
                  addOrEditTodo={addOrEditTodo} />
              </Col> : <Redirect to='/tasks' />;
          }} />
          </Row>

 

          <Route>
            <Redirect to='/tasks' />
          </Route>

        </Switch>
      </Container>
    </>
  );
}

export default withRouter(App);
