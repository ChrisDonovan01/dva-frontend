// dva-frontend/src/components/Sidebar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Insights, Search, MenuBook, ChatBubble, Menu } from '@mui/icons-material';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <Home />, link: '/' },
    { name: 'Strategic Alignment', icon: <Insights />, link: '/strategic-alignment' }, // explicitly corrected
    { name: 'Matrix', icon: <Search />, link: '/matrix' },
    { name: 'Data Product Playbook', icon: <MenuBook />, link: '/playbook' },
    { name: 'Chat', icon: <ChatBubble />, link: '/chat' },
  ];

  return (
    <div className={`min-h-screen bg-gray-900 text-white flex flex-col transition-width duration-300 ${expanded ? 'w-56' : 'w-16'}`}>
      <button
        className="py-4 flex items-center justify-center border-b border-gray-700 hover:bg-gray-800"
        onClick={() => setExpanded(!expanded)}
        title={expanded ? 'Collapse Menu' : 'Expand Menu'}
      >
        <Menu />
      </button>

      <nav className="flex-1 mt-4 space-y-2">
        {menuItems.map(({ name, icon, link }) => (
          <NavLink
            key={name}
            to={link}
            className={({ isActive }) =>
              `flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-white'
              }`
            }
            title={expanded ? '' : name}
          >
            <span className="text-xl">{icon}</span>
            {expanded && <span className="ml-3 whitespace-nowrap">{name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
