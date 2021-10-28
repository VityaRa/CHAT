import { Socket } from "socket.io-client";
import { Sign } from "../SignIn";
import style from "./style.module.scss";

export interface IProps {
  socket: Socket<any, any>;
}

export const Modal = ({ socket }: IProps) => {
  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <Sign socket={socket} />
      </div>
    </div>
  );
};
