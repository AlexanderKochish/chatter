import clsx from "clsx";
import { DrawingIcon, PersonIcon } from "@shared/assets/icons";
import s from "./UserCard.module.css";

type Props = {
  avatar: string | null | undefined;
  name: string;
  lastMessage?: string;
  active?: boolean;
  isOnline?: boolean;
};

const UserCard = ({ avatar, lastMessage, name, active, isOnline }: Props) => {
  const isActiveCard = active ? clsx(s.card, s.active) : s.card;
  const isOnlineUser = isOnline ? s.status : clsx(s.status, s.notActive);

  return (
    <div className={isActiveCard}>
      <div className={s.img}>
        {avatar ? (
          <img src={avatar} alt={`avatar of ${name}`} className={s.avatar} />
        ) : (
          <PersonIcon width="50" height="50" />
        )}
        <div className={isOnlineUser}></div>
      </div>
      <div className={s.content}>
        <div>{name}</div>
        <div className={s.lastMessage}>
          <span>{lastMessage}</span>
          <div>
            <DrawingIcon width="20" height="20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
