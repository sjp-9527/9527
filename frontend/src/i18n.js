import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: 'Home',
      community: 'Community',
      profile: 'Profile',
      admin: 'Admin',
      post: 'Post',
      comment: 'Comment',
      like: 'Like',
      report: 'Report',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      welcome: 'Welcome',
      selectDestination: 'Select Destination',
      shareYourThoughts: 'Share your thoughts...',
      publish: 'Publish',
      noPosts: 'No posts yet',
      delete: 'Delete',
      send: 'Send',
      myPosts: 'My Posts',
      myComments: 'My Comments',
      myLikes: 'My Likes',
      reportMgmt: 'Report Admin',
      theme: 'Theme',
      lang: 'Language',
      light: 'Light',
      dark: 'Dark',
      zh: '中文',
      en: 'English',
    }
  },
  zh: {
    translation: {
      home: '主页',
      community: '社区',
      profile: '个人中心',
      admin: '举报管理',
      post: '动态',
      comment: '评论',
      like: '点赞',
      report: '举报',
      login: '登录',
      register: '注册',
      logout: '退出登录',
      welcome: '欢迎',
      selectDestination: '选择目的地',
      shareYourThoughts: '分享你的想法…',
      publish: '发布',
      noPosts: '暂无动态',
      delete: '删除',
      send: '发送',
      myPosts: '我的动态',
      myComments: '我的评论',
      myLikes: '我的点赞',
      reportMgmt: '举报管理后台',
      theme: '主题',
      lang: '语言',
      light: '浅色',
      dark: '深色',
      zh: '中文',
      en: '英文',
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n; 