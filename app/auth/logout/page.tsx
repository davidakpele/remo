'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      router.push('/auth/login');
    };

    checkAuth();
  }, [router]);

  return (
   <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f1f5f9',
        borderTopColor: '#dc2626',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}