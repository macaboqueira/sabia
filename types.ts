
export type ClienteTipo = 'artista' | 'poeta' | 'coletivo' | 'agente' | 'empresa' | 'ong';

export interface RedeSocial {
  platform: string;
  url: string;
}

export interface Cliente {
  id: string;
  nome: string;
  tipo: ClienteTipo;
  email: string;
  telefone: string;
  cep?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  site?: string;
  mapaCultura?: string;
  redesSociais: RedeSocial[];
  status: 'ativo' | 'inativo';
  dataCadastro: string;
}

export interface Edital {
  id: string;
  orgao: string;
  nomeEdital: string;
  dataInicio: string;
  dataFim: string;
  valor: string;
  categoria: string;
  resumo: string;
  objetivo: string;
  elegibilidade: string;
  dataCadastro: string;
}

export interface Projeto {
  id: string;
  nome: string;
  clienteId: string;
  editalId: string;
  status: 'em_elaboracao' | 'enviado' | 'selecionado' | 'aprovado' | 'nao_aprovado';
  dataInicio: string;
  publicoAtendido?: string;
  descricao?: string;
}

export interface ProcessingTask {
  id: string;
  fileName: string;
  status: 'reading' | 'analyzing' | 'completed' | 'error';
  progress: number;
  result?: Partial<Edital>;
  error?: string;
}

export interface AppData {
  editais: Edital[];
  clientes: Cliente[];
  projetos: Projeto[];
}
