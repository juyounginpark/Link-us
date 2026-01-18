import { useState } from 'react'
import { useAuth, type SignupData } from '../context/AuthContext'

interface AuthPageProps {
    onSuccess: () => void
    onBack: () => void
    defaultNationality?: 'korean' | 'foreigner'
}

type AuthMode = 'login' | 'signup'

const UNIVERSITIES = [
    '서울대학교', '연세대학교', '고려대학교', '성균관대학교', '한양대학교',
    '중앙대학교', '경희대학교', '서강대학교', '이화여자대학교', '홍익대학교',
    '경북대학교', 'KAIST', 'POSTECH', 'Other / 기타'
]

function AuthPage({ onSuccess, onBack, defaultNationality = 'korean' }: AuthPageProps) {
    const { login, signup } = useAuth()
    const [mode, setMode] = useState<AuthMode>('login')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [university, setUniversity] = useState('')
    const [nationality, setNationality] = useState<'korean' | 'foreigner'>(defaultNationality)
    const [major, setMajor] = useState('')
    const [year, setYear] = useState(1)

    const isKorean = nationality === 'korean'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (mode === 'login') {
                const success = await login(email, password)
                if (success) {
                    onSuccess()
                } else {
                    setError(isKorean ? '이메일 또는 비밀번호가 올바르지 않습니다.' : 'Invalid email or password.')
                }
            } else {
                if (password !== confirmPassword) {
                    setError(isKorean ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.')
                    setLoading(false)
                    return
                }

                if (password.length < 6) {
                    setError(isKorean ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be at least 6 characters.')
                    setLoading(false)
                    return
                }

                const signupData: SignupData = {
                    email,
                    password,
                    name,
                    university,
                    nationality,
                    major,
                    year
                }

                const success = await signup(signupData)
                if (success) {
                    onSuccess()
                } else {
                    setError(isKorean ? '이미 등록된 이메일입니다.' : 'Email already registered.')
                }
            }
        } catch {
            setError(isKorean ? '오류가 발생했습니다.' : 'An error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container glass-card animate-fade-in">
                <button className="back-btn auth-back" onClick={onBack}>←</button>

                <div className="auth-header">
                    <span className="auth-logo">🌏</span>
                    <h1 className="text-gradient">LINK-US</h1>
                    <p>{mode === 'login'
                        ? (isKorean ? '로그인하여 계속하세요' : 'Sign in to continue')
                        : (isKorean ? '새 계정 만들기' : 'Create your account')
                    }</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setError(''); }}
                    >
                        {isKorean ? '로그인' : 'Login'}
                    </button>
                    <button
                        className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                        onClick={() => { setMode('signup'); setError(''); }}
                    >
                        {isKorean ? '회원가입' : 'Sign Up'}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label>{isKorean ? '이메일' : 'Email'}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={isKorean ? '이메일 주소' : 'Email address'}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>{isKorean ? '비밀번호' : 'Password'}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isKorean ? '비밀번호' : 'Password'}
                            required
                        />
                    </div>

                    {mode === 'signup' && (
                        <>
                            <div className="form-group">
                                <label>{isKorean ? '비밀번호 확인' : 'Confirm Password'}</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={isKorean ? '비밀번호 확인' : 'Confirm password'}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>{isKorean ? '이름' : 'Name'}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={isKorean ? '이름' : 'Full name'}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>{isKorean ? '국적' : 'Nationality'}</label>
                                    <select
                                        value={nationality}
                                        onChange={(e) => setNationality(e.target.value as 'korean' | 'foreigner')}
                                    >
                                        <option value="korean">🇰🇷 한국인</option>
                                        <option value="foreigner">🌍 외국인</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>{isKorean ? '학년' : 'Year'}</label>
                                    <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                                        <option value={1}>1{isKorean ? '학년' : 'st'}</option>
                                        <option value={2}>2{isKorean ? '학년' : 'nd'}</option>
                                        <option value={3}>3{isKorean ? '학년' : 'rd'}</option>
                                        <option value={4}>4{isKorean ? '학년' : 'th'}</option>
                                        <option value={5}>{isKorean ? '대학원' : 'Graduate'}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{isKorean ? '대학교' : 'University'}</label>
                                <select
                                    value={university}
                                    onChange={(e) => setUniversity(e.target.value)}
                                    required
                                >
                                    <option value="">{isKorean ? '대학교 선택' : 'Select university'}</option>
                                    {UNIVERSITIES.map(uni => (
                                        <option key={uni} value={uni}>{uni}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{isKorean ? '전공' : 'Major'}</label>
                                <input
                                    type="text"
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    placeholder={isKorean ? '전공 분야' : 'Your major'}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                        {loading
                            ? (isKorean ? '처리 중...' : 'Processing...')
                            : mode === 'login'
                                ? (isKorean ? '로그인' : 'Login')
                                : (isKorean ? '가입하기' : 'Sign Up')
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AuthPage
