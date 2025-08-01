// در client/src/components/Header.tsx

import React from 'react';

const Header = ({
  title, onTitleChange, onSave, onNew, onDelete,
  users, currentUser, onUserChange,
  paintings, activePainting, onPaintingChange,
  disabled
}) => {
  return (
    <header className="header">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Painting Title"
        disabled={disabled}
      />
      <div className="controls">
        <select value={currentUser ? currentUser.id : ""} onChange={(e) => onUserChange(e.target.value)}>
          <option value="" disabled>Select User</option>
          {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
        
        {currentUser && (
          <select value={activePainting ? activePainting.id : ""} onChange={(e) => onPaintingChange(e.target.value)} disabled={paintings.length === 0}>
            <option value="" disabled>Select Painting</option>
            {paintings.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        )}

        <button onClick={onNew} disabled={!currentUser}>New</button>
        <button onClick={onSave} disabled={disabled}>Save</button>
        <button onClick={onDelete} disabled={!activePainting || !activePainting.id}>Delete</button>
      </div>
    </header>
  );
};

export default Header;