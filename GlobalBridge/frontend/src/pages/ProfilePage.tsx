import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface ProfilePageProps {
    onBack: () => void
    isKorean: boolean
}

function ProfilePage({ onBack, isKorean }: ProfilePageProps) {
    const { user, updateProfile, logout } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [bio, setBio] = useState(user?.bio || '')

    if (!user) return null

    const handleSaveBio = () => {
        updateProfile({ bio })
        setIsEditing(false)
    }

    const handleLogout = () => {
        logout()
        onBack()
    }

    return (
        <div className="profile-page">
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-left">
                        <button className="back-btn" onClick={onBack}>←</button>
                        <span className="logo-text text-gradient">LINK-US</span>
                    </div>
                    <button className="btn btn-secondary" onClick={handleLogout}>
                        {isKorean ? '로그아웃' : 'Logout'}
                    </button>
                </div>
            </header>

            <main className="container">
                <div className="profile-container animate-fade-in">
                    <div className="profile-header glass-card">
                        <div className="profile-avatar">
                            <img src={user.profileImage} alt={user.name} />
                            <span className="profile-nationality">
                                {user.nationality === 'korean' ? '🇰🇷' : '🌍'}
                            </span>
                        </div>
                        <div className="profile-info">
                            <h1>{user.name}</h1>
                            <p className="profile-uni">{user.university}</p>
                            <div className="profile-tags">
                                <span className="tag tag-event">{user.major}</span>
                                <span className="tag tag-job">
                                    {user.year}{isKorean ? '학년' : user.year === 1 ? 'st Year' : user.year === 2 ? 'nd Year' : user.year === 3 ? 'rd Year' : 'th Year'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section glass-card">
                        <div className="section-header">
                            <h2>📝 {isKorean ? '자기소개' : 'Bio'}</h2>
                            {!isEditing && (
                                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                                    {isKorean ? '수정' : 'Edit'}
                                </button>
                            )}
                        </div>
                        {isEditing ? (
                            <div className="bio-edit">
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder={isKorean ? '자기소개를 작성하세요...' : 'Write something about yourself...'}
                                    rows={4}
                                />
                                <div className="bio-actions">
                                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                        {isKorean ? '취소' : 'Cancel'}
                                    </button>
                                    <button className="btn btn-primary" onClick={handleSaveBio}>
                                        {isKorean ? '저장' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="bio-text">
                                {user.bio || (isKorean ? '자기소개가 없습니다.' : 'No bio yet.')}
                            </p>
                        )}
                    </div>

                    <div className="profile-section glass-card">
                        <h2>📊 {isKorean ? '활동 현황' : 'Activity Summary'}</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-number">0</span>
                                <span className="stat-label">{isKorean ? '작성 글' : 'Posts'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">0</span>
                                <span className="stat-label">{isKorean ? '댓글' : 'Comments'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">0</span>
                                <span className="stat-label">{isKorean ? '참여 행사' : 'Events Joined'}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">0</span>
                                <span className="stat-label">{isKorean ? '지원 인턴십' : 'Applications'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section glass-card">
                        <h2>ℹ️ {isKorean ? '계정 정보' : 'Account Info'}</h2>
                        <div className="account-info">
                            <div className="info-row">
                                <span className="info-label">{isKorean ? '이메일' : 'Email'}</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">{isKorean ? '가입일' : 'Joined'}</span>
                                <span className="info-value">{user.joinedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfilePage
