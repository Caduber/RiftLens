import axios from 'axios';

// const API_KEY = process.env.RIOT_API_KEY;

/**
 * Faz uma requisição para a Riot API com retry exponencial para 429.
 * @param {string} url - URL completa do endpoint
 * @param {number} retries - número máximo de tentativas (padrão 3)
 */
export async function riotFetch(url, retries = 3) {
  let lastError;
  console.log('KEY sendo usada:', process.env.RIOT_API_KEY?.substring(0, 15) + '...');
  console.log('URL:', url);
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
        timeout: 10000,
      });
      return response.data;
    } catch (err) {
      lastError = err;
      if (err.response?.status === 429) {
        const retryAfter = parseInt(err.response.headers['retry-after'] || '1', 10);
        const delay = Math.max(retryAfter * 1000, Math.pow(2, attempt) * 1000);
        console.warn(`Rate limited. Aguardando ${delay}ms antes da tentativa ${attempt + 2}...`);
        await sleep(delay);
        continue;
      }
      // Para outros erros, não retenta
      break;
    }
  }
  throw lastError;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
