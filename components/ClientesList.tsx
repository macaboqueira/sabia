
import React, { useState } from 'react';
import { Cliente, Projeto } from '../types';

interface ClientesListProps {
  clientes: Cliente[];
  projetos: Projeto[];
  onAdd: (c: Cliente) => void;
  onUpdate: (c: Cliente) => void;
  onDelete: (id: string) => void;
}

const ClientesList: React.FC<ClientesListProps> = ({ clientes, onAdd, onUpdate, onDelete, projetos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewProjectsId, setViewProjectsId] = useState<string | null>(null);

  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cliente: Cliente = {
      id: editingCliente?.id || Date.now().toString(),
      nome: formData.get('nome') as string,
      tipo: formData.get('tipo') as any,
      email: formData.get('email') as string,
      telefone: formData.get('telefone') as string,
      cidade: formData.get('cidade') as string,
      estado: formData.get('estado') as string,
      status: 'ativo',
      redesSociais: editingCliente?.redesSociais || [],
      dataCadastro: editingCliente?.dataCadastro || new Date().toISOString()
    };

    if (editingCliente) {
      onUpdate(cliente);
    } else {
      onAdd(cliente);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCliente(null);
  };

  const openEdit = (c: Cliente) => {
    setEditingCliente(c);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Base de Artistas</h2>
          <p className="text-slate-500 font-medium">Gerencie sua rede de talentos e proponentes.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-8 py-4 rounded-[1.5rem] font-bold shadow-lg shadow-yellow-400/20 hover:scale-105 transition-all flex items-center gap-3"
          >
            <i className="fas fa-plus"></i> Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-sky-50">
        <div className="relative">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-sky-200"></i>
          <input 
            type="text" 
            placeholder="Buscar por nome, e-mail ou talento..." 
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-sky-50 bg-sky-50/30 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredClientes.map(cliente => {
          const clienteProjetos = projetos.filter(p => p.clienteId === cliente.id);
          return (
            <div key={cliente.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-sky-50 hover-lift relative group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-[1.5rem] flex items-center justify-center text-2xl font-bold shadow-inner group-hover:bg-yellow-100 group-hover:text-yellow-700 transition-colors">
                    {cliente.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 leading-tight truncate max-w-[200px]">{cliente.nome}</h3>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-xl mt-1 inline-block">{cliente.tipo}</span>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === cliente.id ? null : cliente.id)}
                    className="w-11 h-11 flex items-center justify-center rounded-2xl bg-sky-50/50 text-sky-300 hover:bg-sky-100 hover:text-sky-600 transition-all"
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </button>

                  {activeMenuId === cliente.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                      <div className="absolute right-0 mt-3 w-52 bg-white rounded-3xl shadow-2xl border border-sky-50 z-20 overflow-hidden py-2 animate-in zoom-in-95 duration-150">
                        <button 
                          onClick={() => { setViewProjectsId(cliente.id); setActiveMenuId(null); }}
                          className="w-full text-left px-5 py-3 text-sm font-bold text-slate-600 hover:bg-sky-50 flex items-center gap-3"
                        >
                          <i className="fas fa-eye text-sky-400"></i> Ver Portfolio
                        </button>
                        <button 
                          onClick={() => openEdit(cliente)}
                          className="w-full text-left px-5 py-3 text-sm font-bold text-slate-600 hover:bg-sky-50 flex items-center gap-3"
                        >
                          <i className="fas fa-pencil text-yellow-500"></i> Editar
                        </button>
                        <hr className="my-2 border-sky-50" />
                        <button 
                          onClick={() => { confirm('Deseja realmente excluir este cliente?') && onDelete(cliente.id); setActiveMenuId(null); }}
                          className="w-full text-left px-5 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3"
                        >
                          <i className="fas fa-trash-alt"></i> Excluir
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <i className="fas fa-envelope text-[10px] text-slate-300"></i>
                  </div>
                  <span className="truncate">{cliente.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <i className="fas fa-phone text-[10px] text-slate-300"></i>
                  </div>
                  {cliente.telefone}
                </div>
              </div>

              <div className="pt-6 border-t border-sky-50 flex justify-between items-center">
                <div className="flex gap-4">
                   <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Projetos</span>
                    <span className="text-sm font-bold text-sky-800">{clienteProjetos.length} no pipeline</span>
                  </div>
                </div>
                <button 
                  onClick={() => setViewProjectsId(cliente.id)}
                  className="bg-sky-50 text-sky-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-sky-100 transition-colors"
                >
                  Dashboard Artista
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientesList;
