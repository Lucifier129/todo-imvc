import React from "react";
import classnames from "classnames";
import { Style, NavLink } from "react-imvc/component";

export default function View({ state, handlers }) {
  return (
    <div>
      <Style name="base" />
      <Style name="index" />
      <TodoApp state={state} handlers={handlers} />
      <Footer />
    </div>
  );
}

function TodoApp({ state, handlers }) {
  return (
    <section className="todoapp">
      <Header text={state.text} onAdd={handlers.handleAdd} onTodoInput={handlers.handleTodoInput} />
      <Main state={state} handlers={handlers} />
    </section>
  );
}

function Header({ text, onAdd, onTodoInput }) {
  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onBlur={onAdd}
        onKeyUp={onAdd}
        onChange={onTodoInput}
      />
    </header>
  );
}

function Main({ state, handlers }) {
  let total = state.todos.length;
  let count = state.todos.filter(item => !item.completed).length;
  let isAllCompleted = total > 0 && count === 0;
  let hasCompleted = total > 0 && count < total;
  return (
    <section className="main">
      <input
        className="toggle-all"
        type="checkbox"
        onClick={handlers.handleToggleAll}
        checked={isAllCompleted}
        readOnly
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <TodoList
        type={state.location.params.type}
        todos={state.todos}
        editing={state.editing}
        handlers={handlers}
      />
      <MainFooter
        if={state.todos.length}
        count={count}
        hasCompleted={hasCompleted}
        onClear={handlers.handleClear}
      />
    </section>
  );
}

function TodoList({ todos, editing, handlers, type }) {
  let list = todos.filter(item => filterTodo(type, item));
  return (
    <ul className="todo-list">
      {list.map((todo, index) => {
        return (
          <Todo
            key={todo.id}
            data={todo}
            editing={editing}
            handlers={handlers}
          />
        );
      })}
    </ul>
  );
}

function filterTodo(type, todo) {
  switch (type) {
    case "all":
      return true;
    case "active":
      return !todo.completed;
    case "completed":
      return todo.completed;
    default:
      return false;
  }
}

function Todo(props) {
  let { data, editing, handlers } = props;
  let isEditing = editing.id === data.id;
  let className = classnames({
    completed: data.completed,
    editing: isEditing
  });
  return (
    <li data-id={data.id} className={className}>
      <input
        className="toggle"
        type="checkbox"
        data-id={data.id}
        onClick={handlers.handleToggle}
        checked={data.completed}
        readOnly
      />
      <label data-id={data.id} onDoubleClick={handlers.handleShowEdit}>
        {data.content}
      </label>
      <button
        className="destroy"
        data-id={data.id}
        onClick={handlers.handleRemove}
      />
      <EditInput
        if={isEditing}
        id={data.id}
        value={editing.text}
        onEditing={handlers.handleEditing}
        onUpdate={handlers.handleUpdate}
      />
    </li>
  );
}

function EditInput(props) {
  return (
    <input
      className="edit"
      style={{ display: props.if ? "block" : "none" }}
      data-id={props.id}
      value={props.value}
      onBlur={props.onUpdate}
      onChange={props.onEditing}
      onKeyUp={props.onUpdate}
    />
  );
}

function MainFooter(props) {
  if (!props.if) {
    return null;
  }

  let { count, hasCompleted, onClear } = props;

  return (
    <footer className="footer">
      <TodoCount count={count} />
      <div className="filters">
        <StatusLink to="/todos/all">All</StatusLink>
        <StatusLink to="/todos/active">Active</StatusLink>
        <StatusLink to="/todos/completed">Completed</StatusLink>
      </div>
      <ClearButton if={hasCompleted} onClear={onClear} />
    </footer>
  );
}

function StatusLink(props) {
  return <NavLink {...props} as="a" activeClassName="selected" />;
}

function TodoCount({ count }) {
  let text = count > 1 ? `${count} items left` : `${count} item left`;
  return <span className="todo-count">{text}</span>;
}

function ClearButton(props) {
  if (props.if === false) {
    return null;
  }
  return (
    <button className="clear-completed" onClick={props.onClear}>
      Clear completed
    </button>
  );
}

function Footer() {
  return (
    <footer className="info">
      <p>Double-click to edit a todo</p>
      <p>
        Written by <a href="https://github.com/Lucifier129">Jade Gu</a>
      </p>
      <p>
        Part of <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  );
}
