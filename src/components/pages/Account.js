import React from 'react';
import { auth } from '../../config/firebase';
import classes from './Account.module.css';

const Account = () => {
  return (
    <div className={classes.account}>
        <class className={classes.user}>
            <h2><i class="fa-solid fa-user"></i> User Profile</h2>
            <p>Username: {auth.currentUser.displayName}</p>
            <p>Email : {auth.currentUser.email}</p>
        </class>
    </div>
  )
}

export default Account;