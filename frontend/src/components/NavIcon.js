import React from 'react';

export default function NavIcon({ type, active }) {
  const color = active ? '#007bff' : '#888';
  if (type === 'home') {
    return <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4h-4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11.5z" stroke={color} strokeWidth="2" strokeLinejoin="round"/></svg>;
  }
  if (type === 'community') {
    return <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/><path d="M4 20c0-2.2 3.6-4 8-4s8 1.8 8 4" stroke={color} strokeWidth="2"/></svg>;
  }
  if (type === 'profile') {
    return <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/><path d="M4 20c0-2.2 3.6-4 8-4s8 1.8 8 4" stroke={color} strokeWidth="2"/></svg>;
  }
  if (type === 'admin') {
    return <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2"/><path d="M8 12h8M8 16h8M8 8h8" stroke={color} strokeWidth="2"/></svg>;
  }
  return null;
} 