import React from 'react';
import Todo from './Todo';
import { ListGroup } from 'react-bootstrap';

const TodoList = (props) => {
  return (
    <>
      {props.todos &&
        <ListGroup as="ul" variant="flush">
          {props.todos.map(todo => <Todo key={todo.id} todo={todo} updateTodo={props.updateTodo} deletetodo={props.deleteTodo} />)}
        </ListGroup>}
    </>

  );
}


export default TodoList;

