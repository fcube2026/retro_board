import React, { useState, useEffect } from 'react';
import UserSetup from './components/UserSetup';
import RetroBoardListScreen from './screens/RetroBoardListScreen';
import RetroBoardDetailScreen from './screens/RetroBoardDetailScreen';

type View = 'list' | 'detail';

const generateUserId = (): string => {
  return 'user_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
};

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem('retroUserName');
    const storedId = localStorage.getItem('retroUserId');
    if (storedName && storedId) {
      setUserName(storedName);
      setUserId(storedId);
    }
  }, []);

  const handleUserSetup = (name: string) => {
    const newUserId = generateUserId();
    localStorage.setItem('retroUserName', name);
    localStorage.setItem('retroUserId', newUserId);
    setUserName(name);
    setUserId(newUserId);
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
          userId={userId}
          onSelectBoard={handleSelectBoard}
        />
      )}
      {currentView === 'detail' && selectedBoardId && (
        <RetroBoardDetailScreen
          boardId={selectedBoardId}
          userName={userName}
          userId={userId}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default App;
