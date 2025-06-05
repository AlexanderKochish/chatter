import { User } from "@shared/types/types";
import UserCard from "@shared/ui/UserCard/UserCard";
import s from "./ChatList.module.css";
import { useAddNewCompanion } from "../../model/hook/useAddNewCompanion";

type Props = {
  chatList: User[];
};

const ChatList = ({ chatList }: Props) => {
  const { mutate } = useAddNewCompanion();

  return (
    <ul className={s.searchList}>
      {chatList?.map(({ profile, name }) => (
        <li
          key={profile?.userId}
          onClick={() => mutate(profile?.userId)}
          onKeyDown={(e) => e.key === "Enter" && mutate(profile?.userId)}
          tabIndex={0}
          role="button"
        >
          <UserCard name={name} avatar={profile?.avatar as string} />
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
