import React from 'react'
import { Navigate, replace } from 'react-router-dom'

interface AdminPrivateRouteProps {
    children: React.ReactNode
    isAuthencticated: boolean
}

export const AdminPrivateRoute:React.FC<AdminPrivateRouteProps> = ({ children , isAuthencticated}) => {
  return isAuthencticated ? <>{children}</> : <Navigate to='/admin'/>
}