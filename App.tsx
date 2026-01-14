
import React, { useState, useEffect, useCallback } from 'react';
import { AppData, Cliente, Edital, Projeto, ProcessingTask } from './types';
import Dashboard from './components/Dashboard';
import EditalUpload from './components/EditalUpload';
import ClientesList from './components/ClientesList';
import ProjetosList from './components/ProjetosList';
import EditaisList from './components/EditaisList';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import * as pdfjsLib from 'pdfjs-dist';
import { analyzeEditalText } from './services/geminiService';

// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const STORAGE_KEY = 'sabia_editais_data_v1';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [processingTasks, setProcessingTasks] = useState<ProcessingTask[]>([]);
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { editais: [], clientes: [], projetos: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addCliente = useCallback((cliente: Cliente) => {
    setData(prev => ({ ...prev, clientes: [...prev.clientes, cliente] }));
  }, []);

  const updateCliente = useCallback((cliente: Cliente) => {
    setData(prev => ({
      ...prev,
      clientes: prev.clientes.map(c => c.id === cliente.id ? cliente : c)
    }));
  }, []);

  const deleteCliente = useCallback((id: string) => {
    if (!confirm('Excluir este cliente removerá também todos os seus projetos. Confirmar?')) return;
    setData(prev => ({
      ...prev,
      clientes: prev.clientes.filter(c => c.id !== id),
      projetos: prev.projetos.filter(p => p.clienteId !== id)
    }));
  }, []);

  const addEdital = useCallback((edital: Edital) => {
    setData(prev => ({ ...prev, editais: [...prev.editais, edital] }));
  }, []);

  const deleteEdital = useCallback((id: string) => {
    if (!confirm('Remover este edital? Projetos vinculados a ele poderão ficar órfãos.')) return;
    setData(prev => ({
      ...prev,
      editais: prev.editais.filter(e => e.id !== id),
      projetos: prev.projetos.filter(p => p.editalId !== id)
    }));
  }, []);

  const addProjeto = useCallback((projeto: Projeto) => {
    setData(prev => ({ ...prev, projetos: [...prev.projetos, projeto] }));
  }, []);

  const updateProjeto = useCallback((projeto: Projeto) => {
    setData(prev => ({
      ...prev,
      projetos: prev.projetos.map(p => p.id === projeto.id ? projeto : p)
    }));
  }, []);

  const startBackgroundAnalysis = async (file: File) => {
    const taskId = Date.now().toString();
    const newTask: ProcessingTask = {
      id: taskId,
      fileName: file.name,
      status: 'reading',
      progress: 5,
    };

    setProcessingTasks(prev => [...prev, newTask]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
        
        const currentProgress = 5 + Math.floor((i / pdf.numPages) * 35);
        setProcessingTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, progress: currentProgress } : t
        ));
      }

      setProcessingTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'analyzing', progress: 50 } : t
      ));

      const result = await analyzeEditalText(fullText);

      setProcessingTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'completed', progress: 100, result } : t
      ));
      
      console.log(`Sabiá: Análise de "${file.name}" pronta para revisão.`);

    } catch (err: any) {
      console.error(err);
      setProcessingTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'error', error: err.message || 'Falha ao processar PDF' } : t
      ));
    }
  };

  const removeTask = (id: string) => {
    setProcessingTasks(prev => prev.filter(t => t.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={data} setActiveTab={setActiveTab} />;
      case 'upload': return (
        <EditalUpload 
          onSave={addEdital} 
          onCancel={() => setActiveTab('dashboard')} 
          processingTasks={processingTasks}
          onStartAnalysis={startBackgroundAnalysis}
          onRemoveTask={removeTask}
        />
      );
      case 'editais': return <EditaisList editais={data.editais} onDelete={deleteEdital} />;
      case 'clientes': return (
        <ClientesList 
          clientes={data.clientes} 
          onAdd={addCliente} 
          onUpdate={updateCliente} 
          onDelete={deleteCliente}
          projetos={data.projetos}
        />
      );
      case 'projetos': return (
        <ProjetosList 
          projetos={data.projetos} 
          clientes={data.clientes} 
          editais={data.editais} 
          onAdd={addProjeto}
          onUpdate={updateProjeto}
        />
      );
      default: return <Dashboard data={data} setActiveTab={setActiveTab} />;
    }
  };

  const activeProcessingCount = processingTasks.filter(t => t.status !== 'completed' && t.status !== 'error').length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <Header editais={data.editais} setActiveTab={setActiveTab} />
      
      {activeProcessingCount > 0 && (
        <div className="bg-sky-600 text-white px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest animate-pulse flex items-center justify-center gap-3 sticky top-[72px] z-40 shadow-md">
          <i className="fas fa-cog fa-spin"></i>
          A IA Sabiá está analisando {activeProcessingCount} edital(is) em segundo plano...
        </div>
      )}

      <div className="flex flex-1 container mx-auto px-4 py-8 gap-8 relative">
        <aside className="hidden lg:block w-72 shrink-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          {renderContent()}
        </main>
      </div>

      <footer className="bg-white border-t border-sky-50 py-10 mt-auto">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <img 
            src="https://cdn.iconscout.com/icon/free/png-256/free-arquivo-icon-svg-download-png-453729.png" 
            alt="Sabiá Logo" 
            className="w-10 h-10 grayscale opacity-20"
          />
          <p className="text-slate-400 text-xs font-medium">
            &copy; 2024 Sabiá Editais. Inteligência artificial aplicada à gestão cultural.
          </p>
        </div>
      </footer>
      
      {/* Mobile Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sky-50 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        {[
          { id: 'dashboard', icon: 'fa-home' },
          { id: 'upload', icon: 'fa-wand-magic-sparkles' },
          { id: 'editais', icon: 'fa-folder-open' },
          { id: 'clientes', icon: 'fa-user-group' },
          { id: 'projetos', icon: 'fa-tasks' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === item.id ? 'bg-sky-100 text-sky-600' : 'text-slate-300'}`}
          >
            <i className={`fas ${item.icon}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
