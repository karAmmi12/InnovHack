// src/hooks/useSportAI.js
import { useState } from 'react'
import { askSportAI, getProductsByIds } from '../lib/aiService'
import { createLogger } from '../lib/logger'

const logger = createLogger('useSportAI')

/**
 * Hook personnalisé pour gérer le chat avec l'IA et les recommandations
 * @param {string} initialWeather - Météo initiale (ex: "soleil", "pluie", "froid")
 */
export function useSportAI(initialWeather = "temps normal") {
  logger.info('🎣 Hook useSportAI initialisé avec météo:', initialWeather)
  
  const [messages, setMessages] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentWeather, setCurrentWeather] = useState(initialWeather)

  /**
   * Envoie un message à l'IA et met à jour le chat + recommandations
   * @param {string} userMessage - Message de l'utilisateur
   */
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) {
      logger.warn('Message vide ignoré')
      return
    }

    logger.info('💬 Nouveau message utilisateur:', userMessage)

    // Ajouter le message utilisateur au chat
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    logger.debug('Message utilisateur ajouté au chat')

    setIsLoading(true)
    logger.debug('État de chargement activé')

    try {
      // Appeler l'IA avec la météo actuelle
      logger.info(`🌤️ Appel IA avec météo: ${currentWeather}`)
      const aiResponse = await askSportAI(userMessage, currentWeather)

      // Ajouter la réponse de l'IA au chat
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse.reply,
        timestamp: new Date(),
        recommendedIds: aiResponse.recommended_ids
      }
      setMessages(prev => [...prev, aiMsg])
      logger.success('Réponse IA ajoutée au chat')

      // Récupérer les produits complets recommandés
      if (aiResponse.recommended_ids && aiResponse.recommended_ids.length > 0) {
        logger.info(`🛍️ Récupération de ${aiResponse.recommended_ids.length} produits recommandés`)
        const products = await getProductsByIds(aiResponse.recommended_ids)
        setRecommendedProducts(products)
        logger.success(`${products.length} produits affichés`)
      } else {
        logger.info('Aucun produit recommandé par l\'IA')
        setRecommendedProducts([])
      }

    } catch (error) {
      logger.error('💥 Erreur lors de l\'envoi du message:', error.message)
      
      // Message d'erreur de secours
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Désolé, je rencontre un problème technique. Peux-tu réessayer ?",
        timestamp: new Date(),
        recommendedIds: []
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
      logger.debug('État de chargement désactivé')
    }
  }

  /**
   * Réinitialise la conversation
   */
  const clearChat = () => {
    logger.info('🗑️ Réinitialisation du chat')
    setMessages([])
    setRecommendedProducts([])
    logger.debug('Messages et recommandations effacés')
  }

  /**
   * Met à jour la météo actuelle
   * @param {string} weather - Nouvelle condition météo
   */
  const updateWeather = (weather) => {
    logger.info(`🌤️ Changement de météo: ${currentWeather} → ${weather}`)
    setCurrentWeather(weather)
  }

  return {
    messages,
    recommendedProducts,
    isLoading,
    currentWeather,
    sendMessage,
    clearChat,
    updateWeather
  }
}
