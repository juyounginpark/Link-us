import type { Nationality } from '../App'

interface LandingPageProps {
    onSelect: (nationality: Nationality) => void
}

function LandingPage({ onSelect }: LandingPageProps) {
    return (
        <div className="landing-page">
            <div className="landing-content animate-fade-in">
                <span className="landing-logo">🌏</span>
                <h1 className="landing-title">
                    <span className="text-gradient">LINK-US</span>
                </h1>

                <div className="landing-mission">
                    <p className="mission-main">
                        정보의 불균형으로 고립되기 쉬운 <strong>외국인 유학생</strong>과<br />
                        글로벌 역량을 키우고 싶은 <strong>재학생</strong>을<br />
                        하나의 플랫폼으로 연결합니다.
                    </p>
                    <p className="mission-sub">
                        Connecting <strong>international students</strong> isolated by information gaps<br />
                        with <strong>local students</strong> seeking global competence<br />
                        on a single unified platform.
                    </p>
                    <div className="mission-divider"></div>
                    <p className="mission-desc">
                        문화 교류(행사)와 실질적인 커리어(인턴십),<br />
                        그리고 인적 네트워크(매칭)를 동시에 제공하여<br />
                        '지속 가능한 글로벌 캠퍼스 생태계'를 구축합니다.
                    </p>
                    <p className="mission-desc-en">
                        We build a 'sustainable global campus ecosystem' by providing<br />
                        cultural exchange (events), practical career support (internships),<br />
                        and human networks (matching) simultaneously.
                    </p>
                </div>

                <div className="nationality-cards">
                    <div
                        className="glass-card nationality-card"
                        onClick={() => onSelect('korean')}
                    >
                        <span className="emoji">🇰🇷</span>
                        <h3>한국인 학생</h3>
                        <p>Korean Student</p>
                    </div>

                    <div
                        className="glass-card nationality-card"
                        onClick={() => onSelect('foreigner')}
                    >
                        <span className="emoji">🌍</span>
                        <h3>외국인 유학생</h3>
                        <p>International Student</p>
                    </div>
                </div>

                <div className="landing-features">
                    <div className="feature-card glass-card">
                        <span className="feature-icon">🎉</span>
                        <h3>참여와 교류 / Participation</h3>
                        <p>
                            등산, 토론 등 소모임부터 각종 문화 행사까지.<br />
                            누구나 쉽게 참여하고 즐길 수 있습니다.
                        </p>
                        <p className="feature-en">
                            From small gatherings to cultural events.<br />
                            Everyone can easily participate and enjoy.
                        </p>
                    </div>

                    <div className="feature-card glass-card">
                        <span className="feature-icon">💼</span>
                        <h3>기회 연결 / Opportunity</h3>
                        <p>
                            유학생들이 가장 어려워하는 '인턴십 찾기'를 해결합니다.<br />
                            검증된 외국인 채용 공고만 큐레이션합니다.
                        </p>
                        <p className="feature-en">
                            Solving the 'internship search' challenge.<br />
                            Curated job postings for international talents.
                        </p>
                    </div>

                    <div className="feature-card glass-card">
                        <span className="feature-icon">🤝</span>
                        <h3>버디 매칭 / Buddy Matching</h3>
                        <p>
                            관심사 및 전공 기반으로 매칭되는<br />
                            나만의 글로벌 러닝 메이트.
                        </p>
                        <p className="feature-en">
                            Your global learning mate<br />
                            matched by interests and major.
                        </p>
                    </div>
                </div>

                <footer className="landing-footer">
                    <p>by 투움냠게렐, 박주영</p>
                </footer>
            </div>
        </div>
    )
}

export default LandingPage
