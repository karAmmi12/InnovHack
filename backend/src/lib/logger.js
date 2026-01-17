// src/lib/logger.js
// Système de logging avec niveaux debug, info, warn, error

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
}

// Configuration du niveau de log via variable d'environnement
// Par défaut : INFO en dev, WARN en production
const getLogLevel = () => {
  const envLevel = import.meta.env.VITE_LOG_LEVEL?.toUpperCase()
  
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return LOG_LEVELS[envLevel]
  }
  
  // Par défaut : DEBUG en mode dev
  return import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN
}

const currentLogLevel = getLogLevel()

// Styles pour la console
const styles = {
  debug: 'color: #9CA3AF; font-weight: normal',
  info: 'color: #3B82F6; font-weight: bold',
  warn: 'color: #F59E0B; font-weight: bold',
  error: 'color: #EF4444; font-weight: bold',
  success: 'color: #10B981; font-weight: bold'
}

// Formater le timestamp
const getTimestamp = () => {
  const now = new Date()
  return now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    fractionalSecondDigits: 3
  })
}

// Fonction pour créer un logger avec contexte
class Logger {
  constructor(context = 'App') {
    this.context = context
  }

  _log(level, levelName, style, ...args) {
    if (level < currentLogLevel) return

    const timestamp = getTimestamp()
    const prefix = `[${timestamp}] [${this.context}] [${levelName}]`
    
    console.log(`%c${prefix}`, style, ...args)
  }

  /**
   * Log de niveau DEBUG - Détails techniques pour le débogage
   * @param {...any} args - Messages et objets à logger
   */
  debug(...args) {
    this._log(LOG_LEVELS.DEBUG, 'DEBUG', styles.debug, ...args)
  }

  /**
   * Log de niveau INFO - Informations générales
   * @param {...any} args - Messages et objets à logger
   */
  info(...args) {
    this._log(LOG_LEVELS.INFO, 'INFO', styles.info, ...args)
  }

  /**
   * Log de niveau WARN - Avertissements
   * @param {...any} args - Messages et objets à logger
   */
  warn(...args) {
    this._log(LOG_LEVELS.WARN, 'WARN', styles.warn, ...args)
  }

  /**
   * Log de niveau ERROR - Erreurs critiques
   * @param {...any} args - Messages et objets à logger
   */
  error(...args) {
    this._log(LOG_LEVELS.ERROR, 'ERROR', styles.error, ...args)
  }

  /**
   * Log de succès (niveau INFO avec couleur verte)
   * @param {...any} args - Messages et objets à logger
   */
  success(...args) {
    if (LOG_LEVELS.INFO < currentLogLevel) return
    
    const timestamp = getTimestamp()
    const prefix = `[${timestamp}] [${this.context}] [SUCCESS]`
    console.log(`%c${prefix}`, styles.success, ...args)
  }

  /**
   * Grouper des logs ensemble (utile pour tracer un flux)
   * @param {string} label - Label du groupe
   * @param {Function} callback - Fonction contenant les logs à grouper
   */
  group(label, callback) {
    if (LOG_LEVELS.DEBUG >= currentLogLevel) {
      console.group(`🔍 ${this.context} - ${label}`)
      callback()
      console.groupEnd()
    }
  }

  /**
   * Logger un objet de manière formatée
   * @param {string} label - Label de l'objet
   * @param {any} obj - Objet à logger
   */
  object(label, obj) {
    if (LOG_LEVELS.DEBUG >= currentLogLevel) {
      console.log(`%c[${this.context}] ${label}:`, styles.debug)
      console.dir(obj, { depth: 3 })
    }
  }

  /**
   * Mesurer le temps d'exécution d'une fonction
   * @param {string} label - Label de la mesure
   * @param {Function} fn - Fonction à mesurer
   * @returns {Promise|any} - Résultat de la fonction
   */
  async time(label, fn) {
    const startTime = performance.now()
    this.debug(`⏱️ Début: ${label}`)
    
    try {
      const result = await fn()
      const duration = (performance.now() - startTime).toFixed(2)
      this.debug(`✅ Fin: ${label} (${duration}ms)`)
      return result
    } catch (error) {
      const duration = (performance.now() - startTime).toFixed(2)
      this.error(`❌ Erreur: ${label} (${duration}ms)`, error)
      throw error
    }
  }
}

// Factory pour créer des loggers avec contexte
export function createLogger(context) {
  return new Logger(context)
}

// Logger par défaut
export const logger = new Logger('Global')

// Utilitaires pour afficher l'état du système
export const logSystemInfo = () => {
  const level = Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === currentLogLevel)
  logger.info('🚀 Système de logging initialisé')
  logger.info(`📊 Niveau de log actuel: ${level}`)
  logger.info(`🔧 Mode: ${import.meta.env.DEV ? 'Développement' : 'Production'}`)
}

// Export des niveaux pour référence
export { LOG_LEVELS }
