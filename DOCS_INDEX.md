# 📚 Documentation SportContext AI - Index

## 🚀 Démarrage rapide

**Tu veux lancer le projet rapidement ?**  
→ Lis **[QUICKSTART.md](QUICKSTART.md)** (5 minutes)

---

## 📖 Documentation disponible

### Pour démarrer

| Fichier | Quand le lire | Temps |
|---------|---------------|-------|
| **[QUICKSTART.md](QUICKSTART.md)** | Tu veux lancer le projet maintenant | 5 min |
| **[README.md](README.md)** | Tu veux une vue d'ensemble complète | 10 min |
| **[RESUME.txt](RESUME.txt)** | Tu veux un résumé visuel rapide | 2 min |

### Pour comprendre

| Fichier | Quand le lire | Temps |
|---------|---------------|-------|
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Tu veux comprendre comment ça marche | 15 min |
| **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** | Tu veux savoir ce qui a été intégré | 10 min |
| **[CHANGELOG.md](CHANGELOG.md)** | Tu veux voir tous les changements | 8 min |

### Outils

| Fichier | Usage |
|---------|-------|
| **[check-config.sh](check-config.sh)** | Script de validation automatique |
| **[.env.local.example](.env.local.example)** | Template pour la configuration |

---

## 🎯 Par cas d'usage

### "Je veux juste que ça marche"
1. Ouvre [QUICKSTART.md](QUICKSTART.md)
2. Suis les 4 étapes
3. Lance `npm run dev`

### "Je veux comprendre le code"
1. Lis [ARCHITECTURE.md](ARCHITECTURE.md)
2. Consulte les fichiers clés :
   - `src/lib/aiService.ts`
   - `src/components/ChatInterface.tsx`

### "J'ai une erreur"
1. Lance `./check-config.sh`
2. Consulte la section "Dépannage" du [README.md](README.md)
3. Vérifie les logs dans la console

### "Je veux contribuer"
1. Lis [ARCHITECTURE.md](ARCHITECTURE.md) (comprendre le code)
2. Consulte [CHANGELOG.md](CHANGELOG.md) (voir ce qui existe)
3. Regarde la section "Améliorations futures"

---

## 📂 Structure de la documentation

```
📁 Documentation
│
├── 🚀 Démarrage
│   ├── QUICKSTART.md          (Guide pas-à-pas)
│   ├── README.md              (Vue d'ensemble)
│   └── RESUME.txt             (Résumé visuel)
│
├── 🧠 Technique
│   ├── ARCHITECTURE.md        (Comment ça marche)
│   └── INTEGRATION_COMPLETE.md (Ce qui a été fait)
│
├── 📝 Historique
│   └── CHANGELOG.md           (Toutes les modifications)
│
└── 🛠️ Outils
    ├── check-config.sh        (Validation auto)
    └── .env.local.example     (Template config)
```

---

## 🔍 Recherche rapide

### Configuration

**Question** : Où configurer Supabase ?  
**Réponse** : `.env.local` → Section "Supabase Configuration"  
**Doc** : [QUICKSTART.md#étape-1](QUICKSTART.md)

**Question** : Où configurer Featherless AI ?  
**Réponse** : `.env.local` → Section "Featherless AI Configuration"  
**Doc** : [QUICKSTART.md#étape-2](QUICKSTART.md)

### Architecture

**Question** : Comment fonctionne l'IA ?  
**Réponse** : `src/lib/aiService.ts` → Fonction `askSportAI()`  
**Doc** : [ARCHITECTURE.md#flux-de-données](ARCHITECTURE.md)

**Question** : Comment les produits sont-ils recommandés ?  
**Réponse** : IA Featherless → Parsing JSON → Filtrage stock  
**Doc** : [ARCHITECTURE.md#le-system-prompt](ARCHITECTURE.md)

### Dépannage

**Question** : Page blanche ?  
**Réponse** : Vérifie `.env.local` avec vraies credentials  
**Doc** : [README.md#dépannage](README.md)

**Question** : Mode démo affiché ?  
**Réponse** : Ajoute `VITE_FEATHERLESS_API_KEY` dans `.env.local`  
**Doc** : [QUICKSTART.md#étape-2](QUICKSTART.md)

**Question** : Erreur 403 gated model ?  
**Réponse** : Change `VITE_AI_MODEL` pour `mistralai/Mistral-7B-Instruct-v0.3`  
**Doc** : [README.md#dépannage](README.md)

---

## ⏱️ Temps de lecture estimé

| Niveau | Docs à lire | Temps total |
|--------|-------------|-------------|
| **Débutant** | QUICKSTART + README | 15 min |
| **Intermédiaire** | + ARCHITECTURE | 30 min |
| **Avancé** | Tous les docs | 50 min |

---

## 🆘 Besoin d'aide ?

### Étape 1 : Diagnostic automatique
```bash
./check-config.sh
```

### Étape 2 : Consulter la doc
- **Problème de config** → [QUICKSTART.md](QUICKSTART.md)
- **Problème de code** → [ARCHITECTURE.md](ARCHITECTURE.md)
- **Erreur inconnue** → [README.md#dépannage](README.md)

### Étape 3 : Vérifier les logs
- **Console browser** (F12) → Erreurs JavaScript
- **Terminal** → Erreurs serveur/API
- **Supabase Dashboard** → Erreurs base de données

---

## 📊 Versions

| Date | Version | Description |
|------|---------|-------------|
| 17 janv. 2026 | 1.0.0 | Intégration backend→frontend complète |

---

## 📄 Licence

MIT - Voir [README.md](README.md) pour détails

---

**Projet créé pour InnovHack 2026** 🏆
