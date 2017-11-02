export const initialState = {
  todos: [
    {
      id: Date.now(),
      content: "123",
      completed: false
    }
  ],
  editing: {
    id: null,
    text: ""
  },
  text: "",
};

export const EDITING_TEXT = (state, text) => {
  if (state.text === text) {
    return state;
  }
  return {
    ...state,
    text
  };
};

export const RECEIVE_TODOS = (state, todos) => {
  return {
    ...state,
    todos
  };
};

export const ADD_TODO = (state, { id, content }) => {
  if (!content) {
    return state;
  }
  let todo = {
    id: id || Date.now(),
    content: content,
    completed: false
  };
  return {
    ...state,
    todos: state.todos.concat(todo),
    text: ""
  };
};

export const REMOVE_TODO = (state, id) => {
  let todos = state.todos.filter(item => item.id !== id);

  if (state.todos.length === todos.length) {
    return state;
  }

  return {
    ...state,
    todos
  };
};

export const UPDATE_TODO = (state, { id, ...data }) => {
  if (data.content === "") {
    return REMOVE_TODO(state, id);
  }

  let todos = state.todos.map(item => {
    return item.id === id ? Object.assign({}, item, data) : item;
  });

  return {
    ...CLEAR_EDITING(state),
    todos
  };
};

export const TOGGLE_TODO = (state, id) => {
  let target = state.todos.find(item => item.id === id);
  let completed = !target.completed;
  return UPDATE_TODO(state, { id, completed });
};

export const TOGGLE_ALL = state => {
  let hasActive = state.todos.some(item => !item.completed);
  let completed = hasActive;
  let todos = state.todos.map(item => Object.assign({}, item, { completed }));
  return {
    ...state,
    todos
  };
};

export const CLEAR_COMPLETED = state => {
  let todos = state.todos.filter(item => !item.completed);
  return {
    ...state,
    todos
  };
};

export const SHOW_EDITING = (state, id) => {
  let target = state.todos.find(item => item.id === id);
  if (!target) {
    return state;
  }
  let editing = {
    id: id,
    text: target.content
  };
  return {
    ...state,
    editing
  };
};

export const EDITING_TODO = (state, text) => {
  let editing = {
    ...state.editing,
    text: text
  };
  return {
    ...state,
    editing
  };
};

export const CLEAR_EDITING = state => {
  return {
    ...state,
    editing: initialState.editing
  };
};