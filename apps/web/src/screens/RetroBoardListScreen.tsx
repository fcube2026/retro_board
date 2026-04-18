import React, { useState, useEffect, useCallback } from 'react';
import { RetroBoard } from '../types/retro.types';
import { getBoards, createBoard } from '../api/retroApi';

interface RetroBoardListScreenProps {
  userName: string;
  userId: string;
  onSelectBoard: (boardId: string) => void;
}

const RetroBoardListScreen: React.FC<RetroBoardListScreenProps> = ({
  userName,
  userId,
  onSelectBoard,
}) => {
  const [boards, setBoards] = useState<RetroBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchBoards = useCallback(async () => {
    try {
      const data = await getBoards();
      setBoards(data);
      setFetchError('');
    } catch (err) {
      console.error('Failed to fetch boards:', err);
      setFetchError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
    const interval = setInterval(fetchBoards, 10000);
    return () => clearInterval(interval);
  }, [fetchBoards]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setError('Please enter a board title');
      return;
    }
    setCreating(true);
    try {
      await createBoard(newTitle.trim(), userName);
      setNewTitle('');
      setIsCreating(false);
      setError('');
      fetchBoards();
    } catch (err) {
      setError('Failed to create board');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', margin: 0 }}>
            📋 Retro Board
          </h1>
          <p style={{ color: '#666', margin: '4px 0 0', fontSize: 14 }}>
            Welcome back, <strong>{userName}</strong>! Run your retrospectives efficiently.
          </p>
        </div>
        <button onClick={() => setIsCreating(true)} style={createButtonStyle}>
          + New Board
        </button>
      </div>

      {/* Create board form */}
      {isCreating && (
        <div style={createFormStyle}>
          <h3 style={{ margin: '0 0 16px', color: '#1a1a2e' }}>Create New Board</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="e.g., Sprint 42 Retrospective"
                value={newTitle}
                onChange={(e) => { setNewTitle(e.target.value); setError(''); }}
                style={inputStyle}
                autoFocus
              />
              {error && <p style={{ color: '#e53e3e', fontSize: 12, marginTop: 4 }}>{error}</p>}
            </div>
            <button type="submit" disabled={creating} style={submitButtonStyle}>
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button type="button" onClick={() => { setIsCreating(false); setError(''); setNewTitle(''); }} style={cancelButtonStyle}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Board list */}
      {loading ? (
        <div style={loadingStyle}>Loading boards...</div>
      ) : fetchError ? (
        <div style={errorStyle}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>⚠️</p>
          <p style={{ color: '#e53e3e', fontWeight: 600, marginBottom: 8 }}>{fetchError}</p>
          <button onClick={() => fetchBoards()} style={retryButtonStyle}>Retry</button>
        </div>
      ) : boards.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🗒️</p>
          <h3 style={{ color: '#333', marginBottom: 8 }}>No boards yet</h3>
          <p style={{ color: '#666', fontSize: 14 }}>Create your first retro board to get started!</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {boards.map((board) => (
            <div
              key={board.id}
              style={cardStyle}
              onClick={() => onSelectBoard(board.id)}
            >
              <div style={cardHeaderStyle}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>
                  {board.title}
                </h3>
                <span style={itemCountStyle}>
                  {board._count?.items ?? 0} cards
                </span>
              </div>
              <div style={cardMetaStyle}>
                <span>👤 {board.createdBy}</span>
                <span>📅 {formatDate(board.createdAt)}</span>
              </div>
              <div style={cardArrowStyle}>→</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1000,
  margin: '0 auto',
  padding: '32px 24px',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 32,
  flexWrap: 'wrap',
  gap: 16,
};

const createButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

const createFormStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: '24px',
  marginBottom: 24,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  border: '2px solid #e2e8f0',
  borderRadius: 8,
  outline: 'none',
};

const submitButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 14,
  backgroundColor: '#e2e8f0',
  color: '#333',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px',
  color: '#666',
  fontSize: 16,
};

const errorStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 24px',
  backgroundColor: '#fff5f5',
  borderRadius: 12,
  border: '2px dashed #feb2b2',
};

const retryButtonStyle: React.CSSProperties = {
  padding: '8px 20px',
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  marginTop: 8,
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '80px 24px',
  backgroundColor: '#fff',
  borderRadius: 12,
  border: '2px dashed #e2e8f0',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: '20px 24px',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  border: '1px solid #e2e8f0',
  position: 'relative',
  transition: 'transform 0.15s, box-shadow 0.15s',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 12,
  gap: 8,
};

const itemCountStyle: React.CSSProperties = {
  backgroundColor: '#6366f1',
  color: '#fff',
  borderRadius: 12,
  padding: '2px 10px',
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

const cardMetaStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  fontSize: 12,
  color: '#888',
  flexWrap: 'wrap',
};

const cardArrowStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 20,
  right: 24,
  fontSize: 18,
  color: '#6366f1',
  fontWeight: 700,
};

export default RetroBoardListScreen;
