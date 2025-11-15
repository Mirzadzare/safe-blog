import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export default function AdminPrivateRoutes() {
    const { currentUser } = useSelector((state) => state.user)
  return currentUser ? <Outlet /> : <Navigate to='/sign-in'></Navigate> 
}
