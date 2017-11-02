import { Router } from "express";
import { createStore } from "relite";
import createIO from "socket.io";
import * as Model from "../../src/todos/Model";

const { initialState, ...actions } = Model;
const store = createStore(actions, initialState);
const router = Router();
let io = null;

export default function(app, server) {
  io = createIO(server);
  app.use("/restapi/todos", router);
}

router.post("/", async (req, res, next) => {
  let { actionType, actionPayload, socketId } = req.body;
  store.dispatch(actionType, actionPayload);
  res.json({ ok: true });
  if (socketId) {
    io.emit("todos", socketId, store.getState());
  }
});

router.get("/", async (req, res, next) => {
  let state = store.getState();
  res.json(state);
});
