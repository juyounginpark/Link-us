import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Nationality } from '../App'
import DetailModal from '../components/DetailModal'

type Page = 'landing' | 'dashboard' | 'auth' | 'profile' | 'community'

interface DashboardProps {
    nationality: Nationality
    onBack: () => void
    onNavigate: (page: Page) => void
}

interface EventItem {
    id: number
    title: string
    title_ko: string
    type: string
    category: string
    date: string
    location: string
    location_ko: string
    description: string
    description_ko: string
    forForeigners: boolean
    forKoreans: boolean
    image: string
    organizer: string
}

interface JobItem {
    id: number
    title: string
    title_ko: string
    company: string
    company_ko: string
    location: string
    location_ko: string
    type: string
    duration: string
    salary: string
    description: string
    description_ko: string
    requirements: string[]
    forForeigners: boolean
    forKoreans: boolean
    visaSponsorship: boolean
    image: string
    deadline: string
}

type TabType = 'all' | 'events' | 'jobs' | 'volunteer'

function Dashboard({ nationality, onBack, onNavigate }: DashboardProps) {
    const { isAuthenticated, user } = useAuth()
    const [activeTab, setActiveTab] = useState<TabType>('all')
    const [events, setEvents] = useState<EventItem[]>([])
    const [jobs, setJobs] = useState<JobItem[]>([])
    const [loading, setLoading] = useState(true)

    // Modal state
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
    const [selectedJob, setSelectedJob] = useState<JobItem | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const isKorean = nationality === 'korean'

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const query = nationality ? `?nationality=${nationality}` : ''
                const response = await fetch(`/api/all${query}`)

                if (response.ok) {
                    const data = await response.json()
                    setEvents(data.events)
                    setJobs(data.jobs)
                } else {
                    console.error('Failed to fetch data')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [nationality])

    const getTagClass = (type: string) => {
        switch (type) {
            case 'event': return 'tag-event'
            case 'competition': return 'tag-event'
            case 'volunteer': return 'tag-volunteer'
            case 'internship': return 'tag-job'
            default: return 'tag-event'
        }
    }

    const filteredEvents = activeTab === 'volunteer'
        ? events.filter(e => e.type === 'volunteer')
        : activeTab === 'events'
            ? events.filter(e => e.type !== 'volunteer')
            : events

    const showEvents = activeTab === 'all' || activeTab === 'events' || activeTab === 'volunteer'
    const showJobs = activeTab === 'all' || activeTab === 'jobs'

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-left">
                        <button className="back-btn" onClick={onBack}>
                            ←
                        </button>
                        <span className="logo-text text-gradient">LINK-US</span>
                    </div>
                    <nav className="header-nav">
                        <button
                            className="nav-btn"
                            onClick={() => onNavigate('community')}
                        >
                            🏫 {isKorean ? '커뮤니티' : 'Community'}
                        </button>
                        {isAuthenticated ? (
                            <button
                                className="nav-btn nav-profile"
                                onClick={() => onNavigate('profile')}
                            >
                                <img src={user?.profileImage} alt="" className="nav-avatar" />
                                {user?.name}
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary nav-auth"
                                onClick={() => onNavigate('auth')}
                            >
                                {isKorean ? '로그인' : 'Login'}
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <main className="container">
                <section className="hero-section">
                    <div className="hero-content animate-fade-in">
                        <h1>
                            {isKorean ? '안녕하세요! 👋' : 'Welcome! 👋'}
                        </h1>
                        <p>
                            {isKorean
                                ? '오늘의 행사와 인턴십 기회를 확인하세요'
                                : 'Discover events, internships & opportunities curated for you'}
                        </p>
                    </div>
                </section>

                <div className="section-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        {isKorean ? '전체' : 'All'}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                        onClick={() => setActiveTab('events')}
                    >
                        {isKorean ? '행사 & 대회' : 'Events'}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        {isKorean ? '인턴십' : 'Internships'}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'volunteer' ? 'active' : ''}`}
                        onClick={() => setActiveTab('volunteer')}
                    >
                        {isKorean ? '봉사활동' : 'Volunteer'}
                    </button>
                </div>

                {loading ? (
                    <div className="cards-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card skeleton skeleton-card" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Events Section */}
                        {showEvents && filteredEvents.length > 0 && (
                            <section style={{ marginBottom: 'var(--space-2xl)' }}>
                                <div className="section-header">
                                    <h2>
                                        <span>🎉</span>
                                        {activeTab === 'volunteer'
                                            ? (isKorean ? '봉사활동' : 'Volunteer Opportunities')
                                            : (isKorean ? '행사 & 대회' : 'Events & Competitions')}
                                    </h2>
                                </div>
                                <div className="netflix-row">
                                    {filteredEvents.map((event, index) => (
                                        <article
                                            key={event.id}
                                            className="glass-card content-card animate-fade-in"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <img src={event.image} alt={event.title} className="card-image" />
                                            <div className="card-body">
                                                <div className="card-tags">
                                                    <span className={`tag ${getTagClass(event.type)}`}>{event.type}</span>
                                                    <span className="tag tag-event">{event.category}</span>
                                                </div>
                                                <h3 className="card-title">
                                                    {isKorean ? event.title_ko : event.title}
                                                </h3>
                                                <div className="card-meta">
                                                    <span>📍 {isKorean ? event.location_ko : event.location}</span>
                                                    <span>📅 {event.date}</span>
                                                </div>
                                                <p className="card-description">
                                                    {isKorean ? event.description_ko : event.description}
                                                </p>
                                                <div className="card-footer">
                                                    <span className="card-organizer">{event.organizer}</span>
                                                    <button
                                                        className="btn btn-primary card-action"
                                                        onClick={() => {
                                                            setSelectedEvent(event)
                                                            setSelectedJob(null)
                                                            setIsModalOpen(true)
                                                        }}
                                                    >
                                                        {isKorean ? '자세히' : 'View'}
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Jobs Section */}
                        {showJobs && jobs.length > 0 && (
                            <section>
                                <div className="section-header">
                                    <h2>
                                        <span>💼</span>
                                        {isKorean ? '인턴십 & 채용' : 'Internships & Jobs'}
                                    </h2>
                                </div>
                                <div className="netflix-row">
                                    {jobs.map((job, index) => (
                                        <article
                                            key={job.id}
                                            className="glass-card content-card animate-fade-in"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <img src={job.image} alt={job.company} className="card-image" />
                                            <div className="card-body">
                                                <div className="card-tags">
                                                    <span className="tag tag-job">{job.type}</span>
                                                    {job.visaSponsorship && (
                                                        <span className="tag tag-visa">VISA ✓</span>
                                                    )}
                                                </div>
                                                <h3 className="card-title">
                                                    {isKorean ? job.title_ko : job.title}
                                                </h3>
                                                <div className="card-meta">
                                                    <span>🏢 {isKorean ? job.company_ko : job.company}</span>
                                                    <span>📍 {isKorean ? job.location_ko : job.location}</span>
                                                    <span>💰 {job.salary}</span>
                                                    <span>⏱️ {job.duration}</span>
                                                </div>
                                                <p className="card-description">
                                                    {isKorean ? job.description_ko : job.description}
                                                </p>
                                                <div className="card-footer">
                                                    <span className="card-organizer">
                                                        {isKorean ? '마감: ' : 'Deadline: '}{job.deadline}
                                                    </span>
                                                    <button
                                                        className="btn btn-accent card-action"
                                                        onClick={() => {
                                                            setSelectedJob(job)
                                                            setSelectedEvent(null)
                                                            setIsModalOpen(true)
                                                        }}
                                                    >
                                                        {isKorean ? '지원하기' : 'Apply'}
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>

            <DetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedEvent(null)
                    setSelectedJob(null)
                }}
                event={selectedEvent}
                job={selectedJob}
                isKorean={isKorean}
            />
        </div>
    )
}

export default Dashboard
