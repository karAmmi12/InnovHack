# 🔌 Guide d'Intégration avec Lovable

## 📋 Ce qui a été mis en place

### 1. **System Prompt amélioré** ([`src/lib/aiService.js`](src/lib/aiService.js))
- ✅ Force le JSON propre sans IDs dans le texte
- ✅ Exemples clairs pour chaque météo
- ✅ Instructions strictes pour éviter les IDs dans la réponse

### 2. **Parsing JSON renforcé** ([`src/lib/aiService.js`](src/lib/aiService.js))
- ✅ 3 stratégies de parsing (direct, extraction, fallback)
- ✅ Extraction intelligente des IDs si l'IA dérape
- ✅ Logs détaillés pour debugging

### 3. **Service produits créé** ([`src/services/productService.js`](src/services/productService.js))
- ✅ API complète pour manipuler les produits
- ✅ Filtres avancés (catégorie, météo, prix, stock)
- ✅ Recherche textuelle
- ✅ Statistiques du catalogue

---

## 🔗 Comment intégrer avec Lovable

### **Option 1 : Utiliser le composant ChatBox existant**

Dans ton projet Lovable, importe directement le composant :

```jsx
import { ChatBox } from './components/ChatBox'

function App() {
  return (
    <div className="app-container">
      {/* Ton front Lovable */}
      <LovableShopGrid />
      
      {/* Chat IA intégré */}
      <ChatBox />
    </div>
  )
}
```

### **Option 2 : Utiliser le hook personnalisé**

Pour plus de contrôle sur l'UI :

```jsx
import { useSportAI } from './hooks/useSportAI'
import { productService } from './services/productService'

function LovableChat() {
  const {
    messages,
    recommendedProducts,
    isLoading,
    currentWeather,
    sendMessage,
    updateWeather
  } = useSportAI('soleil')

  return (
    <div className="lovable-chat">
      {/* Zone de chat personnalisée */}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Produits recommandés séparés */}
      <div className="recommendations">
        <h3>Nos recommandations pour toi :</h3>
        <div className="product-grid">
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Input */}
      <input 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.target.value)
            e.target.value = ''
          }
        }}
        disabled={isLoading}
      />
    </div>
  )
}
```

### **Option 3 : API REST-like pour Lovable**

Si ton front Lovable a besoin d'appels API séparés :

```jsx
import { productService } from './services/productService'
import { askSportAI } from './lib/aiService'

// Dans ton composant Lovable
function LovableShop() {
  const [products, setProducts] = useState([])
  const [recommendations, setRecommendations] = useState([])

  // Charger tous les produits pour la boutique
  useEffect(() => {
    const allProducts = productService.getAllProducts()
    setProducts(allProducts)
  }, [])

  // Recherche par catégorie
  const searchByCategory = (category) => {
    const results = productService.getByCategory(category)
    setProducts(results)
  }

  // Recherche par météo
  const searchByWeather = (weather) => {
    const results = productService.getByWeather(weather)
    setProducts(results)
  }

  // Recherche textuelle
  const handleSearch = (query) => {
    const results = productService.search(query)
    setProducts(results)
  }

  // Filtres avancés
  const advancedFilter = () => {
    const results = productService.advancedSearch({
      category: 'Running',
      weather: 'soleil',
      minPrice: 20,
      maxPrice: 100,
      inStock: true
    })
    setProducts(results)
  }

  // Demander à l'IA
  const askAI = async (question, weather) => {
    const response = await askSportAI(question, weather)
    
    // Afficher la réponse
    console.log(response.reply)
    
    // Récupérer les produits recommandés
    const recommended = productService.getByIds(response.recommended_ids)
    setRecommendations(recommended)
  }

  return (
    <div>
      {/* Grille principale Lovable */}
      <ProductGrid products={products} />
      
      {/* Recommandations IA */}
      <RecommendationsPanel products={recommendations} />
    </div>
  )
}
```

---

## 🛠️ Fonctions disponibles dans `productService`

