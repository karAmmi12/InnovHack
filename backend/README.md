# 🏃 InnovHack - Personal Shopper IA

Personal Shopper intelligent pour enseigne de sport utilisant l'IA pour recommander les produits parfaits selon la météo et les besoins du client.

## 🚀 Démarrage Rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration (Optionnel)

Si tu veux utiliser l'IA pour les recommandations, crée un fichier `.env` :

```bash
cp .env.example .env
```

Et remplis ta clé Featherless : [https://featherless.ai/dashboard](https://featherless.ai/dashboard)

**Note** : L'application fonctionne sans clé IA (mode dégradé avec produits statiques).

### 3. Lancement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📁 Structure du Projet

```
InnovHack/
├── src/
│   ├── data/
│   │   └── products.json         # Base de données locale (26 produits)
│   ├── lib/
│   │   └── aiService.js          # Logique IA + recommandations
│   ├── hooks/
│   │   └── useSportAI.js         # Hook React pour le chat
│   ├── components/
│   │   └── ChatBox.jsx           # Interface utilisateur
│   ├── App.jsx                   # Composant principal
│   └── main.jsx                  # Point d'entrée
├── .env.example                  # Template de configuration
└── INTEGRATION_GUIDE.md          # Guide détaillé
```

## 🧠 Fonctionnalités

✅ Chat intelligent avec IA (Llama-3-8B via Featherless)  
✅ Recommandations basées sur la météo actuelle  
✅ Catalogue de 26 produits sport (randonnée, running) en **local**  
✅ Gestion automatique des ruptures de stock  
✅ Sélecteur de conditions météo (soleil, pluie, froid, etc.)  
✅ Interface responsive avec suggestions de questions  
✅ **0 configuration requise** - Fonctionne directement en local  

## 🔒 Sécurité

- L'IA ne peut recommander QUE des produits existants (System Prompt strict)
- Les produits en rupture de stock sont automatiquement filtrés
- Base de données locale (aucune dépendance cloud)
- Les variables d'environnement sont protégées par `.gitignore`

## 📚 Documentation

Voir [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) pour :
- Guide d'utilisation du hook `useSportAI`
- Exemples de code
- Personnalisation de l'interface
- Debugging

## 🛠️ Stack Technique

- **Frontend** : React 18 + Vite
- **Base de données** : JSON local (26 produits)
- **IA** : Featherless.ai (Llama-3-8B-Instruct) - Optionnel
- **Styling** : Inline styles (facilement remplaçable par Tailwind/CSS)

## 📝 Scripts

```bash
npm run dev       # Lancer en mode développement
npm run build     # Build de production
npm run preview   # Prévisualiser le build
```

## 🎯 Prochaines Étapes

- [ ] Intégrer une vraie API météo (OpenWeatherMap)
- [ ] Ajouter un système de panier
- [ ] Historique de conversation persistant
- [ ] Multi-langues
- [ ] Tests unitaires

## 🎮 Tester l'Application

L'app tourne sur **http://localhost:5173**

**Scénarios de test :**
1. Sélectionne "☀️ Soleil" et demande : *"je cherche une tenue pour courir"*
2. Change pour "🌧️ Pluie" et demande : *"j'ai besoin d'une veste"*
3. Teste : *"j'ai 50€ max, montre-moi des produits"*

---

**Let's shiiiine! 🌟**
