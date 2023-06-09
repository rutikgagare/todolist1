import React, { useState } from 'react';
import './CourseGoalItem.css';
import { useDispatch } from 'react-redux';
import { taskListActions } from '../../store/taskListSlice';

const CourseGoalItem = props => {

  // get todays date
  const today = new Date().toISOString().slice(0, 10);

  const [inputBox, setInputBox] = useState(false);
  const [editedTask, setEditedTask] = useState(props.text);
  const [dateBox, setDateBox] = useState(false);
  const [editedDate, setEditedDate] = useState(props.deadline);

  const dispatch = useDispatch();

  const deleteHandler = () => {
    dispatch(taskListActions.removeTask(props.id))
  };

  const toggleInputBox = () => {
    setInputBox((prev) => !prev);
  }

  const toggleDateBox = () => {
    setDateBox((prev) => !prev);
  }

  const updateTaskHandler = () => {

    if (editedTask.length === 0) {
      return;
    }
    dispatch(taskListActions.updateTask({ id: props.id, text: editedTask }));
    toggleInputBox();
  }

  const updateDateHandler = () => {
    dispatch(taskListActions.updateDate({ id: props.id, deadline: editedDate }));
    toggleDateBox();
  }

  const completeTaskHandler = () => {
    dispatch(taskListActions.updateStatus({ id: props.id, status: "completed" }));
  }

  const originalDate = new Date(editedDate);

  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDateStr = originalDate.toLocaleDateString("en-US", options);

  return (
    <>
      <li className="goal-item">
        <div className="goal-item-description">
          <h3 className={props.status === "completed" ? "completed" : ""}>{props.text}</h3>
          <h4><i class="fas fa-calendar"></i> {formattedDateStr}</h4>
        </div>

        <div className="goal-item-icons">
          {props.status !== "completed" && <i class="fa-sharp fa-solid fa-pen-to-square" onClick={toggleInputBox}></i>}
          {props.status !== "completed" && <i class="fas fa-calendar" onClick={toggleDateBox}></i>}
          <i class="fa-solid fa-trash" onClick={deleteHandler}></i>
          {props.status !== "completed" && <i class="fas fa-check" onClick={completeTaskHandler}></i>}
        </div>
      </li>

      {inputBox &&
        <div className='goal-item-inputBox'>
          <input type="text" value={editedTask} placeholder='Edit task' onChange={(e) => { setEditedTask(e.target.value) }} />

          <div className="buttons">
            <button style={{ backgroundColor: 'green' }} onClick={updateTaskHandler}>Update</button>
            <button style={{ backgroundColor: 'red' }} onClick={toggleInputBox}>Cancel</button>
          </div>
        </div>
      }

      {dateBox &&
        <div className='goal-item-inputBox'>
          <input type="date" value={editedDate} placeholder='date' className='date' min={today} onChange={(e) => { setEditedDate(e.target.value) }} />

          <div className="buttons">
            <button style={{ backgroundColor: 'green' }} onClick={updateDateHandler}>Update</button>
            <button style={{ backgroundColor: 'red' }} onClick={toggleDateBox}>Cancel</button>
          </div>
        </div>
      }
    </>
  );
};

export default CourseGoalItem;