### Récupération de base
```javascript
productService.getAllProducts()           // Tous les produits
productService.getById(5)                 // Produit par ID
productService.getByIds([1, 5, 10])       // Plusieurs produits
productService.getInStock()               // Uniquement en stock
productService.getOutOfStock()            // Ruptures de stock
```

### Filtres
```javascript
productService.getByCategory('Running')   // Par catégorie
productService.getByWeather('soleil')     // Par météo
productService.getByPriceRange(20, 50)    // Par prix
productService.search('veste')            // Recherche texte
```

### Recherche avancée
```javascript
productService.advancedSearch({
  category: 'Randonnée',
  weather: 'pluie',
  minPrice: 30,
  maxPrice: 100,
  inStock: true,
  search: 'imperméable'
})
```

### Statistiques
```javascript
const stats = productService.getStats()
// {
//   total: 26,
//   inStock: 25,
//   outOfStock: 1,
//   categories: { randonnee: 14, running: 11, velo: 1 },
//   priceRange: { min: 12, max: 150, average: 47.23 }
// }
```

---

## 🎯 Exemple complet d'intégration

```jsx
// LovableApp.jsx
import { useState, useEffect } from 'react'
import { useSportAI } from './hooks/useSportAI'
import { productService } from './services/productService'

function LovableApp() {
  // État de la boutique
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Hook IA
  const {
    messages,
    recommendedProducts,
    isLoading,
    currentWeather,
    sendMessage,
    updateWeather
  } = useSportAI('soleil')

  // Charger les produits au montage
  useEffect(() => {
    const products = productService.getAllProducts()
    setAllProducts(products)
    setFilteredProducts(products)
  }, [])

  // Filtrer par catégorie
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    if (category === 'all') {
      setFilteredProducts(allProducts)
    } else {
      const filtered = productService.getByCategory(category)
      setFilteredProducts(filtered)
    }
  }

  // Afficher les recommandations IA
  useEffect(() => {
    if (recommendedProducts.length > 0) {
      // Mettre en avant les produits recommandés dans la grille
      setFilteredProducts(recommendedProducts)
    }
  }, [recommendedProducts])

  return (
    <div className="lovable-app">
      {/* Header avec météo */}
      <header>
        <select 
          value={currentWeather} 
          onChange={(e) => updateWeather(e.target.value)}
        >
          <option value="soleil">☀️ Soleil</option>
          <option value="pluie">🌧️ Pluie</option>
          <option value="froid">❄️ Froid</option>
        </select>
      </header>

      {/* Sidebar avec catégories */}
      <aside>
        <button onClick={() => handleCategoryChange('all')}>
          Tous
        </button>
        <button onClick={() => handleCategoryChange('Randonnée')}>
          Randonnée
        </button>
        <button onClick={() => handleCategoryChange('Running')}>
          Running
        </button>
      </aside>

      {/* Grille de produits Lovable */}
      <main>
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {/* Chat IA fixe en bas à droite */}
      <div className="chat-widget">
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={msg.role}>
              {msg.content}
            </div>
          ))}
        </div>
        <input 
          placeholder="Demande conseil à l'IA..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              sendMessage(e.target.value)
              e.target.value = ''
            }
          }}
        />
      </div>
    </div>
  )
}

export default LovableApp
```

---

## 📊 Format de réponse de l'IA

L'IA retourne maintenant **proprement** :

```json
{
  "reply": "Pour courir au soleil, je te recommande le T-shirt Breath+ ultra respirant, le Short Running Performance, et la Casquette Running UV50+ pour te protéger ! 🏃☀️",
  "recommended_ids": [2, 17, 13]
}
```

**Plus d'IDs mélangés dans le texte !** 🎉

---

## 🚀 Prochaines étapes

1. **Teste l'IA** avec la nouvelle config (relance `npm run dev`)
2. **Intègre dans Lovable** avec une des 3 options ci-dessus
3. **Style le ChatBox** selon ta charte graphique Lovable

Besoin d'aide pour une intégration spécifique ? 🤝
