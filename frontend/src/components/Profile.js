import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Profile({ username, onBack, showLogout }) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    // 获取用户发帖
    const postsRes = await API.getPosts();
    setPosts(postsRes.data.filter(p => p.username === username));
    // 获取用户评论
    const commentsRes = await API.getUserComments(username);
    setComments(commentsRes.data);
    // 获取用户点赞
    const likesRes = await API.getUserLikes(username);
    setLikes(likesRes.data);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('确定要删除这条动态吗？')) return;
    await API.deletePost(postId, username);
    fetchUserData();
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    await API.deleteComment(commentId, username);
    fetchUserData();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '4vw 2vw', background: 'rgba(255,255,255,0.9)', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4vw' }}>
        <button onClick={onBack} style={{ marginRight: '4vw', padding: '8px 16px', borderRadius: 6, background: '#007bff', color: '#fff', border: 'none' }}>返回</button>
        <h2 style={{ fontSize: '6vw', margin: 0, flex: 1 }}>个人中心 - {username}</h2>
        <button onClick={showLogout} style={{ marginLeft: '4vw', padding: '8px 16px', borderRadius: 6, background: '#dc3545', color: '#fff', border: 'none' }}>退出登录</button>
      </div>

      {/* 标签页 */}
      <div style={{ display: 'flex', marginBottom: '4vw', borderBottom: '1px solid #eee' }}>
        <button 
          onClick={() => setActiveTab('posts')} 
          style={{ 
            padding: '8px 16px', 
            background: activeTab === 'posts' ? '#007bff' : '#f8f9fa', 
            color: activeTab === 'posts' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            marginRight: '2vw'
          }}
        >
          我的动态 ({posts.length})
        </button>
        <button 
          onClick={() => setActiveTab('comments')} 
          style={{ 
            padding: '8px 16px', 
            background: activeTab === 'comments' ? '#007bff' : '#f8f9fa', 
            color: activeTab === 'comments' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            marginRight: '2vw'
          }}
        >
          我的评论 ({comments.length})
        </button>
        <button 
          onClick={() => setActiveTab('likes')} 
          style={{ 
            padding: '8px 16px', 
            background: activeTab === 'likes' ? '#007bff' : '#f8f9fa', 
            color: activeTab === 'likes' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '6px 6px 0 0'
          }}
        >
          我的点赞 ({likes.length})
        </button>
      </div>

      {/* 内容区 */}
      <div>
        {activeTab === 'posts' && (
          <div>
            <h3 style={{ fontSize: '5vw', marginBottom: '3vw' }}>我的动态</h3>
            {posts.length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>暂无动态</div>}
            {posts.map(post => (
              <div key={post.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '3vw', marginBottom: '3vw' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2vw' }}>
                  <span style={{ color: '#aaa', fontSize: '3.5vw' }}>{new Date(post.createdAt).toLocaleString()}</span>
                  <button 
                    onClick={() => handleDeletePost(post.id)} 
                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '3.5vw' }}
                  >
                    删除
                  </button>
                </div>
                {post.text && <div style={{ marginBottom: '2vw', fontSize: '4vw' }}>{post.text}</div>}
                {post.image && <img src={`http://localhost:3001${post.image}`} alt="分享" style={{ maxWidth: '100%', borderRadius: 8 }} />}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <h3 style={{ fontSize: '5vw', marginBottom: '3vw' }}>我的评论</h3>
            {comments.length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>暂无评论</div>}
            {comments.map(comment => (
              <div key={comment.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '3vw', marginBottom: '3vw' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2vw' }}>
                  <span style={{ color: '#aaa', fontSize: '3.5vw' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                  <button 
                    onClick={() => handleDeleteComment(comment.id)} 
                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '3.5vw' }}
                  >
                    删除
                  </button>
                </div>
                <div style={{ fontSize: '4vw' }}>{comment.text}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'likes' && (
          <div>
            <h3 style={{ fontSize: '5vw', marginBottom: '3vw' }}>我的点赞</h3>
            {likes.length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>暂无点赞</div>}
            {likes.map(like => (
              <div key={like.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: '3vw', marginBottom: '3vw' }}>
                <div style={{ fontSize: '4vw' }}>
                  点赞了帖子 ID: {like.postId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 