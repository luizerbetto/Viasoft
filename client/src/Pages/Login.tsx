import  Axios from 'axios';
import React, { useState } from 'react'

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const login = () => {
        Axios.post("http://localhost:4000/login", {
          username,
          password
        }, {
          withCredentials: true
        }).then(res => {
            if(res.status === 200){
                window.location.href = "/"
            }
            
        })
      };

    return (
        <div>
            <h1>Login</h1>
            <input type="text" placeholder='username' onChange={e => setUsername(e.target.value)}/>
            <input type="text" placeholder='password' onChange={e => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
        </div>
    )
}
