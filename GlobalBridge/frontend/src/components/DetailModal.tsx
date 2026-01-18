import { useEffect } from 'react'

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

interface DetailModalProps {
    isOpen: boolean
    onClose: () => void
    event?: EventItem | null
    job?: JobItem | null
    isKorean: boolean
}

function DetailModal({ isOpen, onClose, event, job, isKorean }: DetailModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEscape)
        }
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    if (!isOpen || (!event && !job)) return null

    const isEvent = !!event

    return (
        <div className="detail-modal-overlay" onClick={onClose}>
            <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <div className="modal-hero">
                    <img
                        src={isEvent ? event!.image : job!.image}
                        alt={isEvent ? event!.title : job!.title}
                        className="modal-hero-image"
                    />
                    <div className="modal-hero-gradient" />
                    <div className="modal-hero-content">
                        <div className="modal-tags">
                            <span className={`tag ${isEvent ? 'tag-event' : 'tag-job'}`}>
                                {isEvent ? event!.type : job!.type}
                            </span>
                            {isEvent && (
                                <span className="tag tag-event">{event!.category}</span>
                            )}
                            {!isEvent && job!.visaSponsorship && (
                                <span className="tag tag-visa">VISA ✓</span>
                            )}
                        </div>
                        <h1 className="modal-title">
                            {isKorean
                                ? (isEvent ? event!.title_ko : job!.title_ko)
                                : (isEvent ? event!.title : job!.title)
                            }
                        </h1>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="modal-info-grid">
                        {isEvent ? (
                            <>
                                <div className="modal-info-item">
                                    <span className="info-icon">📍</span>
                                    <div>
                                        <span className="info-label">{isKorean ? '장소' : 'Location'}</span>
                                        <span className="info-value">{isKorean ? event!.location_ko : event!.location}</span>
                                    </div>
                                </div>
                                <div className="modal-info-item">
                                    <span className="info-icon">📅</span>
                                    <div>
                                        <span className="info-label">{isKorean ? '날짜' : 'Date'}</span>
                                        <span className="info-value">{event!.date}</span>
                                    </div>
                                </div>
                                <div className="modal-info-item">
                                    <span className="info-icon">👤</span>
                                    <div>
                                        <span className="info-label">{isKorean ? '주최' : 'Organizer'}</span>
                                        <span className="info-value">{event!.organizer}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="modal-info-item">
                                    <span className="info-icon">🏢</span>
                                    <div>
                                        <span className="info-label">{isKorean ? '회사' : 'Company'}</span>
                                        <span className="info-value">{isKorean ? job!.company_ko : job!.company}</span>
                                    </div>
                                </div>
                                <div className="modal-info-item">
                                    <span className="info-icon">📍</span>
                                    <div>
                                        <span className="info-label">{isKorean ? '위치' : 'Location'}</span>
                                        <span className="info-value">{isKorean ? job!.location_ko : job!.location}</span>
                                    </div>
                                </div>
                                <div className="modal-info-item">
                                    <span className="info-icon">💰</span>
                                    <div>
                                        <span className="info-label">{isKorean ? '급여' : 'Salary'}</span>
                                        <span className="info-value">{job!.salary}</span>
                                    </div>
                                </div>
                                <div className="modal-info-item">
                                    <span className="info-icon">⏱️</span>
                                    <div>
                                        <span className="info-label">{isKorean ? '기간' : 'Duration'}</span>
                                        <span className="info-value">{job!.duration}</span>
                                    </div>
                                </div>
                                <div className="modal-info-item">
                                    <span className="info-icon">📆</span>
                                    <div>
                                        <span className="info-label">{isKorean ? '마감일' : 'Deadline'}</span>
                                        <span className="info-value deadline">{job!.deadline}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="modal-section">
                        <h3>{isKorean ? '상세 내용' : 'Description'}</h3>
                        <p className="modal-description">
                            {isKorean
                                ? (isEvent ? event!.description_ko : job!.description_ko)
                                : (isEvent ? event!.description : job!.description)
                            }
                        </p>
                    </div>

                    {!isEvent && job!.requirements.length > 0 && (
                        <div className="modal-section">
                            <h3>{isKorean ? '지원 자격' : 'Requirements'}</h3>
                            <ul className="modal-requirements">
                                {job!.requirements.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="modal-actions">
                        {isEvent ? (
                            <button className="btn btn-primary modal-action-btn">
                                {isKorean ? '참가 신청하기' : 'Register Now'}
                            </button>
                        ) : (
                            <button className="btn btn-accent modal-action-btn">
                                {isKorean ? '지원하기' : 'Apply Now'}
                            </button>
                        )}
                        <button className="btn btn-secondary" onClick={onClose}>
                            {isKorean ? '닫기' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailModal
