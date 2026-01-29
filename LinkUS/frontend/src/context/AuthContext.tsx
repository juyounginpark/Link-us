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

const TOKEN_KEY = 'linkus_access_token'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) {
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const userData = await response.json()
                setUser(userData)
            } else {
                // Token invalid or expired
                logout()
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // 1. Get Token
            const formData = new URLSearchParams()
            formData.append('username', email)
            formData.append('password', password)

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            })

            if (!response.ok) {
                return false
            }

            const data = await response.json()
            const token = data.access_token
            localStorage.setItem(TOKEN_KEY, token)

            // 2. Get User Details
            const meResponse = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (meResponse.ok) {
                const userData = await meResponse.json()
                setUser(userData)
                return true
            }
            return false
        } catch (error) {
            console.error('Login error:', error)
            return false
        }
    }

    const signup = async (data: SignupData): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                return true
            }
            return false
        } catch (error) {
            console.error('Signup error:', error)
            return false
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem(TOKEN_KEY)
    }

    const updateProfile = async (updates: Partial<User>) => {
        // In a real app, send PUT/PATCH to backend
        // For now, optimistic update locally
        if (!user) return
        setUser({ ...user, ...updates })
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
            {!loading && children}
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
