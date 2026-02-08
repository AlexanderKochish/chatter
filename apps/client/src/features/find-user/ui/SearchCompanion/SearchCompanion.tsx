import { GlassIcon } from '@/shared/assets/icons'
import { useSearchUser } from '../../model/useSearchUser'
import DialogModal from '@/shared/ui/Modal/Modal'
import ChatList from '@/features/add-chat/ui/chat-list/ChatList'
import { Input } from '@/shared/ui/Input/Input'
import Button from '@/shared/ui/Button/Button'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store/store'
import { setIsSearch } from '@/features/chat-layout/model/store/chat-layout.api'

const SearchCompanion = () => {
  const dispatch = useDispatch()
  const { isSearch } = useSelector((state: RootState) => state.chatLayout)
  const { control, handleSubmit, data } = useSearchUser()

  return (
    <>
      <DialogModal
        dispatch={dispatch}
        isOpen={isSearch}
        setIsOpen={setIsSearch}
        title="Search"
        position="25"
      >
        <>
          <form onSubmit={handleSubmit((data) => data)}>
            <Input control={control} name="search" />
          </form>
          <ChatList chatList={data} />
        </>
      </DialogModal>
      <Button className="link" onClick={() => setIsSearch(true)}>
        <GlassIcon width="25" height="25" />
      </Button>
    </>
  )
}

export default SearchCompanion
