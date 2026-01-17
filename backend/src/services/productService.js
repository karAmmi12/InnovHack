// src/services/productService.js
// Service pour exposer les produits au front Lovable ou autre interface

import productsData from '../data/products.json'
import { createLogger } from '../lib/logger'

const logger = createLogger('ProductService')

/**
 * Service centralisé pour gérer les produits
 */
export const productService = {
  /**
   * Récupérer tous les produits
   * @returns {Array} Liste de tous les produits
   */
  getAllProducts() {
    logger.debug('Récupération de tous les produits')
    return productsData
  },

  /**
   * Récupérer un produit par son ID
   * @param {number} id - ID du produit
   * @returns {Object|null} Produit trouvé ou null
   */
  getById(id) {
    logger.debug(`Recherche du produit ID: ${id}`)
    const product = productsData.find(p => p.id === id)
    if (product) {
      logger.debug(`Produit trouvé: ${product.name}`)
    } else {
      logger.warn(`Produit ID ${id} introuvable`)
    }
    return product || null
  },

  /**
   * Récupérer plusieurs produits par leurs IDs
   * @param {number[]} ids - Liste des IDs
   * @returns {Array} Liste des produits trouvés
   */
  getByIds(ids) {
    if (!ids || ids.length === 0) {
      logger.debug('Aucun ID fourni')
      return []
    }
    
    logger.debug(`Recherche de ${ids.length} produits`)
    const products = productsData.filter(p => ids.includes(p.id))
    logger.success(`${products.length} produits trouvés`)
    return products
  },

  /**
   * Récupérer les produits par catégorie
   * @param {string} category - Catégorie (Randonnée, Running, Vélo)
   * @returns {Array} Produits de la catégorie
   */
  getByCategory(category) {
    logger.debug(`Filtrage par catégorie: ${category}`)
    const products = productsData.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    )
    logger.info(`${products.length} produits dans la catégorie ${category}`)
    return products
  },

  /**
   * Récupérer les produits adaptés à une météo
   * @param {string} weatherTag - Tag météo (soleil, pluie, froid, chaud, vent, neige)
   * @returns {Array} Produits adaptés à la météo, en stock uniquement
   */
  getByWeather(weatherTag) {
    logger.debug(`Filtrage par météo: ${weatherTag}`)
    const products = productsData.filter(p => 
      p.weather_tags.includes(weatherTag.toLowerCase()) && 
      p.stock_level > 0
    )
    logger.info(`${products.length} produits pour météo "${weatherTag}" en stock`)
    return products
  },

  /**
   * Rechercher des produits par texte
   * @param {string} query - Texte de recherche
   * @returns {Array} Produits correspondants
   */
  search(query) {
    if (!query || query.trim().length === 0) {
      logger.warn('Recherche vide')
      return []
    }

    const q = query.toLowerCase().trim()
    logger.debug(`Recherche textuelle: "${q}"`)
    
    const products = productsData.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.weather_tags.some(tag => tag.toLowerCase().includes(q))
    )
    
    logger.success(`${products.length} résultats pour "${query}"`)
    return products
  },

  /**
   * Filtrer les produits par prix
   * @param {number} minPrice - Prix minimum
   * @param {number} maxPrice - Prix maximum
   * @returns {Array} Produits dans la fourchette de prix
   */
  getByPriceRange(minPrice = 0, maxPrice = Infinity) {
    logger.debug(`Filtrage par prix: ${minPrice}€ - ${maxPrice}€`)
    const products = productsData.filter(p => 
      p.price >= minPrice && p.price <= maxPrice
    )
    logger.info(`${products.length} produits entre ${minPrice}€ et ${maxPrice}€`)
    return products
  },

  /**
   * Récupérer uniquement les produits en stock
   * @returns {Array} Produits disponibles
   */
  getInStock() {
    logger.debug('Filtrage des produits en stock')
    const products = productsData.filter(p => p.stock_level > 0)
    logger.info(`${products.length} produits en stock`)
    return products
  },

  /**
   * Récupérer les produits en rupture de stock
   * @returns {Array} Produits non disponibles
   */
  getOutOfStock() {
    logger.debug('Filtrage des ruptures de stock')
    const products = productsData.filter(p => p.stock_level <= 0)
    logger.warn(`${products.length} produits en rupture`)
    return products
  },

  /**
   * Obtenir les statistiques du catalogue
   * @returns {Object} Stats des produits
   */
  getStats() {
    const stats = {
      total: productsData.length,
      inStock: productsData.filter(p => p.stock_level > 0).length,
      outOfStock: productsData.filter(p => p.stock_level <= 0).length,
      categories: {
        randonnee: productsData.filter(p => p.category === 'Randonnée').length,
        running: productsData.filter(p => p.category === 'Running').length,
        velo: productsData.filter(p => p.category === 'Vélo').length
      },
      priceRange: {
        min: Math.min(...productsData.map(p => p.price)),
        max: Math.max(...productsData.map(p => p.price)),
        average: (productsData.reduce((sum, p) => sum + p.price, 0) / productsData.length).toFixed(2)
      }
    }
    
    logger.info('Statistiques du catalogue:', stats)
    return stats
  },

  /**
   * Recherche avancée avec plusieurs filtres
   * @param {Object} filters - Filtres à appliquer
   * @param {string} [filters.category] - Catégorie
   * @param {string} [filters.weather] - Tag météo
   * @param {number} [filters.minPrice] - Prix min
   * @param {number} [filters.maxPrice] - Prix max
   * @param {boolean} [filters.inStock] - Uniquement en stock
   * @param {string} [filters.search] - Recherche textuelle
   * @returns {Array} Produits filtrés
   */
  advancedSearch(filters = {}) {
    logger.debug('Recherche avancée avec filtres:', filters)
    
    let results = [...productsData]

    // Filtre par catégorie
    if (filters.category) {
      results = results.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      )
    }

    // Filtre par météo
    if (filters.weather) {
      results = results.filter(p => 
        p.weather_tags.includes(filters.weather.toLowerCase())
      )
    }

    // Filtre par prix
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice)
    }

    // Filtre stock
    if (filters.inStock === true) {
      results = results.filter(p => p.stock_level > 0)
    }

    // Recherche textuelle
    if (filters.search) {
      const q = filters.search.toLowerCase()
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }

    logger.success(`${results.length} résultats après filtrage`)
    return results
  }
}

// Export par défaut
export default productService
