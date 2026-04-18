import React, { useState } from 'react';

interface UserSetupProps {
  onSubmit: (name: string, email: string) => void;
}

const UserSetup: React.FC<UserSetupProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    let valid = true;

    if (!trimmedName) {
      setNameError('Please enter your name');
      valid = false;
    } else if (trimmedName.length < 2) {
      setNameError('Name must be at least 2 characters');
      valid = false;
    }

    if (!trimmedEmail) {
      setEmailError('Please enter your email');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (!valid) return;
    onSubmit(trimmedName, trimmedEmail);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={iconStyle}>👋</div>
        <h2 style={{ marginBottom: 8, color: '#1a1a2e', fontSize: 24 }}>Welcome to Retro Board</h2>
        <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
          Enter your name and email to get started. Your name will be shown on cards you create.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError('');
            }}
            style={inputStyle}
            autoFocus
          />
          {nameError && <p style={{ color: '#e53e3e', fontSize: 12, marginTop: 4 }}>{nameError}</p>}
          <input
            type="email"
            placeholder="Your email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            style={{ ...inputStyle, marginTop: 12 }}
          />
          {emailError && <p style={{ color: '#e53e3e', fontSize: 12, marginTop: 4 }}>{emailError}</p>}
          <button type="submit" style={buttonStyle}>
            Get Started →
          </button>
        </form>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: '40px 48px',
  width: 420,
  maxWidth: '90vw',
  textAlign: 'center',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
};

const iconStyle: React.CSSProperties = {
  fontSize: 48,
  marginBottom: 16,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontSize: 16,
  border: '2px solid #e2e8f0',
  borderRadius: 8,
  outline: 'none',
  marginBottom: 4,
  transition: 'border-color 0.2s',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  marginTop: 16,
  fontSize: 16,
  fontWeight: 600,
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

export default UserSetup;
