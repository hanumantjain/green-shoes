import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import axiosInstance from '../utils/axios'

interface AuthContextType {
    isAuthenticated: boolean
    isGuest: boolean
    userEmail: string | null
    UserLogin: (email: string) => void
    guestLogin: () => void
    UserLogout: () => void
}

const UserAuthContext = createContext<AuthContextType | undefined> (undefined)

export const useAuth = () => {
    const context = useContext(UserAuthContext)
    if (!context){
        throw new Error('useAuth muust be within AuthProvider')
    }
    return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>{
        return localStorage.getItem('isAuthenticated') === 'true'
    })
    const [isGuest, setIsGuest] = useState<boolean>(() => {
        return localStorage.getItem('isGuest') === 'true'
    })
    const [userEmail, setUserEmail] = useState<string | null>(() => {
        return localStorage.getItem('userEmail')
    })

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get('/validateToken')
                if(response.status === 200){
                    setIsAuthenticated(true)
                    setUserEmail(response.data.userEmail)
                    localStorage.setItem('isAuthenticated', 'true')
                    localStorage.setItem('userEmail', response.data.userEmail)
                }
            }catch (error){
                console.error('Token validation failed', error)
            }
        }
        checkAuth()
    }, [])

    const UserLogin = (email: string) => {
        setIsAuthenticated(true)
        setUserEmail(email)
        setIsGuest(false)
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', email)
    }

    const guestLogin = () => {
        setIsAuthenticated(true)
        setIsGuest(true)
        setUserEmail('Guest User')
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', 'Guest User')
        localStorage.setItem('isGuest', 'true')
    }
    const UserLogout = async () => {
        try {
            await axiosInstance.post('/logout', {}, { withCredentials: true })
        } catch (error) {
            console.error('Logout failed', error)
        }
        setIsAuthenticated(false)
        setIsGuest(false)
        setUserEmail(null)
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('userEmail')
    }

    return (
        <UserAuthContext.Provider value={{ isAuthenticated, isGuest, userEmail, UserLogin, guestLogin, UserLogout }}>
            {children}
        </UserAuthContext.Provider>
    )


}