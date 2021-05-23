import React from 'react';
import Filters from './Filters';
import TodoList from './TodoList';
import { Button, Col, Row, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TodoPageBody(props) {
    let {setFilter, filter, filters, todos, addOrEditTodo, deleteTodo} = props;    return (
        <Row className="vheight-100">
            <Collapse>
                <Col sm={4} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
                <Filters setFilter={setFilter} activeFilter={filter} />
                </Col>
            </Collapse>

            <Col sm={8} className="below-nav">
                <h1>{filters[filter]}</h1>
                <TodoList todos={todos} updateTodo={addOrEditTodo} deleteTodo={deleteTodo} />
                <Link to="/add"><Button variant="success" size="lg" className="fixed-right-bottom">&#43;</Button></Link>
            </Col>
        </Row>
     
    );
}

export default TodoPageBody;