import React, { useState, useEffect } from 'react';
import UserSetup from './components/UserSetup';
import RetroBoardListScreen from './screens/RetroBoardListScreen';
import RetroBoardDetailScreen from './screens/RetroBoardDetailScreen';

type View = 'list' | 'detail';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('retroUserName');
    if (stored) {
      setUserName(stored);
    }
  }, []);

  const handleUserSetup = (name: string) => {
    localStorage.setItem('retroUserName', name);
    setUserName(name);
  };

  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedBoardId(null);
  };

  if (!userName) {
    return <UserSetup onSubmit={handleUserSetup} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {currentView === 'list' && (
        <RetroBoardListScreen
          userName={userName}
          userId={userName}
          onSelectBoard={handleSelectBoard}
        />
      )}
      {currentView === 'detail' && selectedBoardId && (
        <RetroBoardDetailScreen
          boardId={selectedBoardId}
          userName={userName}
          userId={userName}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default App;
