import { Button, Col, Input, PageHeader, Row } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink, useHistory } from "react-router-dom";
import openSocket from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUser } from "../../app/reducers/user";
import { RootState } from "../../app/store";
import style from "./style.module.scss";

export const Sign = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");

  const history = useHistory()

  const joinChat = () => {
    if (name.trim()) {
      const socket = openSocket("http://localhost:4000");
      socket.on("connect", () => {
        dispatch(setUser({ name, id: socket.id }));
        socket.emit("name", name);
        history.push("/")
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
          <Button onClick={joinChat}>Войти</Button>
        </Col>
      </Row>
    </div>
  );
};
