
import React, { useState, useMemo } from 'react';
import { Edital } from '../types';

interface EditaisListProps {
  editais: Edital[];
  onDelete: (id: string) => void;
}

type StatusType = 'Todos' | 'Aberto' | 'Urgente' | 'Encerrado';

const EditaisList: React.FC<EditaisListProps> = ({ editais, onDelete }) => {
  const [statusFilter, setStatusFilter] = useState<StatusType>('Todos');
  const [organFilter, setOrganFilter] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEdital, setSelectedEdital] = useState<Edital | null>(null);

  const organs = useMemo(() => {
    const set = new Set(editais.map(e => e.orgao));
    return ['Todos', ...Array.from(set)].sort();
  }, [editais]);

  const getEditalStatus = (dataFim: string): StatusType => {
    const daysLeft = Math.ceil((new Date(dataFim).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'Encerrado';
    if (daysLeft <= 7) return 'Urgente';
    return 'Aberto';
  };

  const filteredEditais = useMemo(() => {
    return editais.filter(edital => {
      const status = getEditalStatus(edital.dataFim);
      const matchesStatus = statusFilter === 'Todos' || status === statusFilter;
      const matchesOrgan = organFilter === 'Todos' || edital.orgao === organFilter;
      const matchesSearch = edital.nomeEdital.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           edital.orgao.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesOrgan && matchesSearch;
    });
  }, [editais, statusFilter, organFilter, searchTerm]);

  const exportToCSV = () => {
    const headers = ['Nome do Edital', 'Órgão', 'Categoria', 'Valor', 'Prazo Final', 'Status'];
    const rows = filteredEditais.map(e => [
      `"${e.nomeEdital.replace(/"/g, '""')}"`,
      `"${e.orgao.replace(/"/g, '""')}"`,
      e.categoria,
      `"${e.valor || 'N/I'}"`,
      new Date(e.dataFim).toLocaleDateString('pt-BR'),
      getEditalStatus(e.dataFim)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `editais_sabiá_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'Aberto': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'Urgente': return 'bg-yellow-100 text-yellow-700 border-yellow-200 animate-pulse';
      case 'Encerrado': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Acervo de Oportunidades</h2>
          <p className="text-slate-500 font-medium">Explore os editais garimpados pela nossa inteligência.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-white border border-sky-100 text-sky-700 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-sky-50 transition-all shadow-sm"
          >
            <i className="fas fa-file-export"></i> Exportar
          </button>
          <div className="bg-sky-100/50 px-4 py-3 rounded-2xl border border-sky-100">
             <span className="text-sm font-bold text-sky-700">{filteredEditais.length} editais</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-sky-50 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[240px] space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Palavra-Chave</label>
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-sky-300"></i>
            <input 
              type="text" 
              placeholder="Buscar edital..." 
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sky-50 bg-sky-50/30 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full sm:w-auto space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
          <select 
            className="w-full sm:w-44 px-4 py-3 rounded-2xl border border-sky-50 bg-sky-50/30 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-bold text-sky-900"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusType)}
          >
            <option value="Todos">Todos</option>
            <option value="Aberto">Aberto</option>
            <option value="Urgente">Urgente</option>
            <option value="Encerrado">Encerrado</option>
          </select>
        </div>

        <div className="w-full sm:w-auto space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Órgão</label>
          <select 
            className="w-full sm:w-52 px-4 py-3 rounded-2xl border border-sky-50 bg-sky-50/30 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all text-sm font-bold text-sky-900"
            value={organFilter}
            onChange={(e) => setOrganFilter(e.target.value)}
          >
            {organs.map(organ => (
              <option key={organ} value={organ}>{organ}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredEditais.length > 0 ? filteredEditais.map(edital => {
          const status = getEditalStatus(edital.dataFim);
          const daysLeft = Math.ceil((new Date(edital.dataFim).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={edital.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-sky-50 overflow-hidden flex flex-col hover-lift">
              <div className="p-8 flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border uppercase tracking-widest ${getStatusStyles(status)}`}>
                    {status}
                  </span>
                  <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center text-sm shadow-inner group-hover:rotate-12 transition-transform">
                    <i className="fas fa-file-lines"></i>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-sky-600 transition-colors">
                    {edital.nomeEdital}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                    <i className="fas fa-building text-sky-200"></i>
                    <span className="truncate">{edital.orgao}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-50">
                    <p className="text-[10px] font-bold text-sky-300 uppercase mb-1">Captação</p>
                    <p className="text-sm font-bold text-sky-700">{edital.valor || 'Sob Consulta'}</p>
                  </div>
                  <div className="bg-yellow-50/50 rounded-2xl p-4 border border-yellow-50">
                    <p className="text-[10px] font-bold text-yellow-400 uppercase mb-1">Prazo</p>
                    <p className="text-sm font-bold text-yellow-700">
                      {new Date(edital.dataFim).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                    {edital.categoria || 'Geral'}
                  </span>
                </div>
              </div>

              <div className="px-8 py-5 bg-sky-50/30 border-t border-sky-50 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedEdital(edital)}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-2 group/btn"
                >
                  <span className="group-hover/btn:underline">EXPLORAR EDITAL</span>
                  <i className="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                </button>
                <button 
                  onClick={() => confirm('Apagar este edital do acervo?') && onDelete(edital.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-300 hover:bg-white hover:text-rose-500 hover:shadow-md transition-all"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-24 bg-white rounded-[3rem] border-2 border-dashed border-sky-100 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-sky-50 rounded-[2rem] flex items-center justify-center text-sky-200 text-4xl mb-6 shadow-inner">
              <i className="fas fa-box-open"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Acervo Vazio</h3>
            <p className="text-slate-400 max-w-sm mx-auto font-medium">Comece agora analisando o primeiro PDF com a inteligência do Sabiá.</p>
            <button 
              onClick={() => { setStatusFilter('Todos'); setOrganFilter('Todos'); setSearchTerm(''); }}
              className="mt-8 text-sky-700 font-bold bg-sky-100 px-8 py-3 rounded-2xl hover:bg-sky-200 transition-all"
            >
              Recarregar Tudo
            </button>
          </div>
        )}
      </div>

      {/* Modal is same logic as before, but styled with pastel */}
      {selectedEdital && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="fixed inset-0" onClick={() => setSelectedEdital(null)} />
          <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-10 bg-gradient-to-br from-sky-50/50 to-white border-b border-sky-50 flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-[10px] font-bold px-4 py-1.5 rounded-2xl border uppercase tracking-widest ${getStatusStyles(getEditalStatus(selectedEdital.dataFim))}`}>
                    {getEditalStatus(selectedEdital.dataFim)}
                  </span>
                  <span className="text-[10px] font-bold px-4 py-1.5 rounded-2xl border border-yellow-100 bg-yellow-50 text-yellow-700 uppercase tracking-widest">
                    {selectedEdital.categoria}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 leading-tight">
                  {selectedEdital.nomeEdital}
                </h3>
                <p className="text-sky-600 font-bold flex items-center gap-2">
                  <i className="fas fa-landmark"></i> {selectedEdital.orgao}
                </p>
              </div>
              <button 
                onClick={() => setSelectedEdital(null)}
                className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-sky-50 flex items-center justify-center text-slate-400 hover:text-sky-600 transition-all shrink-0"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="bg-sky-50/30 p-6 rounded-[2rem] border border-sky-50 space-y-2">
                  <p className="text-[10px] font-bold text-sky-300 uppercase tracking-widest">Valor do Edital</p>
                  <p className="text-xl font-bold text-sky-800">{selectedEdital.valor || 'Sob Demanda'}</p>
                </div>
                <div className="bg-yellow-50/30 p-6 rounded-[2rem] border border-yellow-50 space-y-2">
                  <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Encerramento</p>
                  <p className="text-xl font-bold text-yellow-800">
                    {new Date(selectedEdital.dataFim).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="bg-emerald-50/30 p-6 rounded-[2rem] border border-emerald-50 space-y-2">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Publicação</p>
                  <p className="text-xl font-bold text-emerald-800">
                    {selectedEdital.dataInicio ? new Date(selectedEdital.dataInicio).toLocaleDateString('pt-BR') : 'Publicado'}
                  </p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-sky-900 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-[10px]"><i className="fas fa-bullseye"></i></span>
                    Objetivo Central
                  </h4>
                  <p className="text-slate-600 leading-relaxed bg-white p-6 rounded-3xl border border-sky-50 shadow-sm">
                    {selectedEdital.objetivo || 'Não capturado.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-sky-900 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 text-[10px]"><i className="fas fa-user-check"></i></span>
                    Perfil de Proponentes
                  </h4>
                  <p className="text-slate-600 leading-relaxed bg-white p-6 rounded-3xl border border-sky-50 shadow-sm">
                    {selectedEdital.elegibilidade || 'Não capturado.'}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-[2rem] border border-sky-100">
                  <h4 className="text-sm font-bold text-sky-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <i className="fas fa-brain text-sky-400"></i> Notas da IA Sabiá
                  </h4>
                  <p className="text-sm text-slate-600 italic leading-relaxed pl-6 border-l-2 border-sky-200">
                    {selectedEdital.resumo || 'Nenhuma nota especial.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-sky-50 flex flex-col sm:flex-row gap-6 items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Sabiá ID: {selectedEdital.id}</span>
              <div className="flex gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setSelectedEdital(null)}
                  className="flex-1 sm:flex-none px-10 py-4 rounded-2xl font-bold text-slate-600 border border-slate-200 hover:bg-white transition-all"
                >
                  Voltar
                </button>
                <button className="flex-1 sm:flex-none px-10 py-4 bg-sky-600 text-white rounded-2xl font-bold shadow-xl shadow-sky-600/20 hover:bg-sky-700 transition-all">
                  Baixar Edital
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditaisList;
