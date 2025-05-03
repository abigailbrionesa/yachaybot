import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ 
    apiKey: process.env.PINECONE_API_KEY ?? '' 
  });

  const indexName = 'yachaybot-saberes';

async function generateEmbedding(text: string): Promise<number[]> {
    const result = await pc.inference.embed('llama-text-embed-v2', [text], {
      input_type: 'query',
    });
  
    if (!result.data || result.data.length === 0 || !result.data[0].values) {
      throw new Error("No se recibieron embeddings de la API");
    }
  
    return result.data[0].values;
  }
  
export async function queryKnowledgeBase(userQuestion: string) {
    try {
      const index = pc.index(indexName).namespace("saberes_validados");
      
      const queryEmbedding = await generateEmbedding(userQuestion);
      
      const queryParams = {
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true,
      };
      
      const results = await index.query(queryParams);
      
      return results.matches
        .filter(match => match.score > 0.05) 
        .map(match => ({
          id: match.id,
          score: match.score,
          ...match.metadata
        }));
        
    } catch (error) {
      console.error("Error en la consulta Pinecone:", error);
      return [];
    }
  }