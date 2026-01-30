import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface CommunityPageProps {
    onBack: () => void
    isKorean: boolean
}

interface Post {
    id: string
    authorId: string
    authorName: string
    authorUni: string
    authorNationality: 'korean' | 'foreigner'
    title: string
    content: string
    category: PostCategory
    createdAt: string
    likes: number
    comments: number
}

type PostCategory = 'general' | 'qna' | 'events' | 'jobs' | 'tips'
// Sample posts
const SAMPLE_POSTS: Post[] = [
    {
        id: '1',
        authorId: 'system',
        authorName: 'LINK-US Team',
        authorUni: 'Admin',
        authorNationality: 'korean',
        title: '환영합니다! Welcome to LINK-US Community! 🎉',
        content: 'LINK-US 커뮤니티에 오신 것을 환영합니다! 여기서 다양한 정보를 공유하고 친구를 만들어보세요.\n\nWelcome to LINK-US! Share information and make friends here.',
        category: 'general',
        createdAt: '2026-01-15',
        likes: 42,
        comments: 12
    },
    {
        id: '2',
        authorId: 'user1',
        authorName: 'Kim Minjun',
        authorUni: '연세대학교',
        authorNationality: 'korean',
        title: '외국인 친구들과 언어교환 하실 분 구해요!',
        content: '안녕하세요! 저는 영어를 배우고 싶은 한국인 학생입니다. 한국어를 배우고 싶은 외국인 친구분들과 언어교환 하고 싶어요. 관심 있으시면 댓글 남겨주세요!',
        category: 'general',
        createdAt: '2026-01-17',
        likes: 15,
        comments: 8
    },
    {
        id: '3',
        authorId: 'user2',
        authorName: 'Emma Wilson',
        authorUni: 'Korea University',
        authorNationality: 'foreigner',
        title: 'Tips for Finding Student Accommodation in Seoul',
        content: 'Hey everyone! I wanted to share some tips for international students looking for housing in Seoul:\n\n1. Start looking early (2-3 months before)\n2. Check university bulletin boards\n3. Join Facebook groups for housing\n4. Consider goshiwon for short term\n\nFeel free to ask questions!',
        category: 'tips',
        createdAt: '2026-01-16',
        likes: 28,
        comments: 15
    },
    {
        id: '4',
        authorId: 'user3',
        authorName: '이서연',
        authorUni: '서울대학교',
        authorNationality: 'korean',
        title: '삼성전자 인턴십 면접 후기',
        content: '안녕하세요, 최근 삼성전자 SSAFY 인턴십 면접을 봤습니다. 면접 과정과 준비 팁을 공유합니다:\n\n1. 기술 면접: 알고리즘 문제 2개\n2. 인성 면접: 팀워크 경험 중심\n3. 영어 면접: 간단한 자기소개\n\n질문 있으시면 댓글 주세요!',
        category: 'jobs',
        createdAt: '2026-01-18',
        likes: 35,
        comments: 22
    }
]

