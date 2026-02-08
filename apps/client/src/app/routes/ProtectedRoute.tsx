import { useGetCurrentUserQuery } from '@/features/auth/api/auth.api'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Spinner from '@/shared/ui/Spinner/Spinner'

type Props = {
  children: ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const { data, isLoading, isFetching } = useGetCurrentUserQuery()

  if (isLoading || isFetching) {
    return <Spinner />
  }

  if (!data?.email) {
    return <Navigate to="/sign-in" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
