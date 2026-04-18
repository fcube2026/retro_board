import React, { useState, useEffect, useCallback } from 'react';
import { RetroBoard, RetroSection, RetroItem } from '../types/retro.types';
import { getBoardById, createSection, updateSection, deleteSection, createItem, updateItem, deleteItem } from '../api/retroApi';
import SectionColumn from '../components/SectionColumn';

interface RetroBoardDetailScreenProps {
  boardId: string;
  userName: string;
  userId: string;
  onBack: () => void;
}

const SECTION_COLORS = ['#4CAF50', '#F44336', '#2196F3', '#9C27B0', '#FF9800', '#009688', '#E91E63', '#3F51B5'];

const RetroBoardDetailScreen: React.FC<RetroBoardDetailScreenProps> = ({
  boardId,
  userName,
  userId,
  onBack,
}) => {
  const [board, setBoard] = useState<RetroBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [addingSection, setAddingSection] = useState(false);
  const [sectionError, setSectionError] = useState('');

  const fetchBoard = useCallback(async () => {
    try {
      const data = await getBoardById(boardId);
      setBoard(data);
      setFetchError('');
    } catch (err) {
      console.error('Failed to fetch board:', err);
      setFetchError('Failed to load board. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
    const interval = setInterval(fetchBoard, 5000);
    return () => clearInterval(interval);
  }, [fetchBoard]);

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    setAddingSection(true);
    setSectionError('');
    try {
      await createSection(boardId, newSectionTitle.trim(), userName);
      setNewSectionTitle('');
      setIsAddingSection(false);
      fetchBoard();
    } catch (err) {
      console.error('Failed to create section:', err);
      setSectionError('Failed to create section. Please try again.');
    } finally {
      setAddingSection(false);
    }
  };

  const handleUpdateSection = async (id: string, title: string) => {
    try {
      await updateSection(id, { title });
      fetchBoard();
    } catch (err) {
      console.error('Failed to update section:', err);
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      await deleteSection(id);
      fetchBoard();
    } catch (err) {
      console.error('Failed to delete section:', err);
    }
  };

  const handleAddItem = async (sectionId: string, content: string) => {
    await createItem(boardId, sectionId, content, userId, userName);
    fetchBoard();
  };

  const handleUpdateItem = async (id: string, content: string) => {
    try {
      await updateItem(id, { content });
      fetchBoard();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      fetchBoard();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const getItemsForSection = (sectionId: string): RetroItem[] => {
    if (!board?.sections) return [];
    const section = board.sections.find((s) => s.id === sectionId);
    return section?.items ?? [];
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <p style={{ color: '#666' }}>Loading board...</p>
      </div>
    );
  }

  if (!board) {
    return (
      <div style={loadingContainerStyle}>
        {fetchError ? (
          <p style={{ color: '#e53e3e', marginBottom: 16 }}>{fetchError}</p>
        ) : (
          <p>Board not found.</p>
        )}
        <button onClick={onBack} style={backButtonStyle}>Go Back</button>
      </div>
    );
  }

  const totalCards = board.sections?.reduce((sum, s) => sum + (s.items?.length ?? 0), 0) ?? 0;

  return (
    <div style={pageStyle}>
      {/* Top bar */}
      <div style={topBarStyle}>
        <button onClick={onBack} style={backButtonStyle}>
          ← Back
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {board.title}
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#888' }}>
            Created by {board.createdBy} · {board.sections?.length ?? 0} sections · {totalCards} cards total
          </p>
        </div>
        <button
          onClick={() => setIsAddingSection(true)}
          style={addSectionButtonStyle}
        >
          + Add Section
        </button>
      </div>

      {/* Add section form */}
      {isAddingSection && (
        <div style={addSectionFormStyle}>
          <form onSubmit={handleAddSection} style={addSectionFormRowStyle}>
            <input
              type="text"
              placeholder="Section title..."
              value={newSectionTitle}
              onChange={(e) => { setNewSectionTitle(e.target.value); setSectionError(''); }}
              style={sectionInputStyle}
              autoFocus
            />
            <button type="submit" disabled={addingSection} style={sectionSubmitButtonStyle}>
              {addingSection ? '...' : 'Add'}
            </button>
            <button type="button" onClick={() => { setIsAddingSection(false); setNewSectionTitle(''); setSectionError(''); }} style={sectionCancelButtonStyle}>
              Cancel
            </button>
          </form>
          {sectionError && <p style={{ color: '#e53e3e', fontSize: 12, marginTop: 6 }}>{sectionError}</p>}
        </div>
      )}

      {/* Board columns */}
      <div style={boardStyle}>
        {board.sections && board.sections.length > 0 ? (
          board.sections.map((section: RetroSection, idx: number) => (
            <SectionColumn
              key={section.id}
              section={section}
              items={getItemsForSection(section.id)}
              color={SECTION_COLORS[idx % SECTION_COLORS.length]}
              currentUserId={userId}
              currentUserName={userName}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onUpdateSection={handleUpdateSection}
              onDeleteSection={handleDeleteSection}
            />
          ))
        ) : (
          <div style={emptyBoardStyle}>
            <p style={{ fontSize: 40 }}>🗂️</p>
            <h3 style={{ color: '#333', margin: '8px 0' }}>No sections yet</h3>
            <p style={{ color: '#666', fontSize: 14 }}>Add a section to start adding cards!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '16px 24px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  flexWrap: 'wrap',
};

const backButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 14,
  backgroundColor: '#f7f7f7',
  color: '#333',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const addSectionButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const addSectionFormStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#f8f8fc',
  borderBottom: '1px solid #e2e8f0',
};

const addSectionFormRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const sectionInputStyle: React.CSSProperties = {
  flex: 1,
  maxWidth: 360,
  padding: '8px 14px',
  fontSize: 14,
  border: '2px solid #6366f1',
  borderRadius: 8,
  outline: 'none',
};

const sectionSubmitButtonStyle: React.CSSProperties = {
  padding: '8px 20px',
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

const sectionCancelButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 14,
  backgroundColor: '#e2e8f0',
  color: '#333',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

const boardStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  padding: '24px',
  overflowX: 'auto',
  flex: 1,
  alignItems: 'flex-start',
  minHeight: 'calc(100vh - 100px)',
};

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
};

const emptyBoardStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px',
  backgroundColor: '#fff',
  borderRadius: 12,
  border: '2px dashed #e2e8f0',
  minWidth: 300,
};

export default RetroBoardDetailScreen;
