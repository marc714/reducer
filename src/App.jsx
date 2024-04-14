import { useEffect, useReducer, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// https://codesandbox.io/p/sandbox/react-dev-forked-qrlgz8

let INITIAL_STATE = [];

// action is an object with properties: 'type' and 'payload'
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK":
      return [
        ...state,
        {
          id: state.length + 1,
          title: action.title,
          done: action.done,
        },
      ];
    case "DELETE":
      return state.filter((task) => task.id !== action.id);
    case "EDIT":
      return state.map((task) => {
        if (task.id === action.task.id) {
          return action.task; // replace current object in state with action.task
        } else {
          return task;
        }
      });
    default:
      return state;
  }
};

// useReducer returns an array with exactly two values:
// The current state. During the first render, it’s set to init(initialArg) or initialArg (if there’s no init).
// The dispatch function that lets you update the state to a different value and trigger a re-render.
export function Todos() {
  const [todos, dispatch] = useReducer(reducer, INITIAL_STATE);

  const [text, setText] = useState("");

  function addTask(e) {
    e.preventDefault();
    dispatch({
      type: "ADD_TASK",
      title: text,
      done: false,
    });
    setText("");
  }

  function deleteTask(taskId) {
    dispatch({
      type: "DELETE",
      id: taskId,
    });
  }

  function editTask(taskObj) {
    dispatch({
      type: "EDIT",
      task: taskObj, // look up at the reducer to understand this.
    });
  }
  // something calls editTask with the taskObj argument. Which then calls dispatch over, type EDIT. If the reducer's state task.id equals action.task.id (which property value below is: taskObj.id), then return the entire taskObj to replace the state's version.

  return (
    <>
      <h4 className="text-3xl font-bold underline">Todo List {todos.length}</h4>
      <form>
        <input
          type="text"
          name="title"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Title"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
      </form>

      <h3>Items</h3>
      {todos.map((task) => (
        <Task task={task} onChange={editTask} onDelete={deleteTask} />
      ))}
    </>
  );
}

function Task({ task, onChange, onDelete }) {
  const [editing, setEditing] = useState(false);
  let taskContent;
  if (editing) {
    taskContent = (
      <>
        <input
          value={task.title}
          onChange={(e) => {
            onChange({
              ...task,
              title: e.target.value,
            });
          }}
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
        <button onClick={() => setEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.title}
        <button onClick={() => setEditing(true)}>Edit</button>
      </>
    );
  }

  return (
    <div key={task.id}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />

      {/* {task.title} */}
      {taskContent}

      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}

export default Todos;
