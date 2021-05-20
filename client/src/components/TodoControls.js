import React from 'react';
import { Link } from 'react-router-dom';
import { iconDelete, iconEdit } from '../icons';



function TodoControls(props) { // returns the control cell for each row
    return (<>
      <Link to ={{pathname:'/update/'+  props.todo.id}}><span>{iconEdit}</span></Link>  
        <span onClick={() => props.deletetodo(props.todo.id)}>{iconDelete}</span> 
    </>)
}

export default TodoControls;