import React from "react"

function Devices(props) {
  const [clients, setClients] = React.useState([])
  const [rooms, setRooms] = React.useState([])

  const getClients = () => {
    props.socket.getAvailableUsers((err, clients) => {
      setClients(clients)
    })
  }

  const getRooms = () => {
    props.socket.getRooms((err, rooms) => {
      console.log(rooms)
      setRooms(rooms)
    })
  }

  const gotoDashboard = () => {
    props.history.push("dashboard")
  }

  React.useEffect(() => {
    getClients();
    // eslint-disable-next-line
  },[]);

  return (
    <div>
      Devices
      <div>
        {clients} clients
      </div>
      <div>
        <button onClick={getRooms}>getRooms</button>
        {rooms.map((e, index) => <div key={index}>{e.numClient}</div>)}
      </div>
      <div>
        <button onClick={gotoDashboard}>dashboard</button>
      </div>
    </div>
  )
}

export default Devices
