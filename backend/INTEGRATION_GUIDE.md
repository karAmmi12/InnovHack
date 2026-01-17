# 🏃 Personal Shopper IA - Guide d'intégration

## 📦 Installation des dépendances

```bash
npm install @supabase/supabase-js
```

## 🔧 Configuration

### 1. Variables d'environnement (.env)

Remplis ton fichier `.env` avec tes vraies clés :

```env
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_FEATHERLESS_API_KEY=votre_cle_featherless
```

**Où trouver les clés ?**
- **Supabase** : Dashboard > Settings > API
- **Featherless** : https://featherless.ai/dashboard

### 2. Structure créée

```
src/
├── lib/
│   ├── supabaseClient.js    # Client Supabase
│   └── aiService.js          # Service IA avec logique métier
├── hooks/
│   └── useSportAI.js         # Hook React pour le chat
└── components/
    └── ChatBox.jsx           # Composant UI complet
```

## 🚀 Utilisation dans ton App.jsx

### Option 1 : Utiliser le composant ChatBox complet

```jsx
import { ChatBox } from './components/ChatBox'

function App() {
  return <ChatBox />
}

export default App
```

### Option 2 : Utiliser le hook personnalisé

```jsx
import { useSportAI } from './hooks/useSportAI'

function MyCustomChat() {
  const {
    messages,
    recommendedProducts,
    isLoading,
    currentWeather,
    sendMessage,
    updateWeather
  } = useSportAI('soleil') // Météo initiale

  return (
    <div>
      {/* Ton UI personnalisée */}
      <button onClick={() => updateWeather('pluie')}>
        Changer météo
      </button>
      
      {messages.map(msg => (
        <div key={msg.id}>
          {msg.role}: {msg.content}
        </div>
      ))}
      
      <input 
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.target.value)
            e.target.value = ''
          }
        }}
      />
      
      {/* Afficher les produits recommandés */}
      <div>
        {recommendedProducts.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.price}€</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Option 3 : Appeler directement le service IA

```jsx
import { askSportAI } from './lib/aiService'

async function handleQuestion() {
  const response = await askSportAI(
    "Je cherche des chaussures de trail", 
    "pluie"
  )
  
  console.log(response.reply) // Réponse textuelle
  console.log(response.recommended_ids) // [5, 7, 12]
}
```

## 🧠 Logique du Service IA

Le service `aiService.js` fait 5 choses critiques :

1. **Récupère** tous les produits depuis Supabase
2. **Formate** les produits en texte lisible pour le LLM
3. **Injecte** un System Prompt strict qui :
   - Oblige l'IA à ne recommander QUE des produits existants
   - Prend en compte la météo
   - Gère les ruptures de stock
   - Force un format JSON de sortie
4. **Appelle** l'API Featherless (compatible OpenAI)
5. **Valide** les IDs retournés (filtre les ruptures de stock)

## 📋 Format de réponse de l'IA

```json
{
  "reply": "Vu qu'il pleut, je te recommande la veste Gore-Tex imperméable !",
  "recommended_ids": [1, 5, 11]
}
```

## 🛡️ Sécurité implémentée

✅ L'IA ne peut PAS inventer de produits (System Prompt strict)  
✅ Les produits en rupture de stock sont filtrés automatiquement  
✅ Fallback si l'IA ne retourne pas du JSON valide  
✅ Gestion d'erreur complète (API, parsing, DB)

## 🎨 Personnalisation du ChatBox

Le composant `ChatBox.jsx` utilise des styles inline. Pour utiliser Tailwind ou ton CSS :

1. Remplace les `style={styles.xxx}` par `className="ton-class"`
2. Ou garde les styles inline et personnalise l'objet `styles` en bas du fichier

## 🔍 Debugging

Si l'IA ne répond pas :

```javascript
// Dans aiService.js, décommente les console.log
console.log('System Prompt:', systemPrompt)
console.log('Réponse brute API:', aiResponse)
```

## 📱 Exemple de messages de test

- "Je cherche une tenue pour courir sous la pluie"
- "Qu'est-ce que tu me conseilles pour un trail en montagne ?"
- "J'ai un budget de 50€, montre-moi des gants"
- "Il fait super chaud, je veux un short"

## 🚨 Points d'attention

1. **Toujours** remplir le `.env` avec les vraies clés
2. **Créer** la table `products` sur Supabase (voir database.sql)
3. **Installer** `@supabase/supabase-js` via npm
4. Le modèle Llama-3-8B peut être lent (2-5 secondes de réponse)

## 💡 Prochaines évolutions possibles

- [ ] Ajouter un historique de conversation persistant
- [ ] Filtrer par budget/catégorie
- [ ] Gérer plusieurs langues
- [ ] Ajouter des images de produits dynamiques
- [ ] Intégrer une vraie API météo (OpenWeatherMap)
