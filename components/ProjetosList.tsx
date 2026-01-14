
import React, { useState } from 'react';
import { Projeto, Cliente, Edital } from '../types';

interface ProjetosListProps {
  projetos: Projeto[];
  clientes: Cliente[];
  editais: Edital[];
  onAdd: (p: Projeto) => void;
  onUpdate: (p: Projeto) => void;
}

const ProjetosList: React.FC<ProjetosListProps> = ({ projetos, clientes, editais, onAdd, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const clienteId = formData.get('clienteId') as string;
    const editalId = formData.get('editalId') as string;

    if (!clienteId || !editalId) {
      alert("Por favor, selecione um cliente e um edital.");
      return;
    }

    const projeto: Projeto = {
      id: Date.now().toString(),
      nome: formData.get('nome') as string,
      clienteId: clienteId,
      editalId: editalId,
      status: 'em_elaboracao',
      dataInicio: new Date().toISOString().split('T')[0],
      descricao: formData.get('descricao') as string
    };

    onAdd(projeto);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: Projeto['status']) => {
    const badges = {
      em_elaboracao: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      enviado: 'bg-sky-100 text-sky-700 border-sky-200',
      selecionado: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      aprovado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      nao_aprovado: 'bg-rose-100 text-rose-700 border-rose-200',
    };
    const labels = {
      em_elaboracao: 'Elaboração',
      enviado: 'Submetido',
      selecionado: 'Selecionado',
      aprovado: 'Aprovado',
      nao_aprovado: 'Não Aprovado',
    };
    return (
      <span className={`text-[10px] font-bold px-3 py-1 rounded-xl uppercase tracking-widest border ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Monitor de Projetos</h2>
          <p className="text-slate-500 font-medium">Controle o status de cada proposta submetida.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-lg shadow-sky-500/20 hover:scale-105 transition-all flex items-center gap-3"
        >
          <i className="fas fa-plus"></i> Iniciar Proposta
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projetos.length > 0 ? (
          projetos.map((projeto) => {
            const cliente = clientes.find((c) => c.id === projeto.clienteId);
            const edital = editais.find((e) => e.id === projeto.editalId);
            return (
              <div
                key={projeto.id}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-sky-50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover-lift"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-800">{projeto.nome}</h3>
                    {getStatusBadge(projeto.status)}
                  </div>
                  <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
                    <div className="flex items-center gap-2 text-slate-500">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                        <i className="fas fa-user text-xs"></i>
                      </div>
                      <span className="text-slate-700">{cliente?.nome || 'Cliente não encontrado'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <i className="fas fa-file-invoice text-xs"></i>
                      </div>
                      <span className="text-slate-700 truncate max-w-[250px]">
                        {edital?.nomeEdital || 'Edital não encontrado'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-sky-50/30 p-3 rounded-[1.5rem] border border-sky-50">
                  <select
                    className="bg-white border-none text-xs font-bold py-2.5 px-4 rounded-xl outline-none focus:ring-4 focus:ring-sky-100 text-sky-900 transition-all shadow-sm cursor-pointer"
                    value={projeto.status}
                    onChange={(e) => onUpdate({ ...projeto, status: e.target.value as any })}
                  >
                    <option value="em_elaboracao">Elaboração</option>
                    <option value="enviado">Submetido</option>
                    <option value="selecionado">Selecionado</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="nao_aprovado">Não Aprovado</option>
                  </select>
                  <button className="w-10 h-10 flex items-center justify-center text-sky-300 hover:text-sky-600 hover:bg-white rounded-xl transition-all">
                    <i className="fas fa-cog"></i>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-sky-100 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-sky-50 rounded-[2rem] flex items-center justify-center text-sky-200 text-4xl mb-6 shadow-inner">
              <i className="fas fa-tasks"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum projeto ativo</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto">
              Selecione um cliente e um edital para começar a redigir uma nova proposta vencedora.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 bg-sky-100 text-sky-700 px-8 py-3 rounded-2xl font-bold hover:bg-sky-200 transition-all"
            >
              Criar Primeiro Projeto
            </button>
          </div>
        )}
      </div>

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-gradient-to-br from-sky-50 to-white border-b border-sky-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-sky-900">Iniciar Nova Proposta</h3>
                <p className="text-sm text-slate-500 font-medium">Preencha os dados básicos para o monitoramento.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 rounded-2xl bg-white text-slate-300 hover:text-slate-600 transition-colors shadow-sm border border-sky-50"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Projeto</label>
                <input 
                  name="nome" 
                  placeholder="Ex: Festival de Cinema Periférico" 
                  required 
                  className="w-full px-5 py-4 rounded-2xl border border-sky-50 bg-sky-50/20 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cliente / Proponente</label>
                  <select 
                    name="clienteId" 
                    required 
                    className="w-full px-5 py-4 rounded-2xl border border-sky-50 bg-sky-50/20 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-bold text-sky-900"
                  >
                    <option value="">Selecione o Cliente</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Edital de Destino</label>
                  <select 
                    name="editalId" 
                    required 
                    className="w-full px-5 py-4 rounded-2xl border border-sky-50 bg-sky-50/20 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-bold text-sky-900"
                  >
                    <option value="">Selecione o Edital</option>
                    {editais.map(e => (
                      <option key={e.id} value={e.id}>{e.nomeEdital}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Breve Descrição / Status Inicial</label>
                <textarea 
                  name="descricao" 
                  rows={3} 
                  placeholder="Descreva brevemente o escopo do projeto ou observações iniciais..."
                  className="w-full px-5 py-4 rounded-[1.5rem] border border-sky-50 bg-sky-50/20 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-700 resize-none"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 rounded-2xl font-bold text-slate-500 border border-slate-100 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-10 py-4 bg-sky-600 text-white rounded-2xl font-bold shadow-xl shadow-sky-600/20 hover:bg-sky-700 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-rocket"></i> Lançar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjetosList;
