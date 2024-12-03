import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const UserInfo:React.FC = () => {
    const userId = useSelector((state: RootState) => state.user.userId);
  return (
    <div>UserInfo</div>
  )
}

export default UserInfo