import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { UserContext } from '../UserContext';
import { iconLock, iconPerson } from '../icons';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const context = useContext(UserContext);

  const handleSubmit = (event) => {
      event.preventDefault();
      context.setMessage('');
      
      if(username.trim() === '' || password.trim() === '' || password.length < 6)
        context.setMessage('Invalid Username or Password')
      else{
        const credentials = { username, password };
        props.login(credentials);
      }    
  }

  return (
    <>
    <Row  className="below-nav-center" >
      <Card border="secondary" className="mx-auto"  style={{width: '500px', height:'600px'}}>
        <Card.Header className="bg-success">
          <h2 className="ui teal image header mx-auto">
                <svg className="bi bi-check-all" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.354 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L5 10.293l6.646-6.647a.5.5 0 01.708 0z" clipRule="evenodd"/>
                    <path d="M6.25 8.043l-.896-.897a.5.5 0 10-.708.708l.897.896.707-.707zm1 2.414l.896.897a.5.5 0 00.708 0l7-7a.5.5 0 00-.708-.708L8.5 10.293l-.543-.543-.707.707z"/>
                </svg>  
                <div className="content">
                    Log-in to ToDo Manager
                </div>
            </h2>
          </Card.Header>

          <Card.Body>
            <svg className="bi bi-person-circle" width="450" height="150" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z" />
              <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z" clipRule="evenodd" />
            </svg>
            
            <Form>
              <Form.Group controlId='username'>
                  <InputGroup>
                    <InputGroup.Text>{iconPerson}</InputGroup.Text>
                    <Form.Control size="lg" type='email' value={username} placeholder="email" onChange={ev => setUsername(ev.target.value)}/>
                  </InputGroup>
              </Form.Group>
              
              <Form.Group controlId='password'>

                <InputGroup>
                  <InputGroup.Text>{iconLock}</InputGroup.Text>
                  <Form.Control size="lg" type='password' value={password} placeholder="password" onChange={ev => setPassword(ev.target.value)}/>
                </InputGroup>  
              </Form.Group>            
            </Form>

            <Row>
              <Col> <Button size="lg" variant="primary" type="submit" onClick={handleSubmit}>Login</Button></Col>
              <Col sm={9}>{context.message && <Alert  variant='danger'>{context.message}</Alert> }</Col>
            </Row>
           
          </Card.Body>
        </Card>
        </Row>        
      </>
 
    )
}



export default LoginForm ;