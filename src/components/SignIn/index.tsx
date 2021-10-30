import { Button, Col, Input, PageHeader, Row } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import openSocket, { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setRoom, setUser } from "../../app/reducers/app";
import { RootState } from "../../app/store";
import { useRoom } from "../../utils/hooks/useRoom";
import { IUser } from "../../utils/types";
import style from "./style.module.scss";

export interface IProps {
  socket: Socket<any, any>;
}

export const Sign = ({ socket }: IProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const history = useHistory();
  const roomId = useRoom();

  const login = () => {
    if (name.trim()) {
      const user: IUser = { name, id: socket.id };
      dispatch(setUser(user));
      if (roomId) {
        socket.emit("join_room", {
          user,
          roomId,
        });
      } else {
        socket.emit("create_room", user).on("room_id", (roomId: string) => {
          setName("");
          history.push(roomId);
        });
      }
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
          <Button onClick={login}>Войти</Button>
        </Col>
      </Row>
    </div>
  );
};
