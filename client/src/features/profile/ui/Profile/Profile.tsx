import { useProfile } from "../../../../shared/api/queries/useProfile";
import { PersonIcon } from "../../../../shared/assets/icons";
import TabsDemo from "../../../../shared/ui/Tabs/Tabs";
import { EditProfile } from "../EditProfile/EditProfile";
import s from "./Profile.module.css";

export const Profile = () => {
  return (
    <TabsDemo
      tabs={[
        {
          label: "Profile",
          value: "profile",
          content: <ViewProfile />,
        },
        {
          label: "Edit",
          value: "edit",
          content: <EditProfile />,
        },
      ]}
    />
  );
};

export const ViewProfile = () => {
  const { me } = useProfile();

  const { profile, name } = me;
  return (
    <div className={s.profile}>
      <div className={s.top}>
        <div className={s.avatarWrapper}>
          {!profile.avatar ? (
            <PersonIcon width="40" height="40" />
          ) : (
            <img src={profile.avatar} alt="avatar" className={s.avatar} />
          )}
        </div>
      </div>
      <div className={s.username}>Name: {name}</div>
      <div className={s.userbio}>Bio: {profile.bio}</div>
    </div>
  );
};
