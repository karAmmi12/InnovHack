# 🏗️ Architecture du Projet SportContext AI

## 📦 Structure du Code

```
InnovHack/
├── src/
│   ├── lib/
│   │   └── aiService.ts          ← 🤖 SERVICE IA PRINCIPAL (Featherless)
│   ├── components/
│   │   ├── ChatInterface.tsx     ← 💬 Interface chat avec appels IA
│   │   ├── ProductsPanel.tsx     ← 🛍️ Panneau recommandations
│   │   └── ...
│   ├── pages/
│   │   ├── Landing.tsx           ← 🏠 Page d'accueil e-commerce
│   │   └── Chat.tsx              ← 💬 Page chat full-screen
│   └── integrations/
│       └── supabase/
│           └── client.ts         ← 🗄️ Connexion Supabase
├── supabase/
│   └── migrations/               ← 📊 Schéma BDD + données
├── .env.local                    ← 🔑 CREDENTIALS (Supabase + Featherless)
└── backend/                      ← ⚠️ ANCIEN CODE (peut être supprimé)
```

---

## 🔄 Flux de Données

### 1️⃣ Utilisateur envoie un message

```
User: "Je prévois une randonnée sous la pluie"
  ↓
ChatInterface.tsx (processMessage)
```

### 2️⃣ Détection du contexte météo

```javascript
// Extrait de ChatInterface.tsx
const detectedWeather = lowerInput.includes('pluie') ? 'pluie' : 'temps normal';
```

### 3️⃣ Appel au service IA

```typescript
// aiService.ts
export async function askSportAI(userMessage, currentWeather) {
  // 1. Charger tous les produits depuis Supabase
  const { data: products } = await supabase.from('products').select('*');
  
  // 2. Formater pour le System Prompt
  const productsText = formatProductsForAI(products);
  
  // 3. Construire le prompt avec règles strictes
  const systemPrompt = buildSystemPrompt(productsText, currentWeather);
  
  // 4. Appeler Featherless API
  const response = await fetch(FEATHERLESS_API_URL, {
    body: JSON.stringify({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      response_format: { type: "json_object" }
    })
  });
  
  // 5. Parser et nettoyer la réponse JSON
  let parsed = JSON.parse(aiResponse);
  
  // 6. Filtrer les IDs (uniquement produits en stock)
  parsed.recommended_ids = parsed.recommended_ids.filter(id => {
    const product = products.find(p => p.id === id && p.stock_level > 0);
    return !!product;
  });
  
  return parsed; // { reply: "...", recommended_ids: [1, 3] }
}
```

### 4️⃣ Affichage des résultats

```
aiResponse { reply, recommended_ids }
  ↓
ChatInterface: Affiche le message IA
  ↓
getProductsByIds(recommended_ids)
  ↓
ProductsPanel: Affiche les cartes produits
```

---

## 🧠 Le System Prompt

### Ce qui est envoyé à l'IA

```
Tu es un conseiller sportif expert. RÉPONDS UNIQUEMENT EN JSON STRICT.

RÈGLES :
1. Recommande UNIQUEMENT des produits du catalogue ci-dessous
2. PAS de produits en RUPTURE (⚠️)
3. Météo actuelle : "pluie"
4. Maximum 4 produits recommandés

CATALOGUE DISPONIBLE :
ID: 1 | Veste Gore-Tex MT500 | 289.99€ | Tags: Pluie, Froid | Stock: 12
ID: 2 | T-shirt Breath+ | 25€ | Tags: Soleil | Stock: 40
...

FORMAT OBLIGATOIRE :
{"reply":"Ta réponse avec NOMS produits","recommended_ids":[1,2]}
```

### Pourquoi JSON strict ?

- ✅ Parsable automatiquement
- ✅ Structure prévisible
- ✅ IDs exploitables directement
- ✅ Pas de hallucinations de produits

---

## 🛡️ Mécanismes de Robustesse

### 1. Mode Démo (sans Featherless)

```typescript
if (!FEATHERLESS_API_KEY) {
  return {
    reply: "⚠️ Mode démo (configure VITE_FEATHERLESS_API_KEY)",
    recommended_ids: [1] // Recommandation basique
  };
}
```

### 2. Parsing JSON avec fallback

