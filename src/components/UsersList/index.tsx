import React from "react";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { IUser } from "../../utils/types";
import style from "./style.module.scss";

export interface IProps {
  socket: Socket<any, any>;
}

const UsersList = ({ socket }: IProps) => {
  const [userList, setUserList] = useState<IUser[]>([]);

  //When someone joins room, add him to list
  socket.on("new_connection", (user: IUser) => {
    setUserList([...userList, user]);
  });

  //When someone leaves room, remove him from, list
  socket.on("end_connection", (data: string) => {
    setUserList(userList.filter((user) => user.id !== data));
  });

  //On connection, set currently active users, expect user, because "new_connection" doing it
  socket.on("user_list", (users: IUser[]) => {
    setUserList([
      ...userList,
      ...users.filter((user) => user.id !== socket.id)
    ]);
  });

  return (
    <div className={style.container}>
      <h2>Активные пользователи: </h2>
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
