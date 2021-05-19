import React from 'react';
import { useState } from 'react';
// react-bootstrap
import { Container, Button, Row, Col, Collapse } from 'react-bootstrap';

// components import
import NavBar from './components/NavBar';
import Filters from './components/Filters';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import dayjs from 'dayjs';
import { Switch, Route, Link, withRouter, Redirect } from 'react-router-dom';

import API from './api/api';

// mapping between filter class and filter name
let filters = {
  'all': 'All', 
  'important':'Important', 
  'today': 'Today', 
  'sevendays': 'Next 7 Days',
  'private': 'Private'
};

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');  
  
  /**
   * retrieves todos filtered
   * with provided filter 
   * @param {*} filter criteria 
   */
  const getFilteredTodos = (filter) => {
    // no reason to switch
    if(filter == "all"){
      API.getTasks()
         .then( tasks => { 
           setTodos(tasks);
           setFilter('all'); 
          })
         .catch(); // do something here
    }else{
      API.getTasks(filter)
         .then( tasks => {
           setTodos(tasks);
           setFilter(filter);
         })
         .catch(); // do smthg here
    }
  }

  addTodo = (task) => {
    API.addTask(task)
       .then(() => {
         // trick: after update, update states also
         API.getTasks().then( tasks => {
           setTodos(tasks);
           setFilter('all');
         });
       })
       .catch(); // do smthg here
  }

  updateTodo = (task) => {

  }

  // deleteTask
  deleteTodo = (task) => {

  }

  return (
    <>
      <Container fluid>
        <NavBar />
        <Switch>
          <Route path="/todos">
            <Row className="vheight-100">
              <Switch>

                <Route path="/todos/:filter"  render={({match}) => {
                          // to protect from invalid urls (e.g. /todos/foo)
                    return filters[match.params.filter]  ? 
                     <>
                     <Collapse>
                        <Col sm={4} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                          <Filters setFilter={setFilter} activeFilter = {match.params.filter}/>
                        </Col>
                      </Collapse>
                      
                      <Col sm={8} className="below-nav"> 
                        <h1>{filters[filter]}</h1>
                        <TodoList todos = {getFilteredTodos(match.params.filter)} addTodo={addTodo} deleteTodo={deleteTodo} />
                        <Link to = "/add"><Button variant="success" size="lg" className="fixed-right-bottom">&#43;</Button></Link>
                      </Col>
                      </> 
                      : <Redirect to='/todos'/>;
                }}/> 

                <Route render={() => {
                    return <>
                      <Collapse>
                        <Col sm={4} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                          <Filters setFilter={setFilter} activeFilter = "all"/>
                        </Col>
                      </Collapse>

                      <Col sm={8} className="below-nav"> 
                        <h1>{filters[filter]}</h1>
                        <TodoList todos = {todos} deleteTodo={deleteTodo} />
                        <Link to = "/add"><Button variant="success" size="lg" className="fixed-right-bottom">&#43;</Button></Link>
                      </Col>  
                    </>;
                }}/>
                    
              </Switch>
            </Row>
          </Route>
          
          <Route path="/add">
            <Col sm={8} className="below-nav"> 
              <TodoForm todos={todos}
                addOrEditTodo={addTodo} />
            </Col>
          </Route>

          <Route exact path='/update/:id' render={({match}) => {
            // eslint-disable-next-line 
            const todoToEdit = todos.find(t => t.id == match.params.id);
                   // to protect from invalid urls (e.g. /update/foo)           
            return todoToEdit ? <Col sm={8} className="below-nav"> 
              <TodoForm todos = {todos} 
                todo = {todoToEdit}
                addOrEditTodo={ updateTodo} />
            </Col> : <Redirect to='/todos'/>; 
          }}/>
          
          <Route>
            <Redirect to='/todos'/>
          </Route>
      
        </Switch>          
      </Container>
    </>
  );
}

export default withRouter(App);
