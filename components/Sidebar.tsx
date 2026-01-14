
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { id: 'upload', icon: 'fa-wand-magic-sparkles', label: 'Analisar Edital' },
    { id: 'editais', icon: 'fa-folder-open', label: 'Meus Editais' },
    { id: 'clientes', icon: 'fa-user-group', label: 'Gestão de Clientes' },
    { id: 'projetos', icon: 'fa-diagram-project', label: 'Gestão de Projetos' },
  ];

  return (
    <nav className="space-y-6 sticky top-24">
      <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-sky-100">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-sky-100 text-sky-700 shadow-sm border border-sky-200'
                    : 'text-slate-500 hover:bg-sky-50/50 hover:text-sky-600'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center ${activeTab === item.id ? 'text-sky-600' : 'text-slate-400'}`}></i>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-sky-50 rounded-[2rem] p-6 border border-yellow-100 shadow-sm">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-yellow-500 shadow-sm mb-4">
          <i className="fas fa-star"></i>
        </div>
        <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2">Suporte Sabiá</h4>
        <p className="text-xs text-sky-600 leading-relaxed mb-4">Precisa de ajuda com a redação? Nossa equipe está online.</p>
        <button className="w-full bg-white text-sky-600 border border-sky-100 text-xs font-bold py-3 rounded-xl hover:bg-sky-100 transition-colors shadow-sm">
          Falar no Chat
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
