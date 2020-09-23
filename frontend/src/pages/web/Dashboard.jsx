import React from "react"

function Dashboard(props, {...rest}) {
  const [clients, setClients] = React.useState([])
  const [email, setEmail] = React.useState([])
  const [history, setHistory] = React.useState([])

  const getClients = () => {
    props.socket.getAvailableUsers((err, clients) => {
      setClients(clients)
    })
  }

  const register = () => {
    props.socket.register(email, (err, email) => {
      console.log(email)
    })
    props.socket.join('room1', (err, history) => {
      setHistory(history)
    })
    props.socket.registerHandler((entry) => {
      setHistory(oldArray => [...oldArray, entry])
    })
  }

  const gotoDevices = () => {
    props.history.push("devices")
  }
  
  React.useEffect(() => {
    getClients();
    // eslint-disable-next-line
  },[]);
  return (
    <div>
      Dashboard
      <div>
        {clients}
      </div>
      <div>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
        <button onClick={register}>register</button>
        <div>
          {history.map((e, index) => <div key={index}>{index + ' ' + e.user + ' ' + e.event}</div>)}
        </div>
      </div>
      <div>
        <button onClick={gotoDevices}>devices</button>
      </div>
    </div>
  )
}

export default Dashboard
