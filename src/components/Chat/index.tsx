import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Socket } from "socket.io-client";
import { messages } from "../../utils/constants";
import { Message } from "../Message";
import UsersList from "../UsersList";
import style from "./style.module.scss";
const { TextArea } = Input;

export interface IProps {
  socket: Socket<any, any>;
}

export const Chat = ({ socket }: IProps) => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim()) {
      //send message
    }
  };

  const joinRoom = (roomId: string) => {
    console.log(id);
  };

  useEffect(() => {
    joinRoom(id);
  }, [id]);

  return (
    <div className={style.wrapper}>
      <div className={style.user_list}>
        <UsersList socket={socket} />
      </div>
      <div className={style.container}>
        <div className={style.chat}>
          {messages.map((item, index) => (
            <Message key={index} _message={item} />
          ))}
        </div>
        <div className={style.input}>
          <TextArea
            className={style.inner}
            placeholder={"Введите сообщение"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></TextArea>
        </div>
        <Button onClick={sendMessage}>Отправить сообщение</Button>
      </div>
    </div>
  );
};
