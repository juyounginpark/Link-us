import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface User {
    id: string
    email: string
    name: string
    university: string
    nationality: 'korean' | 'foreigner'
    major: string
    year: number
    bio: string
    joinedDate: string
    profileImage: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    signup: (userData: SignupData) => Promise<boolean>
    logout: () => void
    updateProfile: (updates: Partial<User>) => void
}

export interface SignupData {
    email: string
    password: string
    name: string
    university: string
    nationality: 'korean' | 'foreigner'
    major: string
    year: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database (localStorage)
const USERS_KEY = 'globalbridge_users'
const CURRENT_USER_KEY = 'globalbridge_current_user'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem(CURRENT_USER_KEY)
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const getUsers = (): Record<string, User & { password: string }> => {
        const users = localStorage.getItem(USERS_KEY)
        return users ? JSON.parse(users) : {}
    }

    const saveUsers = (users: Record<string, User & { password: string }>) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        const users = getUsers()
        const userRecord = users[email]

        if (userRecord && userRecord.password === password) {
            const { password: _, ...userData } = userRecord
            setUser(userData)
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
            return true
        }
        return false
    }

    const signup = async (data: SignupData): Promise<boolean> => {
        const users = getUsers()

        if (users[data.email]) {
            return false // Email already exists
        }

        const newUser: User & { password: string } = {
            id: Date.now().toString(),
            email: data.email,
            password: data.password,
            name: data.name,
            university: data.university,
            nationality: data.nationality,
            major: data.major,
            year: data.year,
            bio: '',
            joinedDate: new Date().toISOString().split('T')[0],
            profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`
        }

        users[data.email] = newUser
        saveUsers(users)

        const { password: _, ...userData } = newUser
        setUser(userData)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
        return true
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem(CURRENT_USER_KEY)
    }

    const updateProfile = (updates: Partial<User>) => {
        if (!user) return

        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))

        // Also update in users database
        const users = getUsers()
        if (users[user.email]) {
            users[user.email] = { ...users[user.email], ...updates }
            saveUsers(users)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            signup,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
