import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Footer from './components/Footer';
import './index.css';

interface Shape { id: number; type: string; x: number; y: number; }
interface User { id: number; name: string; }
interface Painting { id: number | null; title: string; shapes: string; }

const API_URL = 'http://localhost:8080';

function App() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [paintingTitle, setPaintingTitle] = useState('Select a user');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [userPaintings, setUserPaintings] = useState<Painting[]>([]);
  const [activePainting, setActivePainting] = useState<Painting | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);

  const handleUserChange = (userIdStr: string) => {
    const userId = parseInt(userIdStr, 10);
    const user = users.find(u => u.id === userId);
    setCurrentUser(user || null);
    
    setUserPaintings([]);
    setActivePainting(null);
    setShapes([]);
    setPaintingTitle('Select a painting or create new');
    
    if (user) {
      fetch(`${API_URL}/api/users/${user.id}/paintings`)
        .then(res => res.json())
        .then(setUserPaintings);
    }
  };

  const handlePaintingChange = (paintingIdStr: string) => {
    const paintingId = parseInt(paintingIdStr, 10);
    const painting = userPaintings.find(p => p.id === paintingId);
    if (painting) {
      setActivePainting(painting);
      setPaintingTitle(painting.title);
      setShapes(JSON.parse(painting.shapes || '[]'));
    }
  };

  const handleNewPainting = () => {
    if (!currentUser) return;
    const newPaintingTemplate = { id: null, title: 'New Untitled Painting', shapes: '[]' };
    setActivePainting(newPaintingTemplate);
    setPaintingTitle(newPaintingTemplate.title);
    setShapes([]);
  };

  const handleSave = () => {
    if (!activePainting || !currentUser) return;

    const requestBody = {
      title: paintingTitle,
      shapes: JSON.stringify(shapes)
    };
    
    if (activePainting.id) {
      fetch(`${API_URL}/api/paintings/${activePainting.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      .then(res => res.json())
      .then(updatedPainting => {
        setUserPaintings(prev => prev.map(p => p.id === updatedPainting.id ? updatedPainting : p));
        alert('Painting updated!');
      });
    } else {
      fetch(`${API_URL}/api/users/${currentUser.id}/paintings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      .then(res => res.json())
      .then(newPainting => {
        setUserPaintings(prev => [...prev, newPainting]);
        setActivePainting(newPainting);
        alert('Painting saved!');
      });
    }
  };

  const handleDelete = () => {
    if (!activePainting || !activePainting.id) return;
    if (window.confirm(`Are you sure you want to delete "${paintingTitle}"?`)) {
      fetch(`${API_URL}/api/paintings/${activePainting.id}`, { method: 'DELETE' })
        .then(() => {
          setUserPaintings(prev => prev.filter(p => p.id !== activePainting.id));
          handleNewPainting();
          alert('Painting deleted.');
        });
    }
  };
  
  const handleCanvasClick = (x: number, y: number) => {
    if (!selectedTool || !activePainting) return;
    const newShape: Shape = { id: Date.now(), type: selectedTool, x: x - 25, y: y - 25 };
    setShapes(prev => [...prev, newShape]);
  };
  const handleShapeDoubleClick = (shapeId: number) => setShapes(prev => prev.filter(s => s.id !== shapeId));
  const handleToolSelect = (tool: string) => setSelectedTool(prev => prev === tool ? null : tool);

  return (
    <div className="app-container">
      <Header
        title={paintingTitle} onTitleChange={setPaintingTitle}
        onSave={handleSave} onNew={handleNewPainting} onDelete={handleDelete}
        users={users} currentUser={currentUser} onUserChange={handleUserChange}
        paintings={userPaintings} activePainting={activePainting} onPaintingChange={handlePaintingChange}
        disabled={!activePainting}
      />
      <div className="main-content">
        <Canvas shapes={shapes} onCanvasClick={handleCanvasClick} onShapeDoubleClick={handleShapeDoubleClick} />
        <Sidebar selectedTool={selectedTool} onToolSelect={handleToolSelect} />
      </div>
      <Footer shapes={shapes} />
    </div>
  );
}

export default App;