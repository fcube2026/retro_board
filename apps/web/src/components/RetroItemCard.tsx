import React, { useState } from 'react';
import { RetroItem } from '../types/retro.types';

interface RetroItemCardProps {
  item: RetroItem;
  currentUserId: string;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const RetroItemCard: React.FC<RetroItemCardProps> = ({ item, currentUserId, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [saving, setSaving] = useState(false);

  const isOwner = item.createdBy === currentUserId;

  const handleSave = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      await onUpdate(item.id, editContent.trim());
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this card?')) {
      await onDelete(item.id);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (isEditing) {
    return (
      <div style={cardStyle}>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          style={textareaStyle}
          autoFocus
          rows={3}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={handleSave} disabled={saving} style={saveButtonStyle}>
            {saving ? '...' : 'Save'}
          </button>
          <button onClick={() => { setIsEditing(false); setEditContent(item.content); }} style={cancelButtonStyle}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <p style={contentStyle}>{item.content}</p>
      <div style={metaStyle}>
        <span style={authorStyle}>👤 {item.createdByName}</span>
        <span style={dateStyle}>{formatDate(item.createdAt)}</span>
      </div>
      {isOwner && (
        <div style={actionsStyle}>
          <button onClick={() => setIsEditing(true)} style={editButtonStyle} title="Edit">
            ✏️
          </button>
          <button onClick={handleDelete} style={deleteButtonStyle} title="Delete">
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: '12px 14px',
  marginBottom: 8,
  boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
  position: 'relative',
  border: '1px solid #f0f0f0',
  transition: 'box-shadow 0.2s',
};

const contentStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: '#2d3748',
  marginBottom: 8,
  wordBreak: 'break-word',
  paddingRight: 40,
};

const metaStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 4,
};

const authorStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#718096',
  fontWeight: 500,
};

const dateStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#a0aec0',
};

const actionsStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 8,
  display: 'flex',
  gap: 2,
};

const editButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 12,
  padding: '2px 4px',
  borderRadius: 4,
  opacity: 0.7,
};

const deleteButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 12,
  padding: '2px 4px',
  borderRadius: 4,
  opacity: 0.7,
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  fontSize: 14,
  border: '2px solid #6366f1',
  borderRadius: 6,
  resize: 'vertical',
  outline: 'none',
  fontFamily: 'inherit',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: 12,
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: 12,
  backgroundColor: '#e2e8f0',
  color: '#333',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
};

export default RetroItemCard;
