import { User } from "@/shared/types/types";
import UserCard from "@/shared/ui/UserCard/UserCard";
import s from "./ChatList.module.css";
import { useAddCompanionMutation } from "../../api/add-companion.api";

type Props = {
  chatList: User[] | undefined;
};

const ChatList = ({ chatList }: Props) => {
  const [addCompanion] = useAddCompanionMutation();

  return (
    <ul className={s.searchList}>
      {chatList?.map(({ profile, name }) => (
        <li
          key={profile?.userId}
          onClick={() => addCompanion({ targetUserId: profile?.userId })}
          onKeyDown={(e) =>
            e.key === "Enter" && addCompanion({ targetUserId: profile?.userId })
          }
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
