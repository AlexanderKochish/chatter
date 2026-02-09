import { useGetCurrentUserQuery } from '@/features/auth/api/auth.api'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import Spinner from '@/shared/ui/Spinner/Spinner'

type Props = {
  children: ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const { data, isLoading, isFetching, isUninitialized } =
    useGetCurrentUserQuery()

  if (isLoading || isFetching || isUninitialized) {
    return <Spinner />
  }

  if (!data?.email) {
    console.warn('No user email found, redirecting to sign-in...')
    return <Navigate to="/sign-in" replace />
  }

  return <>{children}</>
}
export default ProtectedRoute
