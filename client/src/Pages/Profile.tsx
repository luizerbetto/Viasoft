import  Axios from 'axios';
import React, { useContext, useState } from 'react'
import { myContext } from './Context';

export default function Profile() {
  const [nameReceiver, setNameReceiver] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [listMessage, setListMessage] = useState<any[]>([])
  const ctx = useContext(myContext);

  const register = () => {
    const nameSender = ctx.username;
    Axios.post("http://localhost:4000/registerMessage", {
      nameSender: nameSender,
      nameReceiver,
      message
    }, {
      withCredentials: true
    }).then(res => {
      if(res.status === 200){
          alert("Sucesso");
      }
    })
  };

  const getRegister = () => {
    const nameSender = ctx.username;
    Axios.get("http://localhost:4000/messageslist/?name="+nameSender, {
      withCredentials: true
    },).then(res => {
      if(res.status === 200){
        setListMessage(res.data);
    }
    })
  };

  return (
    <div>
      <h1>Current Logged In User: {ctx.username}</h1>
      <br></br>
      <div className="registerFeedBack">
        <h1>FeedBack</h1>
        <input type="text" placeholder='Destinatario' onChange={e => setNameReceiver(e.target.value)}/>
        <textarea
          value={message}
          onChange={(
              ev: React.ChangeEvent<HTMLTextAreaElement>,
          ): void => setMessage(ev.target.value)}
        />
        <button onClick={register}>Register</button>
      </div>

      <div className="feedList">
        <button onClick={getRegister}>Listar FeedBack</button>
        <div >
          <div>
            <table className="registerFeedList">
              <tr>
                <th>
                  Receiver
                </th>
                <th>
                  Mensagem
                </th>
              </tr>
              {
                listMessage.map((feedback, index) => (
                  <tr>
                    <td>
                      {feedback.nameReceiver}
                    </td>
                    <td>
                    {feedback.message}
                    </td>
                  </tr>
                ))
              }
              
            </table>
            {/* <ul>
              <li>FeedBack 
                {
                  
                }
                
              </li>        
            </ul> */}
          </div>
        </div>
      </div>
      
    </div>
  )
}