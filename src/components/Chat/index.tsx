import { Button, Input } from "antd";
import { useState } from "react";
import { useLocation, useParams } from "react-router";
import { messages } from "../../utils/constants";
import { Message } from "../Message";
import { UsersList } from "../UsersList";
import style from "./style.module.scss";
const { TextArea } = Input;

export const Chat = () => {
  const { id } = useParams<{ id?: string }>();
  const [message, setMessage] = useState("")


  return (
    <div className={style.wrapper}>
      <div className={style.user_list}>
        <UsersList />
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
        <Button>Отправить сообщение</Button>
      </div>
    </div>
  );
};
