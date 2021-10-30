import { Button } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { usersList } from "../../utils/constants";
import { IUser } from "../../utils/types";
import style from "./style.module.scss";

export interface IProps {
  socket: Socket<any, any>;
}

const UsersList = ({ socket }: IProps) => {
  const [userList, setUserList] = useState<IUser[]>([]);

  socket.on("new_connection", (user: IUser) => {
    setUserList([...userList, user]);
  });

  socket.on("end_connection", (data: string) => {
    setUserList(userList.filter((user) => user.id !== data));
  });

  socket.on("user_list", (users: IUser[]) => {
    setUserList([
      ...userList,
      ...users.filter((user) => user.id !== socket.id)
    ]);
  });

  return (
    <div className={style.container}>
      <h2>Активные пользователи: </h2>
      {/* <Button onClick={() => {socket.emit("disc", userList[0].id)}}>DELTE</Button> */}
      <div className={style.list}>
        {userList.length
          ? userList.map((user, index) => (
              <p key={index} className={style.item}>
                {user.name}
              </p>
            ))
          : []}
      </div>
    </div>
  );
};

export default React.memo(UsersList);
