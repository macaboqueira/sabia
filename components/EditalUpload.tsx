
import React, { useState, useRef } from 'react';
import { Edital, ProcessingTask } from '../types';

interface EditalUploadProps {
  onSave: (edital: Edital) => void;
  onCancel: () => void;
  processingTasks: ProcessingTask[];
  onStartAnalysis: (file: File) => void;
  onRemoveTask: (id: string) => void;
}

const EditalUpload: React.FC<EditalUploadProps> = ({ 
  onSave, 
  onCancel, 
  processingTasks, 
  onStartAnalysis, 
  onRemoveTask 
}) => {
  const [selectedTaskResult, setSelectedTaskResult] = useState<ProcessingTask | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onStartAnalysis(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTaskResult) return;
    
    const formData = new FormData(e.currentTarget);
    const edital: Edital = {
      id: Date.now().toString(),
      orgao: formData.get('orgao') as string,
      nomeEdital: formData.get('nomeEdital') as string,
      dataInicio: formData.get('dataInicio') as string,
      dataFim: formData.get('dataFim') as string,
      valor: formData.get('valor') as string,
      categoria: formData.get('categoria') as string,
      resumo: formData.get('resumo') as string,
      objetivo: formData.get('objetivo') as string,
      elegibilidade: formData.get('elegibilidade') as string,
      dataCadastro: new Date().toISOString()
    };
    onSave(edital);
    onRemoveTask(selectedTaskResult.id);
    setSelectedTaskResult(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-sky-50 overflow-hidden animate-in fade-in slide-in-from-top-6 duration-700">
        <div className="p-8 border-b border-sky-50 flex justify-between items-center bg-sky-50/20">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Análise Inteligente</h2>
            <p className="text-sm text-slate-500 font-medium">O Sabiá processa o PDF e extrai os pontos críticos para você.</p>
          </div>
          <button onClick={onCancel} className="w-10 h-10 rounded-2xl bg-white text-slate-400 hover:text-rose-500 transition-colors shadow-sm border border-sky-50">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-10">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-[3px] border-dashed border-sky-100 rounded-[2.5rem] p-16 text-center cursor-pointer transition-all hover:border-sky-400 hover:bg-sky-50 group"
          >
            <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <div className="space-y-5">
              <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-[1.5rem] flex items-center justify-center mx-auto text-3xl shadow-sm group-hover:scale-110 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-all duration-500">
                <i className="fas fa-cloud-arrow-up"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Clique para enviar o Edital (PDF)</h3>
                <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">Nossa IA Sabiá analisará as datas, valores e objetivos em segundos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {processingTasks.length > 0 && !selectedTaskResult && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-sky-50 p-8 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <i className="fas fa-gear fa-spin"></i> Processando Agora
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processingTasks.map(task => (
              <div key={task.id} className="bg-sky-50/50 rounded-3xl p-6 border border-sky-100 flex items-center gap-5 relative group overflow-hidden">
                <div className="flex-1 space-y-3 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{task.fileName}</span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-xl border ${
                      task.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      task.status === 'error' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                      'bg-sky-100 text-sky-700 border-sky-200'
                    }`}>
                      {task.status === 'reading' ? 'Lendo...' : 
                       task.status === 'analyzing' ? 'IA Ativa' : 
                       task.status === 'completed' ? 'Sucesso' : 'Falhou'}
                    </span>
                  </div>
                  
                  {task.status !== 'completed' && task.status !== 'error' && (
                    <div className="w-full bg-white rounded-full h-2 shadow-inner overflow-hidden">
                      <div className="bg-sky-500 h-full transition-all duration-1000" style={{ width: `${task.progress}%` }}></div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    {task.status === 'completed' ? (
                      <button 
                        onClick={() => setSelectedTaskResult(task)}
                        className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-sky-100 flex items-center gap-2"
                      >
                        <i className="fas fa-magic"></i> Revisar Análise
                      </button>
                    ) : (
                      <span className="text-[10px] text-sky-400 font-bold">
                        {task.status === 'error' ? task.error : `${task.progress}% concluído`}
                      </span>
                    )}
                    <button 
                      onClick={() => onRemoveTask(task.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <i className="fas fa-trash-can text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTaskResult && (
        <div className="bg-white rounded-[3rem] shadow-2xl border border-sky-100 overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-8 bg-gradient-to-br from-sky-50 to-white border-b border-sky-50 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-sky-900 flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-sky-500 shadow-sm"><i className="fas fa-check"></i></span>
              Relatório Gerado pelo Sabiá
            </h2>
            <button onClick={() => setSelectedTaskResult(null)} className="w-12 h-12 rounded-2xl bg-white text-slate-300 hover:text-slate-600 transition-colors shadow-sm">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Órgão Público</label>
                <input name="orgao" defaultValue={selectedTaskResult.result?.orgao} required className="w-full px-5 py-4 rounded-2xl border border-sky-50 bg-sky-50/10 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-700 shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Oficial</label>
                <input name="nomeEdital" defaultValue={selectedTaskResult.result?.nomeEdital} required className="w-full px-5 py-4 rounded-2xl border border-sky-50 bg-sky-50/10 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-700 shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Abertura</label>
                <input type="date" name="dataInicio" defaultValue={selectedTaskResult.result?.dataInicio} className="w-full px-5 py-4 rounded-2xl border border-sky-50 bg-sky-50/10 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-700 shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Encerramento</label>
                <input type="date" name="dataFim" defaultValue={selectedTaskResult.result?.dataFim} required className="w-full px-5 py-4 rounded-2xl border border-sky-50 bg-sky-50/10 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-700 shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Teto de Recurso</label>
                <input name="valor" defaultValue={selectedTaskResult.result?.valor} className="w-full px-5 py-4 rounded-2xl border border-sky-50 bg-sky-50/10 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-700 shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Abrangência</label>
                <select name="categoria" defaultValue={selectedTaskResult.result?.categoria} className="w-full px-5 py-4 rounded-2xl border border-sky-50 bg-sky-50/10 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-bold text-sky-900 shadow-sm">
                  <option value="Municipal">Municipal</option>
                  <option value="Estadual">Estadual</option>
                  <option value="Federal">Federal</option>
                  <option value="Privado">Fomento Privado</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Resumo Executivo (IA)</label>
              <textarea name="resumo" rows={3} defaultValue={selectedTaskResult.result?.resumo} className="w-full px-5 py-4 rounded-3xl border border-sky-50 bg-sky-50/10 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-700 shadow-sm resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Objetivo Primário</label>
              <textarea name="objetivo" rows={3} defaultValue={selectedTaskResult.result?.objetivo} className="w-full px-5 py-4 rounded-3xl border border-sky-50 bg-sky-50/10 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium text-slate-700 shadow-sm resize-none" />
            </div>

            <div className="flex justify-end gap-4 pt-10">
              <button 
                type="button" 
                onClick={() => setSelectedTaskResult(null)}
                className="px-10 py-4 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-12 py-4 bg-sky-600 text-white rounded-2xl font-bold shadow-2xl shadow-sky-600/30 hover:bg-sky-700 hover:scale-105 transition-all flex items-center gap-2"
              >
                <i className="fas fa-check-double"></i> Confirmar e Salvar no Acervo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditalUpload;
