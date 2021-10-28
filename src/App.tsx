import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import style from "./style.module.scss";
import { useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import { Chat } from "./components/Chat";
import { Sign } from "./components/SignIn";

function App() {
  const { user } = useAppSelector((state: RootState) => state);

  const id = "123123";

  return (
    <div className={style.container}>
      <Switch>
        <Route path="/sign">
          <Sign />
        </Route>

        <Route path="/room/:id">
          {!user.id ? <Redirect to="/sign" /> : <Chat />}
        </Route>
        <Route exact>
          {!user.id ? <Redirect to="/sign" /> : <Redirect to={`/room/${id}`} />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
