import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import style from "./style.module.scss";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import { Chat } from "./components/Chat";
import { Sign } from "./components/SignIn";
import openSocket from "socket.io-client";
import { Modal } from "./components/Modal";
import { toggleModal } from "./app/reducers/app";

const socket = openSocket("http://localhost:4000");

function App() {
  const { id, roomId, name, isModalActive } = useAppSelector(
    (state: RootState) => state.app
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(toggleModal(!id));
  }, [id]);

  return (
    <div className={style.container}>
      {isModalActive && <Modal socket={socket} />}
      <Chat socket={socket}/>
    </div>
  );
}

export default App;
