// Service IA pour recommandations sportives via Featherless AI
// Utilise le products.json du backend (collaborateur)
import productsData from '@/data/products.json';

const FEATHERLESS_API_URL = 'https://api.featherless.ai/v1/chat/completions';
const FEATHERLESS_API_KEY = import.meta.env.VITE_FEATHERLESS_API_KEY;
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';

/**
 * Formate les produits pour le prompt IA
 */
function formatProductsForAI(products: any[]) {
  if (!products || products.length === 0) {
    return "Aucun produit disponible.";
  }

  const productList = products.map(p => {
    const stockStatus = p.stock_level <= 0 ? "RUPTURE" : `Stock: ${p.stock_level}`;
    const tags = Array.isArray(p.weather_tags) ? p.weather_tags.join(', ') : 'Aucun';
    return `ID: ${p.id} | ${p.name} | ${p.price}€ | Tags: ${tags} | ${stockStatus}`;
  }).join('\n');

  return `CATALOGUE DISPONIBLE :\n${productList}`;
}

/**
 * Génère le system prompt pour l'IA avec contexte
 */
function buildSystemPrompt(productsText: string, weather: string, location: string) {
  return `Tu es un conseiller sportif expert. RÉPONDS UNIQUEMENT EN JSON STRICT.

CONTEXTE ACTUEL :
- Météo : "${weather}"
- Localisation : "${location}"

RÈGLES :
1. Recommande UNIQUEMENT des produits du catalogue ci-dessous
2. PAS de produits en RUPTURE
3. TIENS COMPTE du contexte météo et localisation pour TOUTES les recommandations
4. L'utilisateur ne va PAS répéter la météo, utilise le contexte ci-dessus
5. Ne mentionne JAMAIS les IDs dans le texte
6. Maximum 4 produits recommandés
7. Utilise les NOMS des produits dans ta réponse
8. INTERDIT : Pas de commentaires, pas de texte avant ou après

${productsText}

FORMAT OBLIGATOIRE :
{
  "reply": "Ta réponse courte avec les NOMS des produits adaptés au CONTEXTE",
  "recommended_ids": [1, 2, 3]
}

EXEMPLES :
Si météo = "pluie" et demande = "Je veux faire du vélo" :
{"reply":"Pour le vélo sous la pluie, prends la Veste Pluie City 100 et les Gants Imperméables Trek !","recommended_ids":[3,11]}

Si météo = "soleil" et demande = "Quoi pour courir ?" :
{"reply":"Pour courir au soleil, le T-shirt Breath+ est parfait !","recommended_ids":[2]}

IMPORTANT : Adapte TOUJOURS au contexte météo fourni, même si l'utilisateur ne le mentionne pas dans sa demande.`;
}

/**
 * Appelle l'IA Featherless pour une recommandation avec contexte
 */
export async function askSportAI(
  userMessage: string, 
  currentWeather = "temps normal",
  location = "votre région"
) {
  console.log('Demande IA:', userMessage);
  console.log('Contexte - Météo:', currentWeather, '| Position:', location);

  try {
    // 1. Utiliser les produits du backend (products.json)
    const products = productsData;

    if (!products || products.length === 0) {
      console.error('Erreur chargement produits depuis products.json');
      return {
        reply: "Impossible de charger les produits.",
        recommended_ids: []
      };
    }

    console.log(`${products.length} produits chargés depuis products.json`);

    // 2. Construire le prompt avec contexte
    const productsText = formatProductsForAI(products);
    const systemPrompt = buildSystemPrompt(productsText, currentWeather, location);

    // 3. Vérifier la clé API
    if (!FEATHERLESS_API_KEY || FEATHERLESS_API_KEY === 'ta_cle_featherless_ici') {
      console.warn('Clé Featherless non configurée - Mode démo');
      
      // Mode démo : recommandation basique basée sur météo
      const weatherMap: Record<string, number[]> = {
        'pluie': [1],
        'soleil': [2],
        'froid': [1],
        'vent': [1]
      };
      
      const demoIds = weatherMap[currentWeather.toLowerCase()] || [2];
      
      return {
        reply: `Mode démo (configure VITE_FEATHERLESS_API_KEY). Voici une recommandation basique pour "${currentWeather}".`,
        recommended_ids: demoIds
      };
    }

    // 4. Appeler l'API Featherless
    console.log('Appel API Featherless...');
    
    const response = await fetch(FEATHERLESS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.5,
        max_tokens: 300,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API:', response.status, errorText);
      
      if (response.status === 403 && errorText.includes('gated')) {
        return {
          reply: `Le modèle "${AI_MODEL}" nécessite une autorisation. Change VITE_AI_MODEL dans .env par : mistralai/Mistral-7B-Instruct-v0.3`,
          recommended_ids: []
        };
      }
      
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Réponse API reçue');

    // 5. Parser la réponse
    let aiResponse = data.choices[0].message.content.trim();
    
    // Nettoyer les commentaires potentiels
    if (aiResponse.includes('//')) {
      aiResponse = aiResponse.replace(/\/\/[^\n]*/g, '').replace(/,\s*([\]}])/g, '$1');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      console.warn('JSON invalide, extraction...');
      
      // Extraire JSON s'il y a du texte autour
      const jsonMatch = aiResponse.match(/\{[\s\S]*?"reply"[\s\S]*?"recommended_ids"[\s\S]*?\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0].replace(/\/\/[^\n]*/g, '').replace(/,\s*([\]}])/g, '$1'));
      } else {
        // Fallback : extraire IDs et texte
        const idsMatch = aiResponse.match(/"recommended_ids"[\s\S]*?\[([\d,\s]+)\]/);
        const replyMatch = aiResponse.match(/"reply"[\s:]+"([^"]+)"/);
        
        parsedResponse = {
          reply: replyMatch ? replyMatch[1] : "Voici mes recommandations !",
          recommended_ids: idsMatch ? idsMatch[1].match(/\d+/g)?.map(Number) : []
        };
      }
    }

    // 6. Filtrer les IDs valides (produits en stock uniquement)
    if (parsedResponse.recommended_ids && Array.isArray(parsedResponse.recommended_ids)) {
      parsedResponse.recommended_ids = parsedResponse.recommended_ids.filter((id: number) => {
        const product = products.find(p => p.id === id);
        return product && product.stock_level > 0;
      });
    }

    console.log('Recommandation générée:', parsedResponse);
    return parsedResponse;

  } catch (error) {
    console.error('Erreur askSportAI:', error);
    return {
      reply: "Désolé, je rencontre un problème technique. Peux-tu reformuler ?",
      recommended_ids: []
    };
  }
}

/**
 * Récupère les produits par IDs depuis products.json
 */
export async function getProductsByIds(ids: number[]) {
  if (!ids || ids.length === 0) return [];

  try {
    const products = productsData.filter(p => ids.includes(p.id));
    
    console.log(`${products.length} produits récupérés depuis backend`);
    return products;
  } catch (error) {
    console.error('Erreur getProductsByIds:', error);
    return [];
  }
}
