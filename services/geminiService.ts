
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeEditalText = async (text: string) => {
  if (!text || text.trim().length < 50) {
    throw new Error("O texto do edital é muito curto para uma análise significativa.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um consultor especializado em editais de cultura brasileiros (Lei Paulo Gustavo, Aldir Blanc, editais municipais). 
      Analise o texto a seguir e extraia as informações estruturadas rigorosamente em JSON. 
      Seja preciso nas datas e valores. Se não encontrar algo, retorne uma string vazia.
      
      TEXTO DO EDITAL:
      ${text.substring(0, 40000)}`, // Aumentado o limite para processar editais maiores
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            orgao: { type: Type.STRING, description: "Órgão responsável pelo edital (ex: SECULT, Prefeitura de...)" },
            nomeEdital: { type: Type.STRING, description: "Nome completo do edital" },
            dataInicio: { type: Type.STRING, description: "Data de início das inscrições (Formato: YYYY-MM-DD)" },
            dataFim: { type: Type.STRING, description: "Data de encerramento das inscrições (Formato: YYYY-MM-DD)" },
            valor: { type: Type.STRING, description: "Valor máximo por projeto ou teto de fomento" },
            categoria: { type: Type.STRING, description: "Abrangência: Municipal, Estadual, Federal ou Privado" },
            resumo: { type: Type.STRING, description: "Resumo executivo com os pontos fundamentais (max 3 frases)" },
            objetivo: { type: Type.STRING, description: "O que o edital pretende financiar" },
            elegibilidade: { type: Type.STRING, description: "Quem pode ser proponente (PF, PJ, MEI, Coletivos)" }
          },
          required: ["orgao", "nomeEdital", "dataFim"]
        }
      }
    });

    const resultText = response.text || '{}';
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    throw new Error("A IA não conseguiu processar este arquivo. Verifique se o PDF contém texto legível.");
  }
};
