// src/lib/aiService.js
import productsData from '../data/products.json'
import { createLogger } from './logger'

const logger = createLogger('AIService')

const FEATHERLESS_API_URL = 'https://api.featherless.ai/v1/chat/completions'
const FEATHERLESS_API_KEY = import.meta.env.VITE_FEATHERLESS_API_KEY
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3'

/**
 * Formate les produits pour le System Prompt de l'IA
 * @param {Array} products - Liste des produits depuis Supabase
 * @returns {string} - Chaîne formatée pour le LLM
 */
function formatProductsForAI(products) {
  logger.debug(`Formatage de ${products?.length || 0} produits pour l'IA`)
  
  if (!products || products.length === 0) {
    logger.warn('Aucun produit disponible pour le formatage')
    return "Aucun produit disponible dans la base de données."
  }

  const productList = products.map(p => {
    const stockStatus = p.stock_level <= 0 ? "⚠️ RUPTURE DE STOCK" : `En stock: ${p.stock_level}`
    const tags = Array.isArray(p.weather_tags) ? p.weather_tags.join(', ') : 'Aucun tag'
    
    return `ID: ${p.id} | ${p.name} | ${p.price}€ | Tags: ${tags} | ${stockStatus}`
  }).join('\n')

  logger.debug('Produits formatés avec succès')
  return `CATALOGUE PRODUITS DISPONIBLES :\n${productList}`
}

/**
 * Génère le System Prompt strict pour l'IA
 * @param {string} productsText - Texte formaté des produits
 * @param {string} weather - Condition météo actuelle
 * @returns {string} - System prompt complet
 */
function buildSystemPrompt(productsText, weather) {
  logger.debug(`Construction du System Prompt avec météo: ${weather}`)
  
  return `Tu es un conseiller sportif expert. RÉPONDS UNIQUEMENT EN JSON STRICT.

RÈGLES :
1. Recommande UNIQUEMENT des produits du catalogue ci-dessous
2. PAS de produits en RUPTURE DE STOCK (⚠️)
3. Météo actuelle : "${weather}"
4. Ne mentionne JAMAIS les IDs dans le texte, seulement dans recommended_ids
5. Maximum 4 produits recommandés
6. Utilise les NOMS des produits dans ta réponse, pas les numéros
7. INTERDIT : Pas de commentaires (//) dans le JSON, pas de texte avant ou après

${productsText}

FORMAT OBLIGATOIRE (copie exactement, sans commentaires) :
{
  "reply": "Ta réponse courte et sympathique avec les NOMS des produits",
  "recommended_ids": [1, 2, 3]
}

EXEMPLES CORRECTS :

Soleil + Running :
{"reply":"Pour courir au soleil, je te recommande le T-shirt Breath+ ultra respirant, le Short Running Performance, et la Casquette Running UV50+ !","recommended_ids":[2,17,13]}

Pluie :
{"reply":"Sous la pluie, prends la Veste Gore-Tex MT500 imperméable et les Gants Imperméables Trek. Tu seras au sec !","recommended_ids":[1,11]}

Budget limité :
{"reply":"Pour un petit budget, je te conseille le Bandeau Running Hiver (12€), les Gants Running Tactiles (18€) et le Short de Trail (35€). Total : 65€ !","recommended_ids":[14,10,4]}

Froid :
{"reply":"Par temps froid, la Doudoune Trail Compacte, le Bonnet Thermique Pro et les Gants Polaire Mountain te garderont au chaud !","recommended_ids":[21,12,9]}

IMPORTANT : 
- Réponds UNIQUEMENT avec le JSON compact
- AUCUN commentaire (//), AUCUN texte explicatif
- Format compact sur une ligne
- Teste mentalement que ton JSON est valide avant de répondre`
}

/**
 * Appelle l'API Featherless pour obtenir une recommandation
 * @param {string} userMessage - Message de l'utilisateur
 * @param {string} currentWeather - Météo actuelle (ex: "pluie", "soleil", "froid")
 * @returns {Promise<{reply: string, recommended_ids: number[]}>}
 */
