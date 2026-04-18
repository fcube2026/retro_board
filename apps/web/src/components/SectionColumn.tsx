import React, { useState } from 'react';
import { RetroSection, RetroItem } from '../types/retro.types';
import RetroItemCard from './RetroItemCard';

interface SectionColumnProps {
  section: RetroSection;
  items: RetroItem[];
  color: string;
  currentUserId: string;
  currentUserName: string;
  onAddItem: (sectionId: string, content: string) => Promise<void>;
  onUpdateItem: (id: string, content: string) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onUpdateSection: (id: string, title: string) => Promise<void>;
  onDeleteSection: (id: string) => Promise<void>;
}

const SectionColumn: React.FC<SectionColumnProps> = ({
  section,
  items,
  color,
  currentUserId,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onUpdateSection,
  onDeleteSection,
}) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemContent, setNewItemContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  const [adding, setAdding] = useState(false);

  const handleAddItem = async () => {
    if (!newItemContent.trim()) return;
    setAdding(true);
    try {
      await onAddItem(section.id, newItemContent.trim());
      setNewItemContent('');
      setIsAddingItem(false);
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (!editTitle.trim()) return;
    await onUpdateSection(section.id, editTitle.trim());
    setIsEditingTitle(false);
  };

  const handleDeleteSection = async () => {
    if (window.confirm(`Delete section "${section.title}" and all its cards?`)) {
      await onDeleteSection(section.id);
    }
  };

  const lightenColor = (hex: string, amount: number) => {
    const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
    const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
    const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
    return `rgb(${r},${g},${b})`;
  };

  const bgColor = lightenColor(color, 200);

  return (
    <div style={{ ...columnStyle, backgroundColor: bgColor }}>
      {/* Header */}
      <div style={{ ...headerStyle, backgroundColor: color }}>
        {isEditingTitle ? (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flex: 1 }}>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={titleInputStyle}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
            />
            <button onClick={handleUpdateTitle} style={smallWhiteButtonStyle}>✓</button>
            <button onClick={() => { setIsEditingTitle(false); setEditTitle(section.title); }} style={smallWhiteButtonStyle}>✕</button>
          </div>
        ) : (
          <>
            <span style={titleStyle}>{section.title}</span>
            <span style={countBadgeStyle}>{items.length}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setIsEditingTitle(true)} style={headerIconButtonStyle} title="Edit section">✏️</button>
              <button onClick={handleDeleteSection} style={headerIconButtonStyle} title="Delete section">🗑️</button>
            </div>
          </>
        )}
      </div>

      {/* Items */}
      <div style={itemsContainerStyle}>
        {items.map((item) => (
          <RetroItemCard
            key={item.id}
            item={item}
            currentUserId={currentUserId}
            onUpdate={onUpdateItem}
            onDelete={onDeleteItem}
          />
        ))}
      </div>

      {/* Add item */}
      {isAddingItem ? (
        <div style={addFormStyle}>
          <textarea
            value={newItemContent}
            onChange={(e) => setNewItemContent(e.target.value)}
            placeholder="What's on your mind?"
            style={addTextareaStyle}
            autoFocus
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddItem();
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={handleAddItem} disabled={adding} style={{ ...addButtonStyle, backgroundColor: color }}>
              {adding ? 'Adding...' : '+ Add Card'}
            </button>
            <button onClick={() => { setIsAddingItem(false); setNewItemContent(''); }} style={cancelAddButtonStyle}>
              Cancel
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Ctrl+Enter to save</p>
        </div>
      ) : (
        <button onClick={() => setIsAddingItem(true)} style={addCardButtonStyle}>
          + Add a card
        </button>
      )}
    </div>
  );
};

const columnStyle: React.CSSProperties = {
  minWidth: 280,
  width: 280,
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: '#fff',
  minHeight: 52,
};

const titleStyle: React.CSSProperties = {
  flex: 1,
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: 0.3,
};

const countBadgeStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.3)',
  borderRadius: 12,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 600,
};

const headerIconButtonStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.2)',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 12,
  padding: '3px 6px',
  color: '#fff',
};

const titleInputStyle: React.CSSProperties = {
  flex: 1,
  padding: '4px 8px',
  fontSize: 13,
  border: 'none',
  borderRadius: 4,
  outline: 'none',
};

const smallWhiteButtonStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.3)',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  color: '#fff',
  fontSize: 12,
  padding: '3px 7px',
  fontWeight: 700,
};

const itemsContainerStyle: React.CSSProperties = {
  padding: '12px',
  flex: 1,
  minHeight: 60,
};

const addFormStyle: React.CSSProperties = {
  padding: '8px 12px 12px',
};

const addTextareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  fontSize: 13,
  border: '2px solid #6366f1',
  borderRadius: 6,
  resize: 'vertical',
  outline: 'none',
  fontFamily: 'inherit',
};

const addButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '6px 12px',
  fontSize: 13,
  fontWeight: 600,
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

const cancelAddButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 13,
  backgroundColor: '#e2e8f0',
  color: '#333',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

const addCardButtonStyle: React.CSSProperties = {
  margin: '0 12px 12px',
  padding: '8px',
  fontSize: 13,
  color: '#666',
  backgroundColor: 'rgba(255,255,255,0.6)',
  border: '2px dashed #ccc',
  borderRadius: 8,
  cursor: 'pointer',
  width: 'calc(100% - 24px)',
  textAlign: 'center',
  transition: 'background-color 0.2s',
};

export default SectionColumn;
