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

// Mock data (same as backend for static demo)
const MOCK_EVENTS: EventItem[] = [
    {
        id: 1,
        title: "Seoul Hiking Club - Bukhansan",
        title_ko: "서울 등산 클럽 - 북한산",
        type: "event",
        category: "hiking",
        date: "2026-02-15",
        location: "Bukhansan National Park",
        location_ko: "북한산 국립공원",
        description: "Join us for a scenic hike up Bukhansan! All levels welcome.",
        description_ko: "북한산 등산에 함께해요! 모든 수준 환영합니다.",
        forForeigners: true,
        forKoreans: true,
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400",
        organizer: "Seoul Hiking Community"
    },
    {
        id: 2,
        title: "Korean Language Exchange",
        title_ko: "한국어 언어 교환",
        type: "event",
        category: "language",
        date: "2026-02-10",
        location: "Hongdae, Seoul",
        location_ko: "홍대, 서울",
        description: "Practice Korean with native speakers in a friendly cafe setting.",
        description_ko: "친근한 카페에서 원어민과 한국어를 연습하세요.",
        forForeigners: true,
        forKoreans: true,
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
        organizer: "Language Bridge Seoul"
    },
    {
        id: 3,
        title: "International Student Debate Club",
        title_ko: "유학생 토론 클럽",
        type: "event",
        category: "debate",
        date: "2026-02-20",
        location: "Yonsei University",
        location_ko: "연세대학교",
        description: "Weekly debate sessions on current affairs. Improve your public speaking!",
        description_ko: "시사 문제에 대한 주간 토론 세션. 발표 실력을 향상시키세요!",
        forForeigners: true,
        forKoreans: true,
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
        organizer: "Yonsei Debate Society"
    },
    {
        id: 4,
        title: "K-Pop Cover Dance Competition",
        title_ko: "K-Pop 커버댄스 대회",
        type: "competition",
        category: "dance",
        date: "2026-03-01",
        location: "COEX, Seoul",
        location_ko: "코엑스, 서울",
        description: "Show off your K-Pop dance skills! Prizes for top 3 teams.",
        description_ko: "K-Pop 댄스 실력을 뽐내세요! 상위 3팀에게 상품 수여.",
        forForeigners: true,
        forKoreans: true,
        image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400",
        organizer: "Korean Dance Federation"
    },
    {
        id: 5,
        title: "Art Exhibition Competition",
        title_ko: "미술 전시 대회",
        type: "competition",
        category: "art",
        date: "2026-03-15",
        location: "DDP, Seoul",
        location_ko: "동대문디자인플라자, 서울",
        description: "Submit your artwork for a chance to be featured in the exhibition!",
        description_ko: "전시회에 작품을 출품해보세요!",
        forForeigners: true,
        forKoreans: true,
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
        organizer: "Seoul Art Council"
    },
    {
        id: 6,
        title: "Volunteer Teaching at Local School",
        title_ko: "지역 학교 봉사활동",
        type: "volunteer",
        category: "education",
        date: "Every Saturday",
        location: "Various Schools, Seoul",
        location_ko: "서울 각 학교",
        description: "Teach English to elementary students. Great for community service hours!",
        description_ko: "초등학생들에게 영어를 가르쳐주세요. 봉사시간 인정!",
        forForeigners: true,
        forKoreans: true,
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
        organizer: "Seoul Volunteer Network"
    },
]

const MOCK_JOBS: JobItem[] = [
    {
        id: 101,
        title: "Software Engineering Intern",
        title_ko: "소프트웨어 엔지니어 인턴",
        company: "Samsung Electronics",
        company_ko: "삼성전자",
        location: "Suwon, Korea",
        location_ko: "수원",
        type: "internship",
        duration: "6 months",
        salary: "₩2,500,000/month",
        description: "Join our mobile development team. Work on cutting-edge Android features.",
        description_ko: "모바일 개발팀에 합류하세요. 최신 안드로이드 기능 개발.",
        requirements: ["CS Major", "Python or Java", "English Proficiency"],
        forForeigners: true,
        forKoreans: true,
        visaSponsorship: true,
        image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
        deadline: "2026-02-28"
    },
    {
        id: 102,
        title: "Marketing Intern (English Content)",
        title_ko: "마케팅 인턴 (영문 콘텐츠)",
        company: "Naver Corp",
        company_ko: "네이버",
        location: "Seongnam, Korea",
        location_ko: "성남",
        type: "internship",
        duration: "3 months",
        salary: "₩2,000,000/month",
        description: "Create English marketing content for global expansion projects.",
        description_ko: "글로벌 확장 프로젝트를 위한 영문 마케팅 콘텐츠 제작.",
        requirements: ["Marketing Major preferred", "Native English", "Creative Writing"],
        forForeigners: true,
        forKoreans: false,
        visaSponsorship: true,
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
        deadline: "2026-03-15"
    },
    {
        id: 103,
        title: "Data Science Intern",
        title_ko: "데이터 사이언스 인턴",
        company: "Kakao",
        company_ko: "카카오",
        location: "Pangyo, Korea",
        location_ko: "판교",
        type: "internship",
        duration: "6 months",
        salary: "₩2,800,000/month",
        description: "Analyze user behavior data and build ML models for recommendation systems.",
        description_ko: "사용자 행동 데이터 분석 및 추천 시스템 ML 모델 개발.",
        requirements: ["Statistics/CS Major", "Python", "SQL", "Machine Learning basics"],
        forForeigners: true,
        forKoreans: true,
        visaSponsorship: true,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
        deadline: "2026-03-01"
    },
    {
        id: 104,
        title: "UX Design Intern",
        title_ko: "UX 디자인 인턴",
        company: "Coupang",
        company_ko: "쿠팡",
        location: "Seoul, Korea",
        location_ko: "서울",
        type: "internship",
        duration: "4 months",
        salary: "₩2,200,000/month",
        description: "Design user interfaces for e-commerce platform. Figma experience required.",
        description_ko: "이커머스 플랫폼 UI 디자인. Figma 경험 필수.",
        requirements: ["Design Major", "Figma/Sketch", "Portfolio required"],
        forForeigners: true,
        forKoreans: true,
        visaSponsorship: false,
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
        deadline: "2026-02-20"
    },
    {
        id: 105,
        title: "Translation Intern (Chinese)",
        title_ko: "번역 인턴 (중국어)",
        company: "LG Electronics",
        company_ko: "LG전자",
        location: "Seoul, Korea",
        location_ko: "서울",
        type: "internship",
        duration: "3 months",
        salary: "₩1,800,000/month",
        description: "Translate product manuals and marketing materials between Korean and Chinese.",
        description_ko: "한국어-중국어 제품 매뉴얼 및 마케팅 자료 번역.",
        requirements: ["Chinese Native Speaker", "TOPIK Level 5+", "Technical Writing"],
        forForeigners: true,
        forKoreans: false,
        visaSponsorship: true,
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400",
        deadline: "2026-02-25"
    },
]

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
