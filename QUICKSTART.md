# 🚀 Guide de Démarrage Rapide - SportContext AI

## ⚡ Pour faire marcher le projet MAINTENANT (5 minutes)

### Étape 1 : Configurer Supabase (OBLIGATOIRE)

1. **Allez sur votre dashboard Supabase** :
   👉 https://supabase.com/dashboard/project/bqnisykluyuepjityjfc/settings/api

2. **Copiez ces deux valeurs** :
   - `Project URL` (commence par https://bqnisykluyuepjityjfc.supabase.co)
   - `anon public` key (longue clé qui commence par "eyJ...")

3. **Collez-les dans `.env.local`** :
   ```env
   VITE_SUPABASE_URL=https://bqnisykluyuepjityjfc.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJ... (votre clé ici)
   ```

### Étape 2 : Configurer Featherless AI (pour l'IA intelligente)

1. **Créez un compte sur Featherless.ai** :
   👉 https://featherless.ai/

2. **Générez une clé API** dans les settings

3. **Ajoutez-la dans `.env.local`** :
   ```env
   VITE_FEATHERLESS_API_KEY=votre_cle_featherless
   ```

**Note** : Sans cette clé, l'IA fonctionnera en **mode démo** (recommandations basiques).

### Étape 3 : Appliquer la migration SQL (produits supplémentaires)

1. **Allez dans l'éditeur SQL** :
   👉 https://supabase.com/dashboard/project/bqnisykluyuepjityjfc/sql/new

2. **Copiez-collez le contenu de** `supabase/migrations/20260117143000_add_more_products.sql`

3. **Cliquez sur "Run"** (en bas à droite)

### Étape 4 : Démarrer le projet

```bash
npm run dev
```

Ouvrez http://localhost:8081 dans votre navigateur 🎉

---

## ✅ Ce qui est MAINTENANT intégré

✓ **Service IA Featherless** : recommandations intelligentes via LLM
✓ **Intégration Supabase** : produits chargés dynamiquement depuis la BDD
✓ **Détection météo automatique** : l'IA comprend le contexte
✓ **Mode démo** : fonctionne sans Featherless (mode basique)
✓ **Interface complète** : Chat + Grille produits + Header
✓ **System Prompt optimisé** : réponses JSON strictes
✓ **Filtrage intelligent** : uniquement produits en stock
✓ **Fallback robuste** : parsing JSON avec récupération d'erreur

---

## 🤖 Comment fonctionne l'IA

### Architecture

```
User → ChatInterface → aiService.ts → Featherless API
                            ↓
                    Supabase (produits)
                            ↓
                    ProductsPanel (affichage)
```

### Fichiers clés

- `src/lib/aiService.ts` : Service principal IA
- `src/components/ChatInterface.tsx` : Interface chat avec appels IA
- `.env.local` : Configuration (Supabase + Featherless)

### Le System Prompt

L'IA reçoit :
1. **Le catalogue complet** des produits depuis Supabase
2. **La météo détectée** dans le message utilisateur
3. **Un format JSON strict** à respecter

Réponse attendue :
```json
{
  "reply": "Ta réponse sympathique avec noms de produits",
  "recommended_ids": [1, 2, 3]
}
```

---

## 🆘 Dépannage

### "Page blanche" ?
→ **Vérifiez `.env.local`** avec les VRAIES credentials Supabase

### "Mode démo" dans les réponses ?
→ **La clé Featherless n'est pas configurée**. Ajoutez `VITE_FEATHERLESS_API_KEY`

### "Cannot read properties of undefined" ?
→ **Redémarrez** `npm run dev` après modification du `.env.local`

### "403 gated model" ?
→ Le modèle nécessite une autorisation HuggingFace. **Utilisez** : `mistralai/Mistral-7B-Instruct-v0.3`

### "Failed to fetch products" ?
→ Vérifiez que les **migrations SQL sont exécutées** dans Supabase

### L'IA ne répond pas en JSON ?
→ Normal, le service a un **fallback intelligent** qui extrait les IDs même si le JSON est cassé

---

## 📊 Structure de la table `products`

```sql
- id (UUID)
- name (TEXT)
- category (TEXT) -- "Running", "Vélo", "Randonnée"
- price (NUMERIC)
- weather_tags (TEXT[]) -- ["Pluie", "Froid", "Soleil", "Vent"]
- stock_level (INTEGER)
- description (TEXT)
- image_url (TEXT)
```

---

## 🎯 Test de l'IA

### Messages de test

Essayez ces messages dans le chat :

1. **Pluie** : "Je prévois une randonnée sous la pluie"
2. **Soleil** : "Je vais courir au soleil demain"
3. **Froid** : "Sortie vélo par temps froid"
4. **Budget** : "Je cherche des équipements pas chers"

### Vérifications

✓ L'IA doit recommander 1-4 produits
✓ Les IDs doivent correspondre à des produits en stock
✓ Les noms de produits doivent apparaître dans la réponse
✓ Le panneau de droite doit afficher les produits

---

## 📁 Fichiers supprimés/non utilisés

Le dossier `backend/` contient l'ancienne version standalone. Tout est maintenant intégré dans `src/`:

- ❌ `backend/src/lib/aiService.js` → ✅ `src/lib/aiService.ts`
- ❌ `backend/src/data/products.json` → ✅ Base Supabase
- ❌ `backend/src/components/ChatBox.jsx` → ✅ `src/components/ChatInterface.tsx`

**Vous pouvez supprimer** le dossier `backend/` si tout fonctionne.

---

## ⏱️ Temps estimé

- **Configuration** : 3 minutes
- **Premier test** : 1 minute
- **Total** : **4 minutes** pour tout faire marcher ! 🚀
