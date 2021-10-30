import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setRoom, setUser } from "../../app/reducers/app";
import { RootState } from "../../app/store";
import { IMessage, IUser } from "../../utils/types";
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

  const sendMessage = () => {
    if (message.trim()) {
      const user = { name, id: socket.id };
      socket.emit("message", { message, user });
      setMessage("");
    }
  };

  socket.on("on_message", (message: IMessage) => {
    const newMessage: IMessage = {
      user: message.user,
      message: message.message,
      date: message.date
    };
    setMessages([...messages, newMessage]);
  });

  socket.on("message_list", (messages: IMessage[]) => {
    setMessages([...messages]);
  });

  socket.on("get_users", (data: IUser[]) => {
    console.log(data);
  });

  socket.on("error_inactive_chat", (error_msg: string) => {
    alert(error_msg);
    history.push("/");
    dispatch(setUser({ id: "", name: "" }));
  });

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
