import React from 'react';
import { ListGroup } from 'react-bootstrap';
import dayjs from 'dayjs';
import TodoControls from './TodoControls';


const Todo = (props) => {
    let {todo} = props;

    const changeCompleted = (ev, task) => {
      task.completed = ev.target.checked;
      props.updateTodo(task)
    }
  
    return (
      <ListGroup.Item id = {todo.id}>
        <div className="d-flex w-100 justify-content-between ">
          <div className="custom-control custom-checkbox">
              <input type="checkbox" defaultChecked={todo.completed} className={todo.important ? "custom-control-input important" : "custom-control-input"} 
              id={"check-t" +  todo.id} onChange={ev => changeCompleted(ev, todo)} />
              <label className="custom-control-label" htmlFor={"check-t" +  todo.id}>{todo.description}</label>
          </div>
          {!todo.priv && (
            <svg className="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clipRule="evenodd"/>
              <path fillRule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>)
          }
           
            <div>
            <small>{todo.deadline?.isSame(dayjs(), 'day') ? "Today at " : todo.deadline?.format('dddd, DD/MM/YYYY ')}{todo.deadline?.format('hh:mm A')} </small>
              <TodoControls todo={props.todo} deletetodo={props.deletetodo}/>
            </div>         
        </div>
      </ListGroup.Item>
    );
}

export default Todo;