import React, {useContext} from 'react';
import Filters from './Filters';
import TodoList from './TodoList';
import { Button, Col, Row, Collapse } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { UserContext } from '../UserContext';


function TodoPageBody(props) {
    let {setFilter, filter, filters, todos, updateTodo, deleteTodo, loading} = props;    
    const logged = useContext(UserContext); 

    return (
        <Row className="vheight-100">
        {!logged && <Redirect to='/login'/>}
        <Collapse>
            <Col sm={4} bg="light" id="left-sidebar" className="collapse d-sm-block below-nav">
            <Filters setFilter={setFilter} activeFilter={filter} />
            </Col>
        </Collapse>

        {!loading ? 
            <Col sm={8} className="below-nav">
                <h1>{filters[filter]}</h1>
                <TodoList todos={todos} updateTodo={updateTodo} deleteTodo={deleteTodo} />
                <Link to="/add"><Button variant="success" size="lg" className="fixed-right-bottom">&#43;</Button></Link>
            </Col>
            :
            <Col sm={8} className="below-nav">
                <span>🕗 Please wait, loading your tasks... 🕗</span>
            </Col> 
                
        }
        </Row>
    );
}

export default TodoPageBody;