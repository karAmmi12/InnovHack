# 🏆 Verronik - Assistant Sportif Intelligent

> Projet généré avec **Lovable** + Backend IA intégré avec **Featherless AI**

## 🎯 Qu'est-ce que c'est ?

**Verronik** est un assistant d'achat sportif intelligent qui recommande l'équipement parfait en fonction de :
- 🌤️ **La météo** (pluie, soleil, froid, vent)
- 🏃 **L'activité** (running, vélo, randonnée)
- 💰 **Ton budget**
- 📦 **Le stock disponible**

Propulsé par une IA conversationnelle (Featherless AI + Mistral 7B) et une base de données Supabase.

---

## ⚡ Démarrage Rapide (5 minutes)

### 1. Clone le projet

```bash
git clone <YOUR_GIT_URL>
cd InnovHack
npm install
```

### 2. Configure les credentials

Copie le fichier d'exemple :
```bash
cp .env.local.example .env.local
```

Puis édite `.env.local` avec tes vraies valeurs :

```env
# Supabase (obligatoire)
VITE_SUPABASE_URL=https://bqnisykluyuepjityjfc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=ta_cle_supabase_ici

# Featherless AI (optionnel, mode démo sans)
VITE_FEATHERLESS_API_KEY=ta_cle_featherless_ici
```

**Où trouver les clés ?**
- **Supabase** : https://supabase.com/dashboard/project/bqnisykluyuepjityjfc/settings/api
- **Featherless** : https://featherless.ai/ (créer un compte)

### 3. Exécute les migrations SQL

1. Va sur https://supabase.com/dashboard/project/bqnisykluyuepjityjfc/sql/new
2. Copie le contenu de `supabase/migrations/20260117143000_add_more_products.sql`
3. Clique sur "Run"

### 4. Démarre le projet

```bash
npm run dev
```

Ouvre http://localhost:8080 🎉

---

## 📖 Documentation

| Fichier | Description |
|---------|-------------|
| **QUICKSTART.md** | Guide de démarrage pas-à-pas (5 min) |
| **ARCHITECTURE.md** | Architecture technique complète |
| **INTEGRATION_COMPLETE.md** | Détails de l'intégration backend→frontend |

---

## 🧪 Vérification automatique

Lance ce script pour vérifier ta configuration :

```bash
./check-config.sh
```

Il vérifie automatiquement :
- ✅ Présence de `.env.local`
- ✅ Credentials Supabase configurés
- ✅ Clé Featherless (ou mode démo)
- ✅ Fichiers essentiels présents
- ✅ Migrations SQL disponibles

---

## 🎨 Fonctionnalités

### ✅ Déjà implémenté

- 💬 **Chat conversationnel** avec IA Featherless (Mistral 7B)
- 🛍️ **15 produits sportifs** en base Supabase
- 🌦️ **Détection météo automatique** dans les messages
- 📦 **Filtrage intelligent** (stock, catégorie, tags météo)
- 🎯 **Recommandations personnalisées** (1-4 produits max)
- 🔄 **Mode démo** si Featherless non configuré
- 🛡️ **Parsing JSON robuste** avec fallbacks
- 🎨 **Interface moderne** style Nike/Apple

### 🚀 À améliorer (optionnel)

- [ ] Cache Supabase (éviter requêtes répétées)
- [ ] Historique de conversation (contexte multi-tours)
- [ ] Streaming des réponses IA (affichage progressif)
- [ ] Tests unitaires (vitest)
- [ ] Métriques de performance

---

## 🏗️ Architecture Technique

```
User Message
    ↓
ChatInterface.tsx
    ↓
aiService.ts
    ├─→ Supabase (charger produits)
    ├─→ Featherless API (LLM Mistral 7B)
    └─→ Parsing JSON + Filtrage
    ↓
{ reply: "...", recommended_ids: [1,2,3] }
    ↓
ProductsPanel.tsx (affichage)
```

**Fichiers clés** :
- `src/lib/aiService.ts` - Service IA principal
- `src/components/ChatInterface.tsx` - Interface chat
- `src/integrations/supabase/client.ts` - Connexion Supabase

---

## 🧠 Comment fonctionne l'IA ?

### System Prompt
L'IA reçoit :
1. **Tous les produits** de Supabase (nom, prix, stock, tags météo)
2. **La météo détectée** dans le message utilisateur
3. **Des règles strictes** : répondre uniquement en JSON

### Format de réponse
```json
{
  "reply": "Pour courir au soleil, je te recommande le T-shirt Breath+ !",
  "recommended_ids": [2, 13]
}
```

### Sécurité
- ✅ Uniquement des produits du catalogue (pas d'hallucinations)
- ✅ Filtrage automatique des produits en rupture de stock
- ✅ Maximum 4 recommandations
- ✅ Fallback si JSON invalide

---

## 🆘 Dépannage

### Page blanche ?
```bash
# Vérifie que .env.local est bien rempli
cat .env.local

# Redémarre le serveur
npm run dev
```

### "Mode démo" affiché ?
→ La clé Featherless n'est pas configurée. Ajoute `VITE_FEATHERLESS_API_KEY` dans `.env.local`

### "403 gated model" ?
→ Change le modèle dans `.env.local` :
```env
VITE_AI_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

### Autres erreurs ?
```bash
# Lance le diagnostic automatique
./check-config.sh
```

---

## 🛠️ Stack Technique

| Techno | Usage |
|--------|-------|
| **React 18** | Framework frontend |
| **TypeScript** | Typage statique |
| **Vite** | Build tool ultra-rapide |
| **Tailwind CSS** | Styles utilitaires |
| **shadcn/ui** | Composants UI |
| **Supabase** | Base de données + Auth |
| **Featherless AI** | API LLM (Mistral 7B) |
| **React Router** | Navigation |
| **Lucide Icons** | Icônes |

---

## 📝 Développement Local

### Éditer le code

**Option 1 : Via Lovable**
- Visite https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID
- Les changements sont auto-commit sur ce repo

**Option 2 : IDE local**
```bash
git clone <YOUR_GIT_URL>
cd InnovHack
npm install
npm run dev
```

**Option 3 : GitHub Codespaces**
- Clique sur "Code" → "Codespaces" → "New codespace"

### Commandes utiles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
./check-config.sh    # Vérifier la configuration
```

---

## 📚 Ressources

- **Featherless AI** : https://featherless.ai/
- **Supabase Dashboard** : https://supabase.com/dashboard/project/bqnisykluyuepjityjfc
- **Mistral 7B** : https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3
- **shadcn/ui** : https://ui.shadcn.com/

---

## 🏆 Crédits

**Verronik** - Projet créé pour InnovHack - 17 janvier 2026

- Interface générée avec **Lovable**
- Backend IA intégré avec **Featherless**
- Base de données **Supabase**

---

## 📄 Licence

MIT
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
