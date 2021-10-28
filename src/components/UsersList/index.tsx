import { usersList } from "../../utils/constants";
import style from "./style.module.scss";

export const UsersList = () => {
  return (
    <div className={style.container}>
      <h2>Активные пользователи: </h2>
      <div className={style.list}>
        {usersList.map((user, index) => (
          <p key={index} className={style.item}>{user.name}</p>
        ))}
      </div>
    </div>
  );
};
