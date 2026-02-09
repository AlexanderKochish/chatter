import { useForm } from 'react-hook-form'
import { signInSchema, SignInSchemaType } from '../zod/auth.schema'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useSignInMutation } from '../../api/auth.api'

export const useSignIn = () => {
  const navigate = useNavigate()
  const [signIn, ...rest] = useSignInMutation()
  const { handleSubmit, control, reset } = useForm<SignInSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInSchemaType) => {
    try {
      await signIn(data).unwrap()

      toast.success('Logged is successful')
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 10)
      reset()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
        throw new Error(error.message)
      }
    }
  }

  return {
    handleSubmit: handleSubmit(onSubmit),
    control,
    ...rest,
  }
}
