
import React, { useMemo } from 'react';
import { AppData } from '../types';

interface DashboardProps {
  data: AppData;
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, setActiveTab }) => {
  const stats = useMemo(() => {
    const today = new Date();
    const urgent = data.editais.filter(e => {
      const end = new Date(e.dataFim);
      const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 7;
    }).length;

    return [
      { label: 'Editais', value: data.editais.length, icon: 'fa-file-lines', color: 'bg-sky-100 text-sky-600' },
      { label: 'Clientes', value: data.clientes.length, icon: 'fa-users', color: 'bg-yellow-100 text-yellow-700' },
      { label: 'Projetos', value: data.projetos.length, icon: 'fa-pencil-ruler', color: 'bg-emerald-100 text-emerald-700' },
      { label: 'Prazos', value: urgent, icon: 'fa-triangle-exclamation', color: 'bg-rose-100 text-rose-600' },
    ];
  }, [data]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Olá, Consultor Sabiá!</h2>
          <p className="text-slate-500 font-medium">Veja o resumo do seu pipeline cultural hoje.</p>
        </div>
        <button 
          onClick={() => setActiveTab('upload')}
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-500/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Analisar Novo Edital
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-sky-50 hover-lift group">
            <div className="flex items-center gap-5">
              <div className={`${stat.color} w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-sky-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <i className="fas fa-clock text-8xl text-sky-900"></i>
          </div>
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <i className="fas fa-bolt text-yellow-500"></i> Editais com Prazos Curtos
            </h3>
            <button onClick={() => setActiveTab('editais')} className="text-sky-600 text-xs font-bold hover:bg-sky-50 px-3 py-1.5 rounded-xl transition-all">Ver todos</button>
          </div>
          <div className="space-y-4 relative z-10">
            {data.editais.length > 0 ? (
              data.editais.slice(0, 4).map((edital, i) => {
                const daysLeft = Math.ceil((new Date(edital.dataFim).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={i} className="flex items-center justify-between p-5 bg-sky-50/50 rounded-2xl border border-sky-100 hover:bg-sky-100/50 transition-all cursor-pointer group">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="font-bold text-slate-800 group-hover:text-sky-700 transition-colors truncate">{edital.nomeEdital}</h4>
                      <p className="text-xs text-slate-500 font-medium">{edital.orgao}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider ${daysLeft <= 7 ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                        {daysLeft > 0 ? `${daysLeft} dias` : 'Encerrado'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                  <i className="fas fa-calendar-check text-2xl"></i>
                </div>
                <p className="text-slate-400 italic text-sm">Nenhum edital crítico encontrado.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-sky-50/30 p-8 rounded-[2.5rem] shadow-sm border border-sky-50">
           <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <i className="fas fa-wave-square text-sky-400"></i> Fluxo Recente
            </h3>
          </div>
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center shadow-sm relative z-10">
                  <i className="fas fa-user-plus text-sm"></i>
                </div>
                <div className="absolute top-10 bottom-[-32px] left-5 w-px bg-sky-100"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Novo Cliente</p>
                <p className="text-xs text-slate-500 font-medium">Você cadastrou um novo artista visual hoje.</p>
                <span className="text-[10px] text-sky-400 font-bold uppercase mt-1 block">Há 2 horas</span>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm relative z-10">
                  <i className="fas fa-check-double text-sm"></i>
                </div>
                <div className="absolute top-10 bottom-[-32px] left-5 w-px bg-sky-100"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Análise Concluída</p>
                <p className="text-xs text-slate-500 font-medium">A IA do Sabiá terminou de ler o Edital Paulo Gustavo.</p>
                <span className="text-[10px] text-sky-400 font-bold uppercase mt-1 block">Há 5 horas</span>
              </div>
            </div>
             <div className="flex gap-5">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm relative z-10">
                <i className="fas fa-paper-plane text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Projeto Enviado</p>
                <p className="text-xs text-slate-500 font-medium">"Cine Periferia" movido para o status Enviado.</p>
                <span className="text-[10px] text-sky-400 font-bold uppercase mt-1 block">Ontem</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
