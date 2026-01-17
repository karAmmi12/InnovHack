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
  return `Tu es Verronik, conseiller sportif expert pour un site e-commerce. RÉPONDS UNIQUEMENT EN JSON STRICT.

⚠️ CONTEXTE ACTUEL DÉTECTÉ (UTILISE-LE OBLIGATOIREMENT) :
- 📍 Localisation de l'utilisateur : "${location}"
- 🌧️ Météo prévue : "${weather}"

RÈGLES STRICTES :
1. Tu DOIS adapter tes recommandations à la météo "${weather}" - c'est OBLIGATOIRE
2. Si météo = "pluie" → recommande UNIQUEMENT des produits imperméables/pluie
3. Si météo = "froid" → recommande UNIQUEMENT des produits thermiques/chauds
4. Si météo = "soleil" → recommande UNIQUEMENT des produits légers/respirants
5. Recommande UNIQUEMENT des produits du catalogue ci-dessous avec stock > 0
6. Ne mentionne JAMAIS les IDs dans le texte de réponse
7. Maximum 4 produits recommandés
8. Utilise les NOMS EXACTS des produits

${productsText}

FORMAT JSON OBLIGATOIRE (rien d'autre) :
{"reply":"Réponse adaptée à ${weather} à ${location}","recommended_ids":[id1,id2]}

EXEMPLE pour météo="${weather}" :
{"reply":"Vu la ${weather} prévue à ${location}, je te recommande [produits adaptés à ${weather}]...","recommended_ids":[...]}`;
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
    
    console.log('📋 Contexte envoyé à l\'IA - Météo:', currentWeather, '| Position:', location);

    // 3. Vérifier la clé API
    if (!FEATHERLESS_API_KEY || FEATHERLESS_API_KEY === 'ta_cle_featherless_ici') {
      console.warn('Clé Featherless non configurée - Mode démo intelligent');
      
      // Mode démo : recommandations parfaites basées sur la météo détectée
      const weatherProducts: Record<string, { ids: number[], reply: string }> = {
        'pluie': { 
          ids: [1, 5, 7, 19], // Veste Imperméable Pro, Coupe-vent, Trail GTX, Pantalon Imperméable
          reply: `🌧️ Vu la **pluie prévue à ${location}**, voici ma sélection pour courir au sec :\n\n• **Veste Running Imperméable Pro** (89€) - membrane respirante, capuche ajustable\n• **Coupe-vent Running Ultra** (59€) - ultra-léger, se range dans ta poche\n• **Chaussures Running Trail GTX** (145€) - Gore-Tex, accroche terrain humide\n\n💡 Avec cet équipement, la pluie ne sera plus un obstacle !`
        },
        'soleil': { 
          ids: [2, 3, 11, 18], // T-shirt Breath+, Short Performance, Casquette UV, Ceinture Bidon
          reply: `☀️ Superbe journée ensoleillée à **${location}** ! Voici l'équipement idéal :\n\n• **T-shirt Running Breath+** (29€) - ultra respirant, anti-odeur\n• **Short Running Performance** (35€) - séchage rapide, poches zippées\n• **Casquette Running UV50+** (25€) - protection solaire maximale\n• **Ceinture Porte-Bidon** (28€) - hydratation indispensable !\n\n💡 Pense à bien t'hydrater avec cette chaleur !`
        },
        'froid': { 
          ids: [4, 15, 9, 20], // Collant Thermique, Veste Thermique, Gants Tactiles, Bonnet
          reply: `🥶 Il fait **froid à ${location}** ! Voici de quoi rester au chaud :\n\n• **Collant Running Thermique** (55€) - isolation et compression\n• **Veste Thermique Running** (79€) - coupe-vent, réfléchissante\n• **Gants Running Tactiles** (22€) - compatibles smartphone\n• **Bonnet Running Thermique** (19€) - polaire évacuant l'humidité\n\n💡 Le système multicouche te gardera au chaud sans surchauffer !`
        },
        'vent': { 
          ids: [5, 10, 13, 14], // Coupe-vent Ultra, Bandeau Hiver, Buff, Chaussettes
          reply: `💨 Journée **venteuse à ${location}** ! Voici ma sélection coupe-vent :\n\n• **Coupe-vent Running Ultra** (59€) - ultra-léger 90g, compactable\n• **Bandeau Running Hiver** (15€) - protège les oreilles du vent\n• **Buff Multi-usage** (18€) - tour de cou polyvalent\n\n💡 Le vent peut vite refroidir, protège tes extrémités !`
        }
      };
      
      const weatherKey = currentWeather.toLowerCase();
      const recommendation = weatherProducts[weatherKey] || weatherProducts['pluie'];
      
      return {
        reply: recommendation.reply,
        recommended_ids: recommendation.ids
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
