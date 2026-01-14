
import React, { useState, useMemo } from 'react';
import { Edital } from '../types';

interface HeaderProps {
  editais: Edital[];
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ editais, setActiveTab }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = useMemo(() => {
    const today = new Date();
    const urgent = editais.filter(e => {
      const end = new Date(e.dataFim);
      const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 3;
    });

    const expired = editais.filter(e => {
      const end = new Date(e.dataFim);
      const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff < 0;
    });

    return { urgent, expired };
  }, [editais]);

  const totalNotifications = notifications.urgent.length + notifications.expired.length;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-sky-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="bg-sky-100 p-2 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
            <img 
              src="https://cdn.iconscout.com/icon/free/png-256/free-arquivo-icon-svg-download-png-453729.png" 
              alt="Sabiá Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-sky-900">Sabiá <span className="text-yellow-600">Editais</span></h1>
            <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest">Inteligência Cultural</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 flex items-center justify-center bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-full transition-all relative"
            >
              <i className="fas fa-bell"></i>
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-yellow-900 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  {totalNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl z-20 overflow-hidden border border-sky-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-sky-50/50 border-b border-sky-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-sky-900">Notificações</h3>
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-full">
                      {totalNotifications} Alertas
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {totalNotifications === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <i className="fas fa-check text-sky-300"></i>
                        </div>
                        <p className="text-xs text-slate-400">Nenhum alerta pendente.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-sky-50">
                        {notifications.urgent.map(e => (
                          <div 
                            key={e.id} 
                            className="p-4 hover:bg-yellow-50/50 cursor-pointer transition-colors"
                            onClick={() => { setActiveTab('editais'); setShowNotifications(false); }}
                          >
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                                <i className="fas fa-hourglass-half text-sm"></i>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-slate-800 line-clamp-1">{e.nomeEdital}</p>
                                <p className="text-[10px] text-yellow-600 font-bold uppercase">Vence em 3 dias!</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {notifications.expired.map(e => (
                          <div 
                            key={e.id} 
                            className="p-4 hover:bg-slate-50 cursor-pointer transition-colors opacity-75"
                            onClick={() => { setActiveTab('editais'); setShowNotifications(false); }}
                          >
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                <i className="fas fa-calendar-times text-sm"></i>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-slate-800 line-clamp-1">{e.nomeEdital}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Encerrado</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-sky-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-sky-900">Admin Sabiá</p>
              <p className="text-[10px] text-sky-500 uppercase tracking-tighter">Consultor Master</p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-sky-100 flex items-center justify-center font-bold text-sky-700 border border-sky-200">
              S
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
