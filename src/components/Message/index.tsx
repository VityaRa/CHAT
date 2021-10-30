import classNames from "classnames";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { IMessage } from "../../utils/types";
import style from "./style.module.scss";

interface IProps {
  _message: IMessage;
}

export const Message = ({ _message }: IProps) => {
  const { date, message } = _message;
  const { name, id } = _message.user;
  const currentId = useAppSelector((state: RootState) => state.app.id);
  
  return (
    <div
      className={classNames(style.container, {
        [style.active]: currentId === id
      })}
    >
      <div className={style.inner}>
        <div className={style.meta}>
          <p className={style.name}>{name}</p>
          <p className={style.date}>{date}</p>
        </div>
        <p className={style.message}>{message}</p>
      </div>
    </div>
  );
};
