import React, { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Filters = (props) => {
  // avoid the "cannot update a component while rendering a different component"
  useEffect(() => {
    props.setFilter(props.activeFilter);
  });

  return (
    <>
      <ListGroup variant="flush">
        <NavLink key="#all" to='/todos'><ListGroup.Item action active={props.activeFilter === "all"} id = "filter-all">All</ListGroup.Item></NavLink>
        <NavLink key="#important" to='/todos/important'><ListGroup.Item action active={props.activeFilter === "important"} id = "filter-important" >Important</ListGroup.Item></NavLink>
        <NavLink key="#today" to='/todos/today'><ListGroup.Item action active={props.activeFilter === "today"} id = "filter-today">Today</ListGroup.Item></NavLink>
        <NavLink key="#sevendays" to='/todos/sevendays'><ListGroup.Item action active={props.activeFilter === "sevendays"} id = "filter-week">Next 7 Days</ListGroup.Item></NavLink>
        <NavLink key="#private" to='/todos/private'><ListGroup.Item action active={props.activeFilter === "private"} id = "filter-private" >Private</ListGroup.Item></NavLink>
      </ListGroup>
    </>
  );
}

export default Filters;