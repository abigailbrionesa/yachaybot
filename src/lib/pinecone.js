import { Pinecone } from '@pinecone-database/pinecone';

const indexName = 'yachaybot-saberes';

function getPineconeClient() {
    const apiKey = process.env.PINECONE_API_KEY;

    if (!apiKey) {
        return null;
    }

    return new Pinecone({ apiKey });
}

async function generateEmbedding(text) {
    const result = await pc.inference.embed('llama-text-embed-v2', [text], {
        input_type: 'query',
    });

    if (!result.data || result.data.length === 0 || !result.data[0].values) {
        throw new Error("No se recibieron embeddings de la API");
    }
    return result.data[0].values;
}

export async function queryKnowledgeBase(userQuestion) {
    try {
        const pc = getPineconeClient();

        if (!pc) {
            console.warn("PINECONE_API_KEY no esta configurado; se omite la consulta Pinecone.");
            return [];
        }

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
