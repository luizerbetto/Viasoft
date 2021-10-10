import  Axios from 'axios';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { myContext } from '../Pages/Context'

export default function NavBar() {
  const context = useContext(myContext);

  const logout = () => {
    Axios.get("http://localhost:4000/logout", {
      withCredentials: true
    }).then((res) => {
      if(res.data === "success"){
        window.location.href = "/"
      }
    })
  }
    return (
        <div className="NavContainer">
          { context ? (
            <>
              <Link onClick={logout} to="/logout">Logout</Link>
              {context.isAdmin ? (<Link to="/admin">Admin</Link>): null}              
              <Link to="/profile">Profile/FeedBack</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link> 
            </>
          )} 
            
            
            <Link to="/">Home</Link>
        </div>
    )
}
