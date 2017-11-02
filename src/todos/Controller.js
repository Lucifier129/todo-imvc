import Controller from "react-imvc/controller";
import View from "./View";
import * as Model from "./Model";
import createSocketClient from "socket.io-client";

export default class extends Controller {
  SSR = true
  API = {
    todos: "/restapi/todos"
  };
  preload = {
    base: "/todos/css/base.css",
    index: "/todos/css/index.css"
  };
  View = View;
  Model = Model;

  shouldComponentCreate() {
    let { params } = this.location;
    let validTypeList = ['all', 'active', 'completed']
    let isValidType = validTypeList.includes(params.type)

    if (!isValidType) {
      this.redirect("/todos/all");
      return false;
    }
  }

  // componentWillCreate() {
  //   try {
  //     let todos = JSON.parse(this.cookie("todos"));
  //     let { RECEIVE_TODOS } = this.store.actions;
  //     RECEIVE_TODOS(todos);
  //   } catch (error) {
  //     console.log("willCreate", error);
  //   }
  // }

  // stateDidChange() {
  //   let { todos } = this.store.getState();
  //   this.cookie("todos", JSON.stringify(todos));
  // }

  async componentWillCreate() {
    let state = await this.get("todos");
    let { UPDATE_STATE } = this.store.actions;
    UPDATE_STATE(state);
  }

  stateDidChange({ actionType, actionPayload }) {
    let { initialState, ...actions } = this.Model;
    if (actions.hasOwnProperty(actionType)) {
      let socketId = this.socket.id
      this.post("todos", { actionType, actionPayload, socketId });
    }
  }

  componentDidMount() {
    let socket = (this.socket = createSocketClient());
    socket.on("todos", this.handlePush);
  }

  componentWillUnmount() {
    this.socket.off("todos", this.handlePush);
  }

  handlePush = (socketId, state) => {
    if (socketId === this.socket.id) {
      return
    }
    let { UPDATE_STATE } = this.store.actions;
    UPDATE_STATE(state);
  };

  handleTodoInput = ({ currentTarget }) => {
    let { EDITING_TEXT } = this.store.actions;
    EDITING_TEXT(currentTarget.value);
  };

  handleAdd = event => {
    if (event.type === "keyup" && !isEnterKey(event.keyCode)) {
      return;
    }
    let state = this.store.getState();
    let { ADD_TODO, CLEAR_TEXT } = this.store.actions;
    let content = state.text;
    let id = Date.now();
    ADD_TODO({ id, content });
  };

  handleRemove = ({ currentTarget }) => {
    let id = Number(currentTarget.getAttribute("data-id"));
    let { REMOVE_TODO } = this.store.actions;
    REMOVE_TODO(id);
  };

  handleToggle = ({ currentTarget }) => {
    let id = Number(currentTarget.getAttribute("data-id"));
    let { TOGGLE_TODO } = this.store.actions;
    TOGGLE_TODO(id);
  };

  handleToggleAll = () => {
    let { TOGGLE_ALL } = this.store.actions;
    TOGGLE_ALL();
  };

  handleClear = () => {
    let { CLEAR_COMPLETED } = this.store.actions;
    CLEAR_COMPLETED();
  };

  handleShowEdit = ({ currentTarget }) => {
    let id = Number(currentTarget.getAttribute("data-id"));
    let { SHOW_EDITING } = this.store.actions;
    SHOW_EDITING(id);
    setTimeout(() => {
      currentTarget.parentNode.querySelector(".edit").focus();
    });
  };

  handleHideEdit = () => {
    let { CLEAR_EDITING } = this.store.actions;
    CLEAR_EDITING();
  };

  handleEditing = ({ currentTarget }) => {
    let { EDITING_TODO } = this.store.actions;
    EDITING_TODO(currentTarget.value);
  };

  handleUpdate = event => {
    switch (event.type) {
      case "keyup":
        if (isEnterKey(event.keyCode)) {
          this.updateTodo();
        } else if (isEscKey(event.keyCode)) {
          this.handleHideEdit();
        }
        break;
      case "blur":
        this.updateTodo();
        break;
    }
  };

  updateTodo() {
    let { editing } = this.store.getState();
    let { UPDATE_TODO, CLEAR_EDITING } = this.store.actions;
    let payload = {
      id: editing.id,
      content: editing.text
    };
    UPDATE_TODO(payload);
  }
}

function isEnterKey(keyCode) {
  return keyCode === 13;
}

function isEscKey(keyCode) {
  return keyCode === 27;
}
