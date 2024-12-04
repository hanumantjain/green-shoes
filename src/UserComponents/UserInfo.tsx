import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../store';

const UserInfo: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const backendBaseUrl: string | undefined = process.env.REACT_APP_BACKEND_BASEURL;

  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/user/${userId}`);
        setUserInfo(response.data); // Store the response data in state
      } catch (err) {
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId, backendBaseUrl]);


  return (
    <div>
      {userInfo ? (
        <div>
          <div className='flex flex-col gap-4 text-2xl p-20'>
            <p>Hello, <strong>{userInfo.firstname} {userInfo.lastname}!</strong></p>
            <p>You'r email is, <strong>{userInfo.useremail}</strong></p>
          </div>
        </div>
      ) : (
        <div>User not found</div>
      )}
    </div>
  );
};

export default UserInfo;