```typescript
try {
  parsedResponse = JSON.parse(aiResponse);
} catch (e) {
  // Fallback : extraire IDs manuellement
  const idsMatch = aiResponse.match(/"recommended_ids"\s*:\s*\[([\d,\s]+)\]/);
  const ids = idsMatch[1].match(/\d+/g).map(Number);
  parsedResponse = { reply: "...", recommended_ids: ids };
}
```

### 3. Nettoyage des commentaires

```typescript
// L'IA peut ajouter des commentaires (//) malgré les instructions
aiResponse = aiResponse.replace(/\/\/[^\n]*/g, '');
```

### 4. Filtrage des produits invalides

```typescript
// Ne garder que les produits existants et en stock
validIds = recommended_ids.filter(id => {
  const product = products.find(p => p.id === id);
  return product && product.stock_level > 0;
});
```

---

## 📝 Variables d'Environnement

### `.env.local` (obligatoire)

```env
# Supabase
VITE_SUPABASE_URL=https://bqnisykluyuepjityjfc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...

# Featherless AI
VITE_FEATHERLESS_API_KEY=your_key_here

# Modèle (optionnel)
VITE_AI_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

### Modèles testés

✅ **Recommandé** : `mistralai/Mistral-7B-Instruct-v0.3`
- Rapide, gratuit, bon respect du JSON

✅ **Alternative** : `Qwen/Qwen2.5-7B-Instruct`
- Très bon, mais peut nécessiter auth HuggingFace

❌ **À éviter** : Modèles "gated" (nécessitent autorisation)

---

## 🔧 Optimisations Possibles

### 1. Cache des produits

```typescript
let cachedProducts = null;
let cacheTimestamp = 0;

export async function askSportAI(userMessage, weather) {
  // Rafraîchir le cache toutes les 5 minutes
  if (!cachedProducts || Date.now() - cacheTimestamp > 300000) {
    cachedProducts = await supabase.from('products').select('*');
    cacheTimestamp = Date.now();
  }
  
  const products = cachedProducts;
  // ...
}
```

### 2. Streaming des réponses

```typescript
// Afficher la réponse mot par mot (si Featherless supporte le streaming)
const response = await fetch(FEATHERLESS_API_URL, {
  body: JSON.stringify({ ...params, stream: true })
});

const reader = response.body.getReader();
// Lire chunk par chunk et mettre à jour l'UI
```

### 3. Historique de conversation

```typescript
const conversationHistory = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: 'Premier message' },
  { role: 'assistant', content: 'Réponse IA' },
  { role: 'user', content: 'Deuxième message' }, // ← Nouveau
];
```

---

## 🧪 Tests Recommandés

### Scénarios à tester

1. **Pluie + Randonnée**
   - Message : "Je pars en rando sous la pluie"
   - Attendu : Veste Gore-Tex, Pantalon imperméable

2. **Soleil + Running**
   - Message : "Je vais courir au soleil"
   - Attendu : T-shirt Breath+, Casquette UV

3. **Budget limité**
   - Message : "Je cherche des équipements pas chers"
   - Attendu : Produits < 50€

4. **Sans clé Featherless**
   - Supprimer `VITE_FEATHERLESS_API_KEY`
   - Attendu : Mode démo activé

### Vérifications

- ✅ L'IA respecte le format JSON
- ✅ Les IDs recommandés existent dans Supabase
- ✅ Aucun produit en rupture de stock
- ✅ Les noms de produits apparaissent dans `reply`
- ✅ Maximum 4 produits recommandés

---

## 🚨 Erreurs Communes

### "Page blanche"
**Cause** : Variables Supabase manquantes
**Solution** : Remplir `.env.local` et redémarrer

### "Mode démo" affiché
**Cause** : Clé Featherless manquante
**Solution** : Ajouter `VITE_FEATHERLESS_API_KEY`

### "403 gated model"
**Cause** : Modèle nécessite autorisation HuggingFace
**Solution** : Changer pour `mistralai/Mistral-7B-Instruct-v0.3`

### IDs invalides recommandés
**Cause** : L'IA hallucine des produits
**Solution** : Le filtrage automatique supprime les IDs invalides

---

## 📚 Ressources

- **Featherless AI** : https://featherless.ai/
- **Supabase** : https://supabase.com/
- **Mistral 7B** : https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3
- **Guide complet** : Voir `QUICKSTART.md`

---

**Créé le 17 janvier 2026 pour InnovHack** 🚀
