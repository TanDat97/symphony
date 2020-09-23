import React from "react"
import { Switch, Route } from "react-router-dom"

import Socket from "utils/Socket"

import routes from "layouts/web/routes"

import Page404 from "pages/Page404"

const switchRoutes = (props, socket) => (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/pages") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => (<prop.component {...props} socket={socket}/>)}
            key={key}
            socket={socket}
          />
        );
      }
      return null;
    })}
    <Route path="/pages" component={Page404} />
    <Route path="/pages/*" component={Page404} />
    {/* <Redirect from="/pages" to="/pages/dashboard" /> */}
  </Switch>
);

function MainLayout(props, {...rest}) {
  const socket = Socket
  
  React.useEffect(() => {
    // socket.connect()
    return () => {
      socket.disconnect()
    };
    // eslint-disable-next-line
  },[]);

  return (
    <div>
      main layout
      {switchRoutes(props, socket)}
    </div>
  )
}

export default MainLayout