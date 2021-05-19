import React from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import { Link, Redirect } from 'react-router-dom';

function TodoForm(props) {

  // todo attributes' hooks
  const [description, setDescription] = useState(props.todo? props.todo.description:'');
  const [date, setDate] = useState(props.todo ? props.todo.deadline?.format('YYYY-MM-DD'): '');
  const [time, setTime] = useState(props.todo ? props.todo.deadline?.format('hh:mm'): '');
  const [important, setImportant] = useState(props.todo ? props.todo.important : false); // for important
  const [priv, setPriv] = useState(props.todo? props.todo.priv : false); // for private
  

  const [errorMessage, setErrorMessage] = useState();
  const [submitted, setSubmitted] = useState(false)

  const handleSumbit = (event) => {
    event.preventDefault();

    // VALIDATION 
    if (description.trim() !== '') {
      // ToDos with unspecified date or time are added with undefined date
      const todo = { 
        // if editing, keep the id otherwise increase the last one
        id: props.todo ? props.todo.id : props.todos.length > 0 ? props.todos.slice(-1)[0].id + 1 : 1, 
        description: description, 
        important: important, 
        priv: priv, 
        deadline: date && time ? dayjs(date + time) : undefined
      };  

      props.addOrEditTodo(todo);
      setSubmitted(true);
    } else
      setErrorMessage('Please add a valid ToDo');
  }

  return (
    <>
      {submitted && <Redirect to='/todos'> </Redirect>}
      <Form>
        <Form.Group controlid='selectedTodo'>
          <Form.Label>ToDo</Form.Label>
          <Form.Control type='text' value={description} onChange={ev => setDescription(ev.target.value)}>
          </Form.Control>
          <span style={{ color: 'red' }}>{errorMessage}</span>
        </Form.Group>
        <Form.Group controlid='deadline-date'>
          <Form.Label>Deadline</Form.Label>
          <Form.Control type='date'  value={date ? date: ""} onChange={ev => setDate(ev.target.value)} />
        </Form.Group>

        <Form.Group controlId="deadline-time">
          <Form.Label>Time</Form.Label>
          <Form.Control type="time"  value={time? time : ""} onChange={ev => setTime(ev.target.value)}/>
        </Form.Group>

        <Form.Group controlid="formBasicCheckbox">
          <Form.Check type="checkbox" label="Important" value={important} checked={important? 'checked' : ''} onChange={() => setImportant(!important)} />
        </Form.Group>
        <Form.Group controlid="formBasicCheckbox">
          <Form.Check type="checkbox" label="Private" value={priv} checked={priv ? 'checked' : ''} onChange={() => setPriv(!priv)} />
        </Form.Group>
        <Button variant='success' onClick={handleSumbit} >Save</Button> <Link to = '/todos'>  <Button variant='secondary' onClick={props.cancel}>Cancel</Button></Link>
      </Form>
    </>
  );
}

export default TodoForm;