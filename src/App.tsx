import { useEffect } from "react";
import style from "./style.module.scss";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import { Chat } from "./components/Chat";
import openSocket from "socket.io-client";
import { Modal } from "./components/Modal";
import { toggleModal } from "./app/reducers/app";

//Connecting to socket server
const socket = openSocket("https://desolate-refuge-96015.herokuapp.com/");

export const App = () => {
  const { id, isModalActive } = useAppSelector((state: RootState) => state.app);
  const dispatch = useAppDispatch();

  //If no user, show sign modal
  useEffect(() => {
    dispatch(toggleModal(!id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Set sockets via props, cause redux gives an error on it
  return (
    <div className={style.container}>
      {isModalActive && <Modal socket={socket} />}
      <Chat socket={socket} />
    </div>
  );
};
