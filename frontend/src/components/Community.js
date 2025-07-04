import React, { useState, useEffect } from 'react';
import API from '../api';
import { ThemeContext } from '../ThemeContext';

export default function Community({ username }) {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [bgImages, setBgImages] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [bgFade, setBgFade] = useState(true);
  const [reporting, setReporting] = useState(null); // {type, id}
  const [reportReason, setReportReason] = useState('');
  const { theme } = React.useContext(ThemeContext);

  // 获取所有帖子
  const fetchPosts = async () => {
    const res = await API.getPosts();
    setPosts(res.data);
    // 获取每个帖子的评论和点赞
    res.data.forEach(post => {
      fetchComments(post.id);
      fetchLikes(post.id);
    });
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  // 获取所有风景图片
  useEffect(() => {
    async function fetchAllImages() {
      const dests = await API.get('/destinations');
      let imgs = [];
      for (let d of dests.data) {
        const res = await API.get(`/destinations/${d.id}/scenery`);
        if (res.data && res.data.length > 0) {
          imgs = imgs.concat(res.data.map(s => `http://localhost:3001${s.image}`));
        }
      }
      setBgImages(imgs);
    }
    fetchAllImages();
  }, []);

  // 轮播背景
  useEffect(() => {
    if (bgImages.length === 0) return;
    setBgFade(false);
    const timer = setInterval(() => {
      setBgFade(true);
      setTimeout(() => {
        setBgIndex(i => (i + 1) % bgImages.length);
        setBgFade(false);
      }, 400);
    }, 4000);
    return () => clearInterval(timer);
  }, [bgImages]);

  // 处理图片选择
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // 发布分享
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !image) return;
    const formData = new FormData();
    formData.append('text', text);
    formData.append('username', username);
    if (image) formData.append('image', image);
    await API.createPost(formData);
    setText('');
    setImage(null);
    setPreview(null);
    fetchPosts();
  };

  // 评论相关
  const fetchComments = async (postId) => {
    const res = await API.getComments(postId);
    setComments(prev => ({ ...prev, [postId]: res.data }));
  };
  const handleComment = async (postId) => {
    if (!commentText[postId]) return;
    await API.createComment({ postId, text: commentText[postId], username });
    setCommentText(prev => ({ ...prev, [postId]: '' }));
    fetchComments(postId);
  };

  // 点赞相关
  const fetchLikes = async (postId) => {
    const res = await API.getLikes(postId);
    setLikes(prev => ({ ...prev, [postId]: res.data.count }));
    // 判断当前用户是否已点赞
    if (username) {
      const res2 = await API.getComments(postId); // 用评论接口判断点赞用户（如需优化可加新接口）
      setLiked(prev => ({ ...prev, [postId]: false })); // 简化：不判断，点一次切换
    }
  };
  const handleLike = async (postId) => {
    await API.toggleLike({ postId, username });
    fetchLikes(postId);
  };

  // 删除帖子
  const handleDelete = async (postId) => {
    if (!window.confirm('确定要删除这条动态吗？')) return;
    await API.deletePost(postId, username);
    fetchPosts();
  };

  const handleReport = async () => {
    if (!reportReason) return alert('请填写举报原因');
    await API.reportContent({ type: reporting.type, targetId: reporting.id, reason: reportReason, username });
    setReporting(null);
    setReportReason('');
    alert('举报已提交');
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    await API.deleteComment(commentId, username);
    fetchComments(reporting.id); // 重新获取评论列表
    setReporting(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundImage: bgImages.length ? `url(${bgImages[bgIndex]})` : '', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', transition: 'background-image 0.5s' }}>
      <div style={{ position: 'absolute', top:0, left:0, width:'100%', height:'100%', background: theme==='dark'?'rgba(0,0,0,0.7)':'rgba(0,0,0,0.4)', zIndex:0, transition: 'opacity 0.4s' }} />
      <div style={{ position:'relative', zIndex:1, maxWidth: 600, width: '96%', margin: '0 auto', padding: '4vw 2vw', background: theme==='dark'?'rgba(30,30,30,0.7)':'rgba(255,255,255,0.7)', borderRadius: 12, boxShadow: '0 2px 8px #eee', marginTop: '6vw', backdropFilter: 'blur(2px)', color: theme==='dark'?'#eee':'#222', transition:'background 0.4s,color 0.4s' }}>
        <h2 style={{ textAlign: 'center', fontSize: '6vw', marginBottom: '4vw' }}>社区分享</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="分享你的想法..."
            rows={3}
            style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box', marginBottom: 12, padding: 12, borderRadius: 6, border: '1.5px solid #bbb', fontSize: '4vw', minHeight: 60, background: '#fafbfc', outline: 'none' }}
          />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: 12 }} />
          {preview && <div style={{ marginBottom: 12 }}><img src={preview} alt="预览" style={{ maxWidth: '80vw', borderRadius: 8 }} loading="lazy" /></div>}
          <button type="submit" style={{ padding: '10px 0', width: '100%', borderRadius: 6, background: '#007bff', color: '#fff', border: 'none', fontSize: '4vw', marginBottom: 8 }}>发布</button>
        </form>
        <div>
          {posts.length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>暂无分享</div>}
          {posts.map(post => (
            <div key={post.id} style={{ borderBottom: '1px solid #eee', padding: '16px 0' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: '4vw' }}>
                {post.username} <span style={{ color: '#aaa', fontSize: '3vw' }}>{new Date(post.createdAt).toLocaleString()}</span>
                {post.username === username && (
                  <button onClick={() => handleDelete(post.id)} style={{ marginLeft: 12, color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '3.5vw' }}>删除</button>
                )}
                <button onClick={() => setReporting({type:'post',id:post.id})} style={{ marginLeft: 12, color: '#ff9800', background: 'none', border: 'none', cursor: 'pointer', fontSize: '3.5vw' }}>举报</button>
              </div>
              {post.text && <div style={{ marginBottom: 8, fontSize: '4vw' }}>{post.text}</div>}
              {post.image && <img src={`http://localhost:3001${post.image}`} alt="分享" style={{ maxWidth: '90vw', borderRadius: 8, marginBottom: 8 }} loading="lazy" />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
                <button onClick={() => handleLike(post.id)} style={{ color: liked[post.id] ? 'red' : '#333', fontSize: '5vw', background: 'none', border: 'none', transition: 'transform 0.2s', transform: liked[post.id] ? 'scale(1.2)' : 'scale(1)' }}>👍 {likes[post.id] || 0}</button>
              </div>
              {/* 评论区 */}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: '3.5vw', color: '#555', marginBottom: 4 }}>评论：</div>
                {(comments[post.id] || []).map(c => (
                  <div key={c.id} style={{ fontSize: '3.5vw', marginBottom: 2, display:'flex', alignItems:'center' }}>
                    <b>{c.username}：</b>{c.text}
                    {c.username === username && (
                      <button onClick={() => handleDeleteComment(c.id)} style={{ marginLeft: 8, color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '3vw' }}>删除</button>
                    )}
                    <button onClick={() => setReporting({type:'comment',id:c.id})} style={{ marginLeft: 8, color: '#ff9800', background: 'none', border: 'none', cursor: 'pointer', fontSize: '3vw' }}>举报</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <input
                    value={commentText[post.id] || ''}
                    onChange={e => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="写评论..."
                    style={{ flex: 1, borderRadius: 4, border: '1px solid #ccc', padding: 8, fontSize: '4vw' }}
                  />
                  <button onClick={() => handleComment(post.id)} style={{ borderRadius: 4, background: '#eee', border: 'none', padding: '4px 12px', fontSize: '4vw' }}>发送</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 举报弹窗 */}
      {reporting && (
        <div style={{ position:'fixed', left:0, top:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.4)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:8, padding:24, minWidth:260 }}>
            <h3>举报{reporting.type==='post'?'动态':'评论'}</h3>
            <textarea value={reportReason} onChange={e=>setReportReason(e.target.value)} placeholder="请填写举报原因" style={{width:'100%',minHeight:60,margin:'12px 0',padding:8}} />
            <div style={{display:'flex',justifyContent:'flex-end',gap:12}}>
              <button onClick={()=>setReporting(null)}>取消</button>
              <button onClick={handleReport} style={{background:'#ff9800',color:'#fff',border:'none',borderRadius:4,padding:'4px 16px'}}>提交举报</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 