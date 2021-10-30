import { Button, Col, Input, Row } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useAppDispatch } from "../../app/hooks";
import { setUser } from "../../app/reducers/app";
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
        //roomId is defined, so try to connect
        socket.emit("join_room", {
          user,
          roomId
        });
      } else {
        //no room id provided or user in root ("/"), so create room
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
