import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import DestinationList from './components/DestinationList';
import SceneryList from './components/SceneryList';
import Community from './components/Community';
import Profile from './components/Profile';
import API from './api';
import { useEffect } from 'react';
import AdminReports from './components/AdminReports';
import NavIcon from './components/NavIcon';
import { ThemeContext } from './ThemeContext';
import { useTranslation } from 'react-i18next';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [bgImage, setBgImage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  // 页面切换
  const [page, setPage] = useState('home'); // home, community, profile

  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const switchLang = () => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');

  useEffect(() => {
    async function fetchBgAndAdmin() {
      if (destinationId) {
        const res = await API.get(`/destinations/${destinationId}/scenery`);
        if (res.data && res.data.length > 0) {
          setBgImage(`http://localhost:3001${res.data[0].image}`);
          return;
        }
      }
      // 若无选中目的地或无风景，随机取一张
      const dests = await API.get('/destinations');
      for (let d of dests.data) {
        const res2 = await API.get(`/destinations/${d.id}/scenery`);
        if (res2.data && res2.data.length > 0) {
          setBgImage(`http://localhost:3001${res2.data[0].image}`);
          return;
        }
      }
      setBgImage('');
      if (!username) return; // 没有用户名时不查管理员
      const res = await API.get(`/auth/userinfo?username=${username}`);
      console.log('isAdmin', res.data && res.data.isAdmin); // 调试输出
      setIsAdmin(res.data && res.data.isAdmin);
    }
    fetchBgAndAdmin();
  }, [destinationId, username]);

  const handleLogin = (tk, user) => {
    setToken(tk);
    setUsername(user);
    setLoginSuccess(true);
    API.get(`/auth/userinfo?username=${user}`).then(res => {
      setIsAdmin(res.data && res.data.isAdmin);
      console.log('isAdmin', res.data && res.data.isAdmin);
    });
    setTimeout(() => setLoginSuccess(false), 3000);
  };

  if (!token) {
    return (
      <div>
        {showRegister ? <Register /> : <Login onLogin={handleLogin} />}
        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? '已有账号？去登录' : '没有账号？去注册'}
        </button>
      </div>
    );
  }

  // 页面内容
  let pageContent = null;
  if (page === 'community') {
    pageContent = (
      <Community username={username} />
    );
  } else if (page === 'profile') {
    pageContent = (
      <Profile username={username} onBack={() => setPage('home')} showLogout={() => { setToken(''); setUsername(''); setPage('home'); }} />
    );
  } else if (page === 'admin') {
    return (
      <div style={{ minHeight: '100vh', backgroundImage: bgImage ? `url(${bgImage})` : '', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.4)', zIndex:0 }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <AdminReports username={username} onBack={() => setPage('home')} />
        </div>
      </div>
    );
  }
  else {
    pageContent = (
      <>
        {loginSuccess && (
          <div style={{ background: '#d4edda', color: '#155724', padding: 10, marginBottom: 10, borderRadius: 4 }}>
            登录成功！
          </div>
        )}
        <h2>欢迎，{username}！</h2>
        <DestinationList selected={destinationId} setSelected={setDestinationId} />
        <SceneryList destinationId={destinationId} />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundImage: bgImage ? `url(${bgImage})` : '', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', transition: 'background 0.4s' }} data-theme={theme}>
      <div style={{ position: 'absolute', top:0, left:0, width:'100%', height:'100%', background: theme==='dark'?'rgba(0,0,0,0.7)':'rgba(0,0,0,0.4)', zIndex:0, transition:'background 0.4s' }} />
      <div style={{ position:'relative', zIndex:1, paddingBottom: 70, color: theme==='dark'?'#eee':'#222', transition:'color 0.4s' }}>
        <div style={{ position:'fixed', right:16, top:16, zIndex:20, display:'flex', gap:8 }}>
          <button onClick={toggleTheme} style={{ border:'none', background:'#eee', borderRadius:6, padding:'4px 12px', cursor:'pointer' }}>{t('theme')}: {theme==='dark'?t('dark'):t('light')}</button>
          <button onClick={switchLang} style={{ border:'none', background:'#eee', borderRadius:6, padding:'4px 12px', cursor:'pointer' }}>{t('lang')}: {i18n.language==='zh'?t('zh'):t('en')}</button>
        </div>
        {pageContent}
      </div>
      {/* 底部导航栏 */}
      <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', height: 60, background: theme==='dark'?'rgba(30,30,30,0.97)':'rgba(255,255,255,0.95)', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 10, transition:'background 0.4s' }}>
        <button onClick={() => setPage('home')} style={{ flex: 1, height: '100%', border: 'none', background: 'none', fontSize: 12, color: page==='home'?'#007bff':theme==='dark'?'#eee':'#333', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <NavIcon type="home" active={page==='home'} />{t('home')}
        </button>
        <button onClick={() => setPage('community')} style={{ flex: 1, height: '100%', border: 'none', background: 'none', fontSize: 12, color: page==='community'?'#007bff':theme==='dark'?'#eee':'#333', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <NavIcon type="community" active={page==='community'} />{t('community')}
        </button>
        <button onClick={() => setPage('profile')} style={{ flex: 1, height: '100%', border: 'none', background: 'none', fontSize: 12, color: page==='profile'?'#007bff':theme==='dark'?'#eee':'#333', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <NavIcon type="profile" active={page==='profile'} />{t('profile')}
        </button>
        {isAdmin && <button onClick={() => setPage('admin')} style={{ flex: 1, height: '100%', border: 'none', background: 'none', fontSize: 12, color: page==='admin'?'#007bff':theme==='dark'?'#eee':'#333', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <NavIcon type="admin" active={page==='admin'} />{t('admin')}
        </button>}
      </div>
    </div>
  );
}

export default App; 