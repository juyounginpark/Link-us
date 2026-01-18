import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import CommunityPage from './pages/CommunityPage'
import './App.css'

export type Nationality = 'korean' | 'foreigner' | null
type Page = 'landing' | 'dashboard' | 'auth' | 'profile' | 'community'

function AppContent() {
  const { isAuthenticated, user } = useAuth()
  const [nationality, setNationality] = useState<Nationality>(null)
  const [currentPage, setCurrentPage] = useState<Page>('landing')

  const handleNationalitySelect = (selectedNationality: Nationality) => {
    setNationality(selectedNationality)
    setCurrentPage('dashboard')
  }

  const handleBack = () => {
    if (currentPage === 'auth' || currentPage === 'profile' || currentPage === 'community') {
      setCurrentPage('dashboard')
    } else {
      setNationality(null)
      setCurrentPage('landing')
    }
  }

  const handleAuthSuccess = () => {
    setCurrentPage('dashboard')
  }

  const navigateTo = (page: Page) => {
    setCurrentPage(page)
  }

  const isKorean = nationality === 'korean' || user?.nationality === 'korean'

  // If user is authenticated and nationality not set, use their profile nationality
  if (isAuthenticated && user && !nationality) {
    setNationality(user.nationality)
  }

  return (
    <>
      {currentPage === 'landing' && !nationality && (
        <LandingPage onSelect={handleNationalitySelect} />
      )}

      {currentPage === 'dashboard' && nationality && (
        <Dashboard
          nationality={nationality}
          onBack={handleBack}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'auth' && (
        <AuthPage
          onSuccess={handleAuthSuccess}
          onBack={handleBack}
          defaultNationality={nationality || 'korean'}
        />
      )}

      {currentPage === 'profile' && (
        <ProfilePage
          onBack={handleBack}
          isKorean={isKorean}
        />
      )}

      {currentPage === 'community' && (
        <CommunityPage
          onBack={handleBack}
          isKorean={isKorean}
        />
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