export async function askSportAI(userMessage, currentWeather = "temps normal") {
  logger.info('🤖 Nouvelle demande à l\'IA')
  logger.debug('Message utilisateur:', userMessage)
  logger.debug('Météo actuelle:', currentWeather)
  
  return logger.time('askSportAI', async () => {
    try {
      // 1. Récupérer tous les produits depuis le fichier JSON local
      logger.debug('Chargement des produits depuis JSON local...')
      const products = productsData

      if (!products || products.length === 0) {
        logger.error('Aucun produit disponible dans products.json')
        throw new Error('Aucun produit disponible')
      }
      
      logger.success(`${products.length} produits chargés`)

      // 2. Formater les produits pour l'IA
      const productsText = formatProductsForAI(products)
      const systemPrompt = buildSystemPrompt(productsText, currentWeather)
      
      logger.debug('System Prompt construit:', systemPrompt.substring(0, 200) + '...')

      // 3. Appeler l'API Featherless
      logger.info('📡 Appel à l\'API Featherless...')
      logger.debug(`Modèle utilisé: ${AI_MODEL}`)
      
      if (!FEATHERLESS_API_KEY || FEATHERLESS_API_KEY === 'ta_cle_featherless_ici') {
        logger.warn('⚠️ Clé API Featherless non configurée - Mode dégradé activé')
        return {
          reply: "⚠️ Mode démo : L'IA n'est pas configurée. Remplis VITE_FEATHERLESS_API_KEY dans .env pour activer les recommandations intelligentes.",
          recommended_ids: []
        }
      }
      
      const requestBody = {
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.5, // Réduit pour plus de cohérence
        max_tokens: 300,  // Réduit pour forcer des réponses concises
        response_format: { type: "json_object" } // Force le mode JSON si supporté
      }
      
      logger.debug('Requête API:', requestBody)
      
      const response = await fetch(FEATHERLESS_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        logger.error('❌ Erreur API Featherless:', response.status, errorText.substring(0, 200))
        
        // Gestion spécifique de l'erreur 403 (modèle gated)
        if (response.status === 403 && errorText.includes('gated')) {
          logger.warn('💡 Le modèle est protégé. Essaie un modèle non-gated dans .env')
          return {
            reply: `⚠️ Le modèle "${AI_MODEL}" nécessite une autorisation HuggingFace.\n\nSolution rapide : Change VITE_AI_MODEL dans .env par :\n- mistralai/Mistral-7B-Instruct-v0.3 (recommandé)\n- Qwen/Qwen2.5-7B-Instruct\n\nPuis relance l'app.`,
            recommended_ids: []
          }
        }
        
        throw new Error(`Erreur API: ${response.status}`)
      }

      const data = await response.json()
      logger.success('✅ Réponse API reçue')
      logger.debug('Réponse complète:', data)
      
      // 4. Parser la réponse de l'IA
      let aiResponse = data.choices[0].message.content.trim()
      logger.debug('Contenu IA brut:', aiResponse)
      
      // Nettoyer les commentaires JavaScript si présents
      if (aiResponse.includes('//')) {
        logger.warn('⚠️ Commentaires détectés dans le JSON, nettoyage...')
        // Supprimer les commentaires // jusqu'à la fin de ligne
        aiResponse = aiResponse.replace(/\/\/[^\n]*/g, '')
        // Supprimer les virgules en trop après nettoyage
        aiResponse = aiResponse.replace(/,\s*([\]}])/g, '$1')
        logger.debug('JSON nettoyé:', aiResponse)
      }
      
      // Tenter de parser le JSON avec plusieurs stratégies
      let parsedResponse
      try {
        // Stratégie 1: Parser directement
        parsedResponse = JSON.parse(aiResponse)
        logger.success('✅ JSON parsé directement')
      } catch (directError) {
        logger.debug('Parsing direct échoué, tentative d\'extraction...')
        try {
          // Stratégie 2: Extraire le JSON s'il y a du texte avant/après
          const jsonMatch = aiResponse.match(/\{[\s\S]*?"reply"[\s\S]*?"recommended_ids"[\s\S]*?\}/)
          if (jsonMatch) {
            let extracted = jsonMatch[0]
            // Nettoyer à nouveau les commentaires dans l'extrait
            extracted = extracted.replace(/\/\/[^\n]*/g, '')
            extracted = extracted.replace(/,\s*([\]}])/g, '$1')
            
            parsedResponse = JSON.parse(extracted)
            logger.success('✅ JSON extrait et parsé')
          } else {
            throw new Error('Pas de structure JSON valide trouvée')
          }
        } catch (extractError) {
          logger.warn('⚠️ L\'IA n\'a pas retourné de JSON valide')
          logger.debug('Erreur de parsing:', extractError.message)
          logger.debug('Contenu reçu:', aiResponse.substring(0, 500))
          
          // Fallback : Créer une structure propre avec extraction intelligente des IDs
          const idsMatch = aiResponse.match(/"recommended_ids"[\s\S]*?\[([\d,\s]+)\]/)
          let extractedIds = []
          
          if (idsMatch) {
            // Extraire les chiffres du tableau
            extractedIds = idsMatch[1].match(/\d+/g).map(Number).slice(0, 4)
            logger.info(`IDs extraits du JSON cassé: ${extractedIds}`)
          } else {
            // Chercher des IDs isolés dans le texte
            const allIds = aiResponse.match(/\b[1-9]\d?\b/g)
            if (allIds) {
              extractedIds = allIds.map(Number).filter(id => id <= 26).slice(0, 4)
              logger.info(`IDs extraits par heuristique: ${extractedIds}`)
            }
          }
          
          // Extraire la partie "reply" si possible
          const replyMatch = aiResponse.match(/"reply"[\s:]+"([^"]+)"/)
          const replyText = replyMatch ? replyMatch[1] : aiResponse.substring(0, 300).replace(/[{}\[\]]/g, '').trim()
          
          parsedResponse = {
            reply: replyText || "Voici mes recommandations pour toi ! Jette un œil aux produits ci-dessous.",
            recommended_ids: extractedIds
          }
          logger.info(`Fallback activé avec ${extractedIds.length} IDs extraits`)
        }
      }
      
      logger.object('Réponse parsée', parsedResponse)

      // 5. Valider et filtrer les IDs (ne garder que les produits en stock)
      if (parsedResponse.recommended_ids && Array.isArray(parsedResponse.recommended_ids)) {
        const originalIds = [...parsedResponse.recommended_ids]
        logger.debug('IDs recommandés par l\'IA:', originalIds)
        
        const validIds = parsedResponse.recommended_ids.filter(id => {
          const product = products.find(p => p.id === id)
          const isValid = product && product.stock_level > 0
          
          if (!product) {
            logger.warn(`ID ${id} inexistant dans le catalogue`)
          } else if (product.stock_level <= 0) {
            logger.warn(`Produit ${id} (${product.name}) filtré: rupture de stock`)
          }
          
          return isValid
        })
        
        parsedResponse.recommended_ids = validIds
        logger.info(`${validIds.length}/${originalIds.length} produits valides après filtrage`)
      } else {
        parsedResponse.recommended_ids = []
      }

      logger.success('🎉 Recommandation générée avec succès')
      return parsedResponse

    } catch (error) {
      logger.error('💥 Erreur dans askSportAI:', error.message)
      logger.error('Stack trace:', error.stack)
      
      return {
        reply: "Désolé, je rencontre un problème technique. Peux-tu reformuler ta demande ?",
        recommended_ids: []
      }
    }
  })
}

/**
 * Récupère les produits complets à partir d'une liste d'IDs
 * @param {number[]} ids - Liste des IDs de produits
 * @returns {Promise<Array>} - Produits correspondants
 */
export async function getProductsByIds(ids) {
  logger.debug(`Récupération de ${ids?.length || 0} produits par IDs`)
  
  if (!ids || ids.length === 0) {
    logger.debug('Aucun ID fourni, retour tableau vide')
    return []
  }

  try {
    // Filtrer les produits depuis le JSON local
    const products = productsData.filter(p => ids.includes(p.id))
    
    logger.success(`${products.length} produits récupérés`)
    logger.debug('Produits:', products.map(p => `${p.id}: ${p.name}`).join(', '))
    
    return products
  } catch (error) {
    logger.error('Erreur getProductsByIds:', error.message)
    return []
  }
}
