import React from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import { Link, Redirect } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

function TodoForm(props) {

  // todo attributes' hooks
  const [description, setDescription] = useState(props.todo? props.todo.description:'');
  const [date, setDate] = useState(props.todo ? props.todo.deadline?.format('YYYY-MM-DD'): '');
  const [time, setTime] = useState(props.todo ? props.todo.deadline?.format('HH:mm'): '');
  const [important, setImportant] = useState(props.todo ? props.todo.important : false); // for important
  const [priv, setPriv] = useState(props.todo? props.todo.priv : false); // for private
  const [completed] = useState(props.todo? props.todo.completed : false );

  const [errorMessage, setErrorMessage] = useState();
  const [submitted, setSubmitted] = useState(false)

  const handleSumbit = (event) => {
    event.preventDefault();

    // VALIDATION 
    if (description.trim() !== '') {
      const todo = { 
        // if undefined, it means we are creating a task
        // addOrEdit will take care of generating the id from API
        id: props.todo ? props.todo.id : undefined, 
        description: description, 
        important: important, 
        priv: priv, 
        deadline: date && time ? dayjs(date + time) : undefined,
        completed: completed
      }; 

      props.addOrEditTodo(todo);
      setSubmitted(true);
    } else
      setErrorMessage('Please add a valid ToDo');
  }


  return (
    <>
     {submitted && <Redirect to={{pathname:'/tasks/'+  props.filter}}> </Redirect>}
      <Modal show={!submitted} size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header>
          <Modal.Title>Add/Edit Task</Modal.Title>
        </Modal.Header>
        
        <Form>
          <Modal.Body>
            <Form.Group controlid='selectedTodo'>
              <Form.Label>ToDo</Form.Label>
              <Form.Control type='text' value={description} onChange={ev => setDescription(ev.target.value)}></Form.Control>
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
          </Modal.Body>

          <Modal.Footer>
            <Button variant='success' onClick={handleSumbit} >Save</Button>
            <Link to ={{pathname:'/tasks/'+  props.filter}} ><Button variant='secondary'>Cancel</Button></Link>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default TodoForm;