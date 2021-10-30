import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUser } from "../../app/reducers/app";
import { RootState } from "../../app/store";
import { IMessage } from "../../utils/types";
import { Message } from "../Message";
import UsersList from "../UsersList";
import style from "./style.module.scss";

const { TextArea } = Input;

export interface IProps {
  socket: Socket<any, any>;
}

export const Chat = ({ socket }: IProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { name } = useAppSelector((state: RootState) => state.app);
  const dispatch = useAppDispatch();
  const history = useHistory();

  //Send message to other users
  const sendMessage = () => {
    if (message.trim()) {
      const user = { name, id: socket.id };
      socket.emit("message", { message, user });
      setMessage("");
    }
  };

  //Get message from other users
  socket.on("on_message", (message: IMessage) => {
    const newMessage: IMessage = {
      user: message.user,
      message: message.message,
      date: message.date
    };
    setMessages([...messages, newMessage]);
  });

  //On connection, setting messageList
  socket.on("message_list", (messages: IMessage[]) => {
    setMessages([...messages]);
  });

  //If there is no chat, alert error and go to /
  useEffect(() => {
    socket.on("error_inactive_chat", (error_msg: string) => {
      alert(error_msg);
      history.push("/");
      dispatch(setUser({ id: "", name: "" }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
