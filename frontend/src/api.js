import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// 社区API
API.createPost = (formData) => API.post('/community/post', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
API.getPosts = () => API.get('/community/posts');
API.createComment = (data) => API.post('/community/comment', data);
API.getComments = (postId) => API.get(`/community/comments/${postId}`);
API.toggleLike = (data) => API.post('/community/like', data);
API.getLikes = (postId) => API.get(`/community/likes/${postId}`);
API.deletePost = (postId, username) => API.delete(`/community/post/${postId}`, { data: { username } });
API.deleteComment = (commentId, username) => API.delete(`/community/comment/${commentId}`, { data: { username } });
API.getUserComments = (username) => API.get(`/community/user-comments/${username}`);
API.getUserLikes = (username) => API.get(`/community/user-likes/${username}`);
API.reportContent = (data) => API.post('/community/report', data);

export default API;