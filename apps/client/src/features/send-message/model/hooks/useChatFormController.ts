import { useSendMessage } from './useSendMessage'
import { useEditMessageStore } from '../store/editMessage.store'
import { editMessage, editMessageSchemaType } from '../zod/editMessage.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useGetCurrentUserQuery } from '@/features/auth/api/auth.api'
import { useParams } from 'react-router-dom'

export const useChatFormController = () => {
  const { roomId } = useParams()
  const { data: currentUser } = useGetCurrentUserQuery()

  const { updateMessage, handleTyping } = useSendMessage()

  const { editMessageId, editText, clearEditState } = useEditMessageStore()
  const {
    register: editRegister,
    setValue: setEditValue,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm<editMessageSchemaType>({
    defaultValues: {
      editMessage: '',
    },
    resolver: zodResolver(editMessage),
  })

  useEffect(() => {
    if (editMessageId && editText) {
      setEditValue('editMessage', editText)
    }
  }, [editMessageId, editText, setEditValue])

  const onEditSubmit = async (data: { editMessage: string }) => {
    if (editMessageId && currentUser?.id) {
      await updateMessage({
        roomId: roomId as string,
        msgId: editMessageId,
        ownerId: currentUser?.id,
        text: data.editMessage,
      })
      resetEdit()
      clearEditState()
    }
  }

  return {
    edit: {
      editRegister,
      editMessageId,
      handleSubmitEdit: handleSubmitEdit(onEditSubmit),
      onEditSubmit,
    },
    typingArgs: {
      handleTyping,
      roomId,
      currentUser,
    },
  }
}
