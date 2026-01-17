#!/bin/bash

# Script de validation rapide du projet SportContext AI
# Usage: ./check-config.sh

echo "🔍 Vérification de la configuration SportContext AI..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
errors=0
warnings=0

# Vérifier si .env.local existe
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Fichier .env.local manquant${NC}"
    echo "   Crée-le avec : cp .env.local.example .env.local"
    errors=$((errors + 1))
else
    echo -e "${GREEN}✅ .env.local trouvé${NC}"
    
    # Vérifier Supabase URL
    if grep -q "VITE_SUPABASE_URL=https://" .env.local; then
        echo -e "${GREEN}✅ VITE_SUPABASE_URL configuré${NC}"
    else
        echo -e "${RED}❌ VITE_SUPABASE_URL non configuré${NC}"
        errors=$((errors + 1))
    fi
    
    # Vérifier Supabase Key
    if grep -q "VITE_SUPABASE_PUBLISHABLE_KEY=eyJ" .env.local; then
        echo -e "${GREEN}✅ VITE_SUPABASE_PUBLISHABLE_KEY configuré${NC}"
    else
        echo -e "${RED}❌ VITE_SUPABASE_PUBLISHABLE_KEY non configuré${NC}"
        errors=$((errors + 1))
    fi
    
    # Vérifier Featherless API Key
    if grep -q "VITE_FEATHERLESS_API_KEY=your_featherless" .env.local; then
        echo -e "${YELLOW}⚠️  VITE_FEATHERLESS_API_KEY non configuré (mode démo)${NC}"
        warnings=$((warnings + 1))
    elif grep -q "VITE_FEATHERLESS_API_KEY=" .env.local; then
        echo -e "${GREEN}✅ VITE_FEATHERLESS_API_KEY configuré${NC}"
    else
        echo -e "${YELLOW}⚠️  VITE_FEATHERLESS_API_KEY manquant (mode démo)${NC}"
        warnings=$((warnings + 1))
    fi
fi

echo ""
echo "📦 Vérification des dépendances..."

# Vérifier node_modules
if [ -d node_modules ]; then
    echo -e "${GREEN}✅ node_modules présent${NC}"
else
    echo -e "${RED}❌ node_modules manquant - Lance: npm install${NC}"
    errors=$((errors + 1))
fi

# Vérifier package.json
if [ -f package.json ]; then
    echo -e "${GREEN}✅ package.json trouvé${NC}"
else
    echo -e "${RED}❌ package.json manquant${NC}"
    errors=$((errors + 1))
fi

echo ""
echo "📁 Vérification des fichiers clés..."

# Vérifier aiService.ts
if [ -f src/lib/aiService.ts ]; then
    echo -e "${GREEN}✅ src/lib/aiService.ts (Service IA)${NC}"
else
    echo -e "${RED}❌ src/lib/aiService.ts manquant${NC}"
    errors=$((errors + 1))
fi

# Vérifier ChatInterface.tsx
if [ -f src/components/ChatInterface.tsx ]; then
    echo -e "${GREEN}✅ src/components/ChatInterface.tsx${NC}"
else
    echo -e "${RED}❌ src/components/ChatInterface.tsx manquant${NC}"
    errors=$((errors + 1))
fi

# Vérifier Supabase client
if [ -f src/integrations/supabase/client.ts ]; then
    echo -e "${GREEN}✅ src/integrations/supabase/client.ts${NC}"
else
    echo -e "${RED}❌ src/integrations/supabase/client.ts manquant${NC}"
    errors=$((errors + 1))
fi

echo ""
echo "🗄️  Vérification Supabase..."

# Vérifier migrations
migration_count=$(find supabase/migrations -name "*.sql" 2>/dev/null | wc -l)
if [ $migration_count -gt 0 ]; then
    echo -e "${GREEN}✅ $migration_count migration(s) trouvée(s)${NC}"
    echo "   N'oublie pas de les exécuter dans le dashboard Supabase !"
else
    echo -e "${YELLOW}⚠️  Aucune migration SQL trouvée${NC}"
    warnings=$((warnings + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🎉 Configuration OK !${NC}"
    echo ""
    if [ $warnings -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $warnings avertissement(s)${NC}"
        echo ""
    fi
    echo "Pour démarrer le projet :"
    echo "  npm run dev"
    echo ""
    echo "Puis ouvre : http://localhost:8080"
else
    echo -e "${RED}❌ $errors erreur(s) détectée(s)${NC}"
    echo ""
    echo "Consulte le guide : QUICKSTART.md"
    exit 1
fi

echo ""
echo "📖 Documentation :"
echo "  • QUICKSTART.md   → Démarrage rapide (5 min)"
echo "  • ARCHITECTURE.md → Comprendre le code"
echo ""
