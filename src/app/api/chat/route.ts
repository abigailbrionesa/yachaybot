import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { queryKnowledgeBase } from '@/lib/pinecone';
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  const userQuestion = lastUserMessage?.content || '';
  const knowledgeResults = await queryKnowledgeBase(userQuestion);

  const context = knowledgeResults.length > 0
    ? knowledgeResults.map(result => 
        `Conocimiento: ${result.conocimiento_texto}\nContexto: ${result.contexto_cultural}\nRegión: ${result.region}`
      ).join('\n\n')
    : 'No se encontró información relevante en la base de conocimientos.';
    
    const systemPrompt = `Eres YachayBot, un asistente especializado en saberes ancestrales de los pueblos indígenas de los Andes. 
    Utiliza la siguiente información como referencia, pero adapta tu respuesta al estilo de conversación natural:
  
    ${context}
  
    Instrucciones:
    - Responde en el mismo idioma de la pregunta
    - Sé conciso pero mantén la esencia cultural
    - Si no sabes algo, dilo honestamente
    - Usa un tono cálido y cercano`;


  
  const result = streamText({
    model: mistral('mistral-small-latest'),
    system: systemPrompt,
    messages,
  });
  return result.toDataStreamResponse();
}
