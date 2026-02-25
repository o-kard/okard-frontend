"use client";
import React, { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
      }}
    >
      <main
        style={{
          flex: 1,
          padding: '2.5rem 2.5rem 2.5rem 2rem',
          background: '#ffffff',
          color: '#222222',
          minHeight: '100vh',
          transition: 'background 0.2s',
        }}
      >
        {children}
      </main>
    </div>
  );
}
