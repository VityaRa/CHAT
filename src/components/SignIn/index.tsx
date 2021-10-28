import { Button, Col, Input, PageHeader, Row } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useHistory } from "react-router-dom";
import openSocket, { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setRoom, setUser } from "../../app/reducers/app";
import { RootState } from "../../app/store";
import style from "./style.module.scss";

export interface IProps {
  socket: Socket<any, any>;
}

export const Sign = ({ socket }: IProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const history = useHistory();

  const createChat = () => {
    if (name.trim()) {

      const userData = {
        name,
        id: socket.id,
      };

      dispatch(setUser(userData));

      socket.emit("create_room", userData).on("send_room_id", (data: {id: string}) => {
        dispatch(setRoom(data.id));
        history.push(`/${data.id}`);
      });

      setName("");
    }
  };

  return (
    <div className={style.container}>
      <Row>
        <Col span="24">
          <h2 className={style.title}>Вход</h2>
        </Col>
      </Row>
      <Row align="middle">
        <Col className={style.input}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Введите имя"
          />
        </Col>
      </Row>
      <Row align="stretch" className={style.button}>
        <Col>
          <Button onClick={createChat}>Войти</Button>
        </Col>
      </Row>
    </div>
  );
};
