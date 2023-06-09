import CourseGoalListUpcoming from '../CourseGoals/CourseGoalListUpcoming';
import CourseGoalListToday from '../CourseGoals/CourseGoalListToady';
import CourseGoalListPending from '../CourseGoals/CourseGoalListPending';
import CourseGoalListCompleted from '../CourseGoals/CourseGoalListCompleted';

import CourseInput from '../CourseGoals/CourseInput';
import classes from './Home.module.css';
import { auth } from '../../config/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { taskListActions } from '../../store/taskListSlice';
import { loginActions } from '../../store/loginSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import Modal from '../Modal/ModalOverlay';

let send = false;

const Home = () => {

  const isLogin = useSelector(state => state.login.isLogedIn);
  const items = useSelector(state => state.task.items);
  const [filter, setFilter] = useState("today");
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsLoading(true);
      if (user) {
        console.log("loggedin"+user.uid);
        dispatch(loginActions.setLogedIn());
      }
      setIsLoading(false);
    });
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogin) {
      let uid = auth.currentUser.uid;
      const sendData = async () => {
        await fetch(`https://tasklist-6a4e5-default-rtdb.firebaseio.com/${uid}.json`, {
          method: "PUT",
          body: JSON.stringify({ items: items })
        })
      }

      if (send === false) {
        send = true;
        return;
      }
      sendData();
    }
  }, [items]);

  useEffect(() => {
    if (isLogin) {
      let uid = auth.currentUser.uid;
      const fetchData = async () => {
        const response = await fetch(`https://tasklist-6a4e5-default-rtdb.firebaseio.com/${uid}.json`);
        const data = await response.json();
        dispatch(taskListActions.replace(data.items));
      }
      fetchData();
    }
  }, [isLogin]);

  const logoutHandler = async () => {
    dispatch(loginActions.setLogout());
    dispatch(taskListActions.replace([]))
    const response = await signOut(auth)
  }

  return (
    <div className={classes.main}>
      {isLoading && isLogin && <Modal></Modal>}

      <section className={classes.navbar}>
        <h2> <i class="fas fa-list-check"></i> Task List</h2>

        <div className={classes.buttons}>
          {!isLogin && <button onClick={() => navigate('/login')}>Login</button>}
          {!isLogin && <button onClick={() => navigate('/signup')}>SignUp</button>}
          {/* {isLogin && <span>{auth.currentUser.displayName}</span>} */}
          {isLogin && <i onClick={() => { navigate('/account') }} class="fa-solid fa-user"></i>}
          {isLogin && <button onClick={logoutHandler}>Logout</button>}
        </div>
        
      </section>

      <section className={classes.goalForm}>
        <CourseInput />
      </section>

      <section className={classes.goals}>
        {items.length > 0 &&
          <div className={classes.filter}>

            <button onClick={() => { setFilter("today") }} className={filter === "today" ? classes.active:""}>Today's task</button>
            <button onClick={() => { setFilter("upcoming") }} className={filter === "upcoming" ? classes.active:""}>Upcoming task</button>
            <button onClick={() => { setFilter("pending") }} className={filter === "pending" ? classes.active:""}>Pending task</button>
            <button onClick={() => { setFilter("completed") }} className={filter === "completed" ? classes.active:""}>Completed task</button>

          </div>}

        {filter === "today" && <CourseGoalListToday></CourseGoalListToday>}
        {filter === "upcoming" && <CourseGoalListUpcoming></CourseGoalListUpcoming>}
        {filter === "pending" && <CourseGoalListPending></CourseGoalListPending>}
        {filter === "completed" && <CourseGoalListCompleted></CourseGoalListCompleted>}

      </section>

      {/* <footer>
        <p>Designed with<span> ❤ </span>by RG</p>
      </footer> */}
    </div>
  );
};

export default Home;
