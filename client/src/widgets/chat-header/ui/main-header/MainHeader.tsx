import {
  ChatLogo,
  HamburgerMenuIcon,
  LogoutIcon,
  ProfileIcon,
} from "@shared/assets/icons";
import DropdownMenuCustom from "@shared/ui/DropdownMenu/DropdownMenu";
import DialogModal from "@shared/ui/Modal/Modal";
import { Profile } from "@features/profile/ui/Profile/Profile";
import s from "./MainHeader.module.css";
import { useLogout } from "@features/auth/model/hooks/useLogout";
import ConfirmModal from "@shared/ui/ConfirmModal/ConfirmModal";
import DropDownItem from "@shared/ui/DropdownItem/DropDownItem";
import { useChatLayoutStore } from "@/features/chat-layout/model/store/useChatLayoutStore";

const MainHeader = () => {
  const { isLogout, setIsLogout, isProfile, setIsProfile } =
    useChatLayoutStore();
  const { mutate } = useLogout();

  return (
    <div className={s.chatsTopHeader}>
      <DropdownMenuCustom
        trigger={
          <button className={s.btnWrapper}>
            <HamburgerMenuIcon
              width="25"
              height="25"
              aria-label="Customise options"
            />
          </button>
        }
      >
        <DropDownItem
          icon={<LogoutIcon />}
          text="Log out"
          onClick={() => setIsLogout(true)}
        />
        <DropDownItem
          icon={<ProfileIcon />}
          text="Profile"
          onClick={() => setIsProfile(true)}
        />
      </DropdownMenuCustom>
      <ChatLogo width="35" height="35" />
      <h1>Chatter</h1>
      <DialogModal position="40" isOpen={isProfile} setIsOpen={setIsProfile}>
        <Profile />
      </DialogModal>
      <ConfirmModal
        mutate={mutate}
        isOpen={isLogout}
        setIsOpen={setIsLogout}
        position="50"
      >
        Are you sure you want to leave the chat?
      </ConfirmModal>
    </div>
  );
};

export default MainHeader;
