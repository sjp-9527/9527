import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminReports({ username, onBack }) {
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchReports();
    fetchPosts();
    fetchComments();
  }, []);

  const fetchReports = async () => {
    const res = await API.get(`/community/reports?admin=${username}`);
    setReports(res.data);
  };
  const fetchPosts = async () => {
    const res = await API.getPosts();
    setPosts(res.data);
  };
  const fetchComments = async () => {
    // 获取所有评论（管理员用，需后端支持）
    const res = await API.get(`/community/all-comments?admin=${username}`);
    setComments(res.data);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('确定要删除这条动态吗？')) return;
    await API.deletePost(postId, username);
    fetchReports();
    fetchPosts();
  };
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    await API.deleteComment(commentId, username);
    fetchReports();
    fetchComments();
  };

  function getContent(report) {
    if (report.type === 'post') {
      const post = posts.find(p => p.id === report.targetId);
      return post ? post.text : '[已删除]';
    } else {
      const comment = comments.find(c => c.id === report.targetId);
      return comment ? comment.text : '[已删除]';
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '4vw 2vw', background: 'rgba(255,255,255,0.97)', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4vw' }}>
        <button onClick={onBack} style={{ marginRight: '4vw', padding: '8px 16px', borderRadius: 6, background: '#007bff', color: '#fff', border: 'none' }}>返回</button>
        <h2 style={{ fontSize: '6vw', margin: 0 }}>举报管理后台</h2>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ border: '1px solid #eee', padding: 8 }}>举报类型</th>
            <th style={{ border: '1px solid #eee', padding: 8 }}>内容</th>
            <th style={{ border: '1px solid #eee', padding: 8 }}>举报原因</th>
            <th style={{ border: '1px solid #eee', padding: 8 }}>举报人</th>
            <th style={{ border: '1px solid #eee', padding: 8 }}>举报时间</th>
            <th style={{ border: '1px solid #eee', padding: 8 }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>暂无举报</td></tr>}
          {reports.map((r, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #eee', padding: 8 }}>{r.type === 'post' ? '动态' : '评论'}</td>
              <td style={{ border: '1px solid #eee', padding: 8, maxWidth: 200, wordBreak: 'break-all' }}>{getContent(r)}</td>
              <td style={{ border: '1px solid #eee', padding: 8 }}>{r.reason}</td>
              <td style={{ border: '1px solid #eee', padding: 8 }}>{r.username}</td>
              <td style={{ border: '1px solid #eee', padding: 8 }}>{new Date(r.time).toLocaleString()}</td>
              <td style={{ border: '1px solid #eee', padding: 8 }}>
                {r.type === 'post' ? (
                  <button onClick={() => handleDeletePost(r.targetId)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>删除动态</button>
                ) : (
                  <button onClick={() => handleDeleteComment(r.targetId)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>删除评论</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 