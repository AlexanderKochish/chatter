import {
  ChatLogo,
  HamburgerMenuIcon,
  LogoutIcon,
  ProfileIcon,
} from '@/shared/assets/icons'
import DropdownMenuCustom from '@/shared/ui/DropdownMenu/DropdownMenu'
import DialogModal from '@/shared/ui/Modal/Modal'
import { Profile } from '@/features/profile/ui/Profile/Profile'
import s from './MainHeader.module.css'
import ConfirmModal from '@/shared/ui/ConfirmModal/ConfirmModal'
import DropDownItem from '@/shared/ui/DropdownItem/DropDownItem'
import SearchCompanion from '@/features/find-user/ui/SearchCompanion/SearchCompanion'
import { useLogOutMutation } from '@/features/auth/api/auth.api'
import {
  setIsLogout,
  setIsProfile,
} from '@/features/chat-layout/model/store/chat-layout.api'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store/store'
import { useNavigate } from 'react-router-dom'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { baseApi } from '@/shared/api/baseApi'

const MainHeader = () => {
  const dispatch = useDispatch()
  const { isProfile, isLogout } = useSelector(
    (state: RootState) => state.chatLayout
  )
  const [logOut, { isLoading }] = useLogOutMutation()
  const navigate = useNavigate()

  if (isLoading) {
    return <Spinner />
  }

  const handleLogout = async () => {
    try {
      await logOut().unwrap()
      dispatch(baseApi.util.resetApiState())
      dispatch(setIsLogout(false))
      navigate('/sign-in', { replace: true })
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <div className={s.chatsTopHeader}>
      <div className={s.topLogo}>
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
            icon={<ProfileIcon width="20" height="20" />}
            text="Profile"
            onClick={() => dispatch(setIsProfile(true))}
          />
          <DropDownItem
            icon={<LogoutIcon width="20" height="20" />}
            text="Log out"
            onClick={() => dispatch(setIsLogout(true))}
          />
        </DropdownMenuCustom>
        <ChatLogo width="35" height="35" />
        <h1>Chatter</h1>
        <DialogModal
          dispatch={dispatch}
          position="40"
          isOpen={isProfile}
          setIsOpen={setIsProfile}
        >
          <Profile />
        </DialogModal>
        <ConfirmModal
          mutate={handleLogout}
          isOpen={isLogout}
          setIsOpen={setIsLogout}
          position="50"
        >
          Are you sure you want to leave the chat?
        </ConfirmModal>
      </div>
      <SearchCompanion />
    </div>
  )
}

export default MainHeader
