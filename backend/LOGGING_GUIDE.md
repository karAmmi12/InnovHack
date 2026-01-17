# 📊 Guide du Système de Logging

## 🎯 Qu'est-ce qui a été ajouté ?

Un **système de logging professionnel** avec 4 niveaux de verbosité pour déboguer facilement l'application.

## 📝 Niveaux de Log

### **DEBUG** 🔍
- Le plus détaillé
- Affiche TOUT (requêtes, réponses, objets, timings)
- **Idéal pour le développement**
- Couleur : Gris

### **INFO** ℹ️
- Informations importantes
- Messages de succès, étapes principales
- **Idéal pour suivre le flow**
- Couleur : Bleu

### **WARN** ⚠️
- Avertissements non bloquants
- Problèmes potentiels (clé API manquante, produit en rupture)
- Couleur : Orange

### **ERROR** ❌
- Erreurs critiques
- Exceptions, échecs d'API
- **À surveiller en priorité**
- Couleur : Rouge

### **NONE** 🔇
- Désactive complètement les logs

## 🔧 Configuration

Dans [`.env`](.env ), ajoute :

```env
VITE_LOG_LEVEL=DEBUG  # ou INFO, WARN, ERROR, NONE
```

**Par défaut :**
- Mode dev (`npm run dev`) → **DEBUG**
- Mode production (`npm run build`) → **WARN**

## 📍 Où voir les logs ?

Ouvre la **console du navigateur** (F12 → Onglet Console)

### Exemple de sortie en mode DEBUG :

```
[14:32:15.234] [Global] [INFO] 🚀 Système de logging initialisé
[14:32:15.235] [Global] [INFO] 📊 Niveau de log actuel: DEBUG
[14:32:15.236] [Global] [INFO] 🔧 Mode: Développement
[14:32:20.102] [useSportAI] [INFO] 🎣 Hook useSportAI initialisé avec météo: soleil
[14:32:25.456] [useSportAI] [INFO] 💬 Nouveau message utilisateur: je cherche des gants
[14:32:25.460] [AIService] [INFO] 🤖 Nouvelle demande à l'IA
[14:32:25.461] [AIService] [DEBUG] Message utilisateur: je cherche des gants
[14:32:25.462] [AIService] [DEBUG] Météo actuelle: soleil
[14:32:25.463] [AIService] [DEBUG] ⏱️ Début: askSportAI
[14:32:25.465] [AIService] [DEBUG] Chargement des produits depuis JSON local...
[14:32:25.468] [AIService] [SUCCESS] 26 produits chargés
[14:32:25.470] [AIService] [INFO] 📡 Appel à l'API Featherless...
[14:32:27.892] [AIService] [SUCCESS] ✅ Réponse API reçue
[14:32:27.894] [AIService] [DEBUG] Contenu IA brut: {"reply":"Pour le soleil...","recommended_ids":[9,10]}
[14:32:27.895] [AIService] [SUCCESS] ✅ JSON parsé avec succès
[14:32:27.897] [AIService] [INFO] 2/2 produits valides après filtrage
[14:32:27.898] [AIService] [SUCCESS] 🎉 Recommandation générée avec succès
[14:32:27.900] [AIService] [DEBUG] ✅ Fin: askSportAI (2437.12ms)
```

## 🛠️ Utilisation dans ton code

### Import du logger :

```javascript
import { createLogger } from './lib/logger'

const logger = createLogger('MonComposant')
```

### Utilisation :

```javascript
// Debug - détails techniques
logger.debug('Variable value:', myVariable)

// Info - étape importante
logger.info('Chargement des données...')

// Success - opération réussie
logger.success('Données chargées!')

// Warn - attention
logger.warn('Produit en rupture de stock')

// Error - problème critique
logger.error('Échec de l\'API:', error)

// Logger un objet complet
logger.object('User data', userData)

// Mesurer le temps d'une fonction
const result = await logger.time('fetchData', async () => {
  return await fetch('/api/data')
})

// Grouper des logs
logger.group('Initialisation', () => {
  logger.debug('Étape 1')
  logger.debug('Étape 2')
})
```

## 🔍 Debugging Tips

### **Problème : L'IA ne répond pas**

1. Change le niveau à DEBUG dans [`.env`](.env )
2. Recharge l'app (`npm run dev`)
3. Ouvre la console (F12)
4. Cherche les logs `[AIService]`
5. Vérifie :
   - ✅ "26 produits chargés"
   - ✅ "Appel à l'API Featherless..."
   - ❌ "Erreur API" → Vérifie ta clé Featherless

### **Problème : Produits non recommandés**

1. Cherche `[AIService] [INFO]` avec "produits valides"
2. Si "0/2 produits valides" → Vérifie les stocks dans [`products.json`](src/data/products.json )

### **Problème : Trop de logs**

Change en mode INFO :
```env
VITE_LOG_LEVEL=INFO
```

Ou en mode WARN (production-like) :
```env
VITE_LOG_LEVEL=WARN
```

## 📊 Fichiers modifiés

- ✅ [`src/lib/logger.js`](src/lib/logger.js ) - Système de logging
- ✅ [`src/lib/aiService.js`](src/lib/aiService.js ) - Logs IA détaillés
- ✅ [`src/hooks/useSportAI.js`](src/hooks/useSportAI.js ) - Logs du hook React
- ✅ [`src/main.jsx`](src/main.jsx ) - Initialisation des logs
- ✅ [`.env`](.env ) - Variable VITE_LOG_LEVEL

## 🎯 Résumé

**Mode DEBUG** : Tout voir (dev)  
**Mode INFO** : Essentiel seulement  
**Mode WARN** : Alertes uniquement  
**Mode ERROR** : Erreurs critiques seulement  
**Mode NONE** : Silence total  

---

**Bon debugging ! 🐛🔍**
