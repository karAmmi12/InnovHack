# 🔗 Solution d'Intégration Backend + Frontend

## 🎯 Architecture proposée

Au lieu de dupliquer le code, nous allons utiliser le backend comme **service API local** :

```
Frontend (Lovable - Port 8080)
    ↓
Backend (React/Vite - Port 5173)
    ↓
Featherless AI + products.json
```

---

## 🚀 Méthode 1 : Backend comme service séparé (RECOMMANDÉ)

### Avantages
✅ Pas de duplication de code
✅ Backend testé et fonctionnel
✅ Séparation claire des responsabilités
✅ Le frontend appelle simplement l'API du backend

### Configuration

#### 1. Démarrer le backend (terminal 1)
```bash
cd backend
npm install
npm run dev
```
Le backend tourne sur **http://localhost:5173**

#### 2. Créer un proxy dans le frontend

Ajoute dans `vite.config.ts` du frontend :
```typescript
export default defineConfig({
  // ... config existante
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

#### 3. Adapter le service IA frontend pour appeler le backend

Remplace le contenu de `src/lib/aiService.ts` par :

```typescript
// Service qui appelle le backend React/Vite
const BACKEND_URL = 'http://localhost:5173';

export async function askSportAI(userMessage: string, currentWeather = "temps normal") {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, weather: currentWeather })
    });

    if (!response.ok) throw new Error('Backend error');
    
    const data = await response.json();
    return data; // { reply, recommended_ids }
  } catch (error) {
    console.error('Erreur backend:', error);
    return {
      reply: "Désolé, le backend n'est pas disponible.",
      recommended_ids: []
    };
  }
}

export async function getProductsByIds(ids: number[]) {
  try {
    const response = await fetch(`${BACKEND_URL}/products?ids=${ids.join(',')}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur produits:', error);
    return [];
  }
}
```

---

## 🚀 Méthode 2 : Créer des endpoints dans le backend

Le backend de votre collaborateur doit exposer des endpoints REST :

### À ajouter dans `backend/src/main.jsx` ou créer `backend/src/server.js`

```javascript
import express from 'express';
import cors from 'cors';
import { askSportAI, getProductsByIds } from './lib/aiService.js';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, weather } = req.body;
    const result = await askSportAI(message, weather);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint produits
app.get('/api/products', async (req, res) => {
  try {
    const ids = req.query.ids?.split(',').map(Number) || [];
    const products = await getProductsByIds(ids);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5173;
app.listen(PORT, () => {
  console.log(`🚀 Backend API sur http://localhost:${PORT}`);
});
```

### Installer les dépendances
```bash
cd backend
npm install express cors
```

---

## 🚀 Méthode 3 : Copier uniquement les fichiers essentiels

Si vous voulez tout dans un seul projet :

### Fichiers à copier depuis `backend/` vers le frontend

```bash
# Depuis la racine du projet
cp backend/src/data/products.json src/data/
cp backend/src/lib/logger.js src/lib/
```

### Adapter le service IA pour utiliser products.json

Remplace dans `src/lib/aiService.ts` :

```typescript
// Au lieu de charger depuis Supabase
import productsData from '../data/products.json';

export async function askSportAI(userMessage: string, currentWeather = "temps normal") {
  try {
    // 1. Utiliser le products.json local au lieu de Supabase
    const products = productsData;
    
    // 2. Formater pour l'IA
    const productsText = formatProductsForAI(products);
    const systemPrompt = buildSystemPrompt(productsText, currentWeather);
    
    // ... reste du code inchangé
  }
}
```

---

## 📊 Comparaison des méthodes

| Critère | Méthode 1 (API séparée) | Méthode 2 (Backend REST) | Méthode 3 (Copie fichiers) |
|---------|------------------------|--------------------------|---------------------------|
| **Complexité** | 🟢 Simple | 🟡 Moyenne | 🟢 Simple |
| **Séparation** | ✅ Backend indépendant | ✅ Backend indépendant | ❌ Tout dans frontend |
| **Performance** | 🟡 2 serveurs | 🟡 2 serveurs | 🟢 1 serveur |
| **Maintenance** | ✅ Code backend isolé | ✅ Code backend isolé | ⚠️ Duplication |
| **Recommandé** | ✅ Pour développement | ✅ Pour production | ⚠️ Pour tests rapides |

---

## ✅ Ma recommandation : **Méthode 3 (Copie fichiers)**

Pour un hackathon, la solution la plus simple et rapide :

### Étapes

1. **Copier `products.json`** du backend vers le frontend
2. **Utiliser le service IA existant** que j'ai créé
3. **Configurer Supabase** avec les mêmes produits (optionnel)

### Avantages
✅ Tout dans un seul projet
✅ Pas de configuration réseau complexe
✅ Le service IA que j'ai créé est déjà optimisé
✅ Fonctionne hors ligne

---

## 🔧 Quelle méthode choisir ?

**Choisis la Méthode 1 ou 2 si :**
- Ton collaborateur veut garder son backend séparé
- Vous voulez déployer backend et frontend indépendamment
- Vous avez besoin de scalabilité

**Choisis la Méthode 3 si :**
- C'est pour un hackathon (rapidité)
- Vous voulez un seul déploiement
- Vous préférez la simplicité

---

## 🎯 Action immédiate recommandée

Je te propose la **Méthode 3** car :
1. Le service IA que j'ai créé est déjà intégré
2. Il utilise Supabase (plus robuste que JSON statique)
3. Pas besoin de gérer 2 serveurs
4. Tu peux copier juste les produits si besoin

**Veux-tu que je copie les produits du backend vers Supabase ?**