function CommunityPage({ onBack, isKorean }: CommunityPageProps) {
    const { user, isAuthenticated } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [activeCategory, setActiveCategory] = useState<PostCategory | 'all'>('all')
    const [showNewPostModal, setShowNewPostModal] = useState(false)
    const [newPostTitle, setNewPostTitle] = useState('')
    const [newPostContent, setNewPostContent] = useState('')
    const [newPostCategory, setNewPostCategory] = useState<PostCategory>('general')

    useEffect(() => {
        // Load posts from API
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts')
                if (res.ok) {
                    const data = await res.json()
                    setPosts(data.posts.map((p: any) => ({
                        id: p.id,
                        authorId: p.author_email,
                        authorName: p.author_name,
                        authorUni: p.author_university || '',
                        authorNationality: p.author_nationality || 'korean',
                        title: p.title,
                        content: p.content,
                        category: p.category,
                        createdAt: p.created_at?.split('T')[0] || '',
                        likes: 0,
                        comments: 0
                    })))
                } else {
                    // Fallback to sample posts
                    setPosts(SAMPLE_POSTS)
                }
            } catch {
                setPosts(SAMPLE_POSTS)
            }
        }
        fetchPosts()
    }, [])

    const categories: { key: PostCategory | 'all'; label: string; labelKo: string; emoji: string }[] = [
        { key: 'all', label: 'All', labelKo: '전체', emoji: '📋' },
        { key: 'general', label: 'General', labelKo: '자유게시판', emoji: '💬' },
        { key: 'qna', label: 'Q&A', labelKo: '질문답변', emoji: '❓' },
        { key: 'events', label: 'Events', labelKo: '행사홍보', emoji: '🎉' },
        { key: 'jobs', label: 'Jobs', labelKo: '취업정보', emoji: '💼' },
        { key: 'tips', label: 'Tips', labelKo: '꿀팁공유', emoji: '💡' },
    ]

    const filteredPosts = activeCategory === 'all'
        ? posts
        : posts.filter(p => p.category === activeCategory)

    const handleCreatePost = async () => {
        if (!user || !newPostTitle.trim() || !newPostContent.trim()) return

        try {
            const token = localStorage.getItem('linkus_access_token')
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newPostTitle,
                    content: newPostContent,
                    category: newPostCategory
                })
            })

            if (res.ok) {
                const newPost = await res.json()
                setPosts([{
                    id: newPost.id,
                    authorId: newPost.author_email,
                    authorName: newPost.author_name,
                    authorUni: newPost.author_university || '',
                    authorNationality: newPost.author_nationality || 'korean',
                    title: newPost.title,
                    content: newPost.content,
                    category: newPost.category,
                    createdAt: newPost.created_at?.split('T')[0] || '',
                    likes: 0,
                    comments: 0
                }, ...posts])
            }
        } catch (err) {
            console.error('Failed to create post', err)
        }

        setNewPostTitle('')
        setNewPostContent('')
        setNewPostCategory('general')
        setShowNewPostModal(false)
    }

    const handleLike = (postId: string) => {
        const updatedPosts = posts.map(p =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
        )
        setPosts(updatedPosts)
    }

    return (
        <div className="community-page">
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-left">
                        <button className="back-btn" onClick={onBack}>←</button>
                        <span className="logo-text text-gradient">LINK-US</span>
                    </div>
                    <div className="header-right">
                        <span className="page-title">🏫 {isKorean ? '커뮤니티' : 'Community'}</span>
                    </div>
                </div>
            </header>

            <main className="container">
                <div className="community-header animate-fade-in">
                    <h1>{isKorean ? '대학생 커뮤니티' : 'Student Community'}</h1>
                    <p>{isKorean
                        ? '다양한 대학의 학생들과 정보를 공유하세요'
                        : 'Connect and share with students from various universities'}
                    </p>
                </div>

                <div className="community-layout">
                    <aside className="community-sidebar glass-card">
                        <h3>{isKorean ? '카테고리' : 'Categories'}</h3>
                        <nav className="category-nav">
                            {categories.map(cat => (
                                <button
                                    key={cat.key}
                                    className={`category-btn ${activeCategory === cat.key ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.key)}
                                >
                                    <span>{cat.emoji}</span>
                                    <span>{isKorean ? cat.labelKo : cat.label}</span>
                                </button>
                            ))}
                        </nav>

                        {isAuthenticated && (
                            <button
                                className="btn btn-primary new-post-btn"
                                onClick={() => setShowNewPostModal(true)}
                            >
                                ✏️ {isKorean ? '글쓰기' : 'New Post'}
                            </button>
                        )}
                    </aside>

                    <div className="posts-list">
                        {!isAuthenticated && (
                            <div className="glass-card login-prompt">
                                <p>{isKorean
                                    ? '글을 작성하려면 로그인이 필요합니다.'
                                    : 'Please login to create posts.'}
                                </p>
                            </div>
                        )}

                        {filteredPosts.length === 0 ? (
                            <div className="empty-state glass-card">
                                <span className="emoji">📭</span>
                                <p>{isKorean ? '아직 게시글이 없습니다.' : 'No posts yet.'}</p>
                            </div>
                        ) : (
                            filteredPosts.map((post, index) => (
                                <article
                                    key={post.id}
                                    className="post-card glass-card animate-fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="post-header">
                                        <div className="post-author">
                                            <span className="author-flag">
                                                {post.authorNationality === 'korean' ? '🇰🇷' : '🌍'}
                                            </span>
                                            <div className="author-info">
                                                <span className="author-name">{post.authorName}</span>
                                                <span className="author-uni">{post.authorUni}</span>
                                            </div>
                                        </div>
                                        <span className="post-date">{post.createdAt}</span>
                                    </div>

                                    <div className="post-body">
                                        <div className="post-tags">
                                            <span className={`tag tag-${post.category}`}>
                                                {categories.find(c => c.key === post.category)?.emoji}{' '}
                                                {isKorean
                                                    ? categories.find(c => c.key === post.category)?.labelKo
                                                    : categories.find(c => c.key === post.category)?.label}
                                            </span>
                                        </div>
                                        <h3 className="post-title">{post.title}</h3>
                                        <p className="post-content">{post.content}</p>
                                    </div>

                                    <div className="post-footer">
                                        <button
                                            className="post-action"
                                            onClick={() => handleLike(post.id)}
                                        >
                                            ❤️ {post.likes}
                                        </button>
                                        <button className="post-action">
                                            💬 {post.comments}
                                        </button>
                                        <button className="post-action">
                                            🔗 {isKorean ? '공유' : 'Share'}
                                        </button>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* New Post Modal */}
            {showNewPostModal && (
                <div className="modal-overlay" onClick={() => setShowNewPostModal(false)}>
                    <div className="modal glass-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{isKorean ? '새 글 작성' : 'Create New Post'}</h2>
                            <button className="modal-close" onClick={() => setShowNewPostModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>{isKorean ? '카테고리' : 'Category'}</label>
                                <select
                                    value={newPostCategory}
                                    onChange={(e) => setNewPostCategory(e.target.value as PostCategory)}
                                >
                                    {categories.filter(c => c.key !== 'all').map(cat => (
                                        <option key={cat.key} value={cat.key}>
                                            {cat.emoji} {isKorean ? cat.labelKo : cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{isKorean ? '제목' : 'Title'}</label>
                                <input
                                    type="text"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    placeholder={isKorean ? '제목을 입력하세요' : 'Enter title'}
                                />
                            </div>

                            <div className="form-group">
                                <label>{isKorean ? '내용' : 'Content'}</label>
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder={isKorean ? '내용을 입력하세요' : 'Write your post'}
                                    rows={6}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowNewPostModal(false)}
                            >
                                {isKorean ? '취소' : 'Cancel'}
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreatePost}
                                disabled={!newPostTitle.trim() || !newPostContent.trim()}
                            >
                                {isKorean ? '게시하기' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommunityPage
