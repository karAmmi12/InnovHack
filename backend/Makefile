# Makefile pour InnovHack - Personal Shopper IA
# Usage: make <commande>

.PHONY: help install dev build preview clean stop logs test

# Couleurs pour les messages
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

# Commande par défaut
.DEFAULT_GOAL := help

## help: Affiche cette aide
help:
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo "$(GREEN)  InnovHack - Personal Shopper IA - Commandes$(NC)"
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"
	@echo ""
	@echo "$(YELLOW)Installation :$(NC)"
	@echo "  make install      - Installer les dépendances"
	@echo ""
	@echo "$(YELLOW)Développement :$(NC)"
	@echo "  make dev          - Lancer en mode développement"
	@echo "  make stop         - Arrêter le serveur de dev"
	@echo "  make logs         - Voir les logs en temps réel"
	@echo ""
	@echo "$(YELLOW)Production :$(NC)"
	@echo "  make build        - Compiler pour la production"
	@echo "  make preview      - Prévisualiser le build"
	@echo ""
	@echo "$(YELLOW)Maintenance :$(NC)"
	@echo "  make clean        - Nettoyer les fichiers temporaires"
	@echo "  make test         - Tester la configuration"
	@echo ""
	@echo "$(GREEN)━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$(NC)"

## install: Installer les dépendances npm
install:
	@echo "$(GREEN)📦 Installation des dépendances...$(NC)"
	@npm install
	@echo "$(GREEN)✅ Dépendances installées !$(NC)"

## dev: Lancer le serveur de développement
dev:
	@echo "$(GREEN)🚀 Lancement du serveur de développement...$(NC)"
	@echo "$(YELLOW)   → http://localhost:5173$(NC)"
	@echo "$(YELLOW)   → Appuie sur Ctrl+C pour arrêter$(NC)"
	@npm run dev

## stop: Arrêter le serveur de développement
stop:
	@echo "$(RED)⏹️  Arrêt du serveur...$(NC)"
	@pkill -f "vite" || echo "$(YELLOW)Aucun serveur en cours$(NC)"
	@echo "$(GREEN)✅ Serveur arrêté$(NC)"

## build: Compiler l'application pour la production
build:
	@echo "$(GREEN)🔨 Compilation pour la production...$(NC)"
	@npm run build
	@echo "$(GREEN)✅ Build terminé ! Fichiers dans /dist$(NC)"

## preview: Prévisualiser le build de production
preview:
	@echo "$(GREEN)👀 Prévisualisation du build...$(NC)"
	@npm run preview

## clean: Nettoyer les fichiers temporaires
clean:
	@echo "$(YELLOW)🧹 Nettoyage...$(NC)"
	@rm -rf node_modules dist .vite
	@echo "$(GREEN)✅ Nettoyage terminé$(NC)"

## logs: Afficher les informations système
logs:
	@echo "$(GREEN)📊 Configuration système :$(NC)"
	@echo ""
	@echo "$(YELLOW)Node.js :$(NC) $$(node --version)"
	@echo "$(YELLOW)npm :$(NC) $$(npm --version)"
	@echo ""
	@echo "$(YELLOW)Variables d'environnement :$(NC)"
	@if [ -f .env ]; then \
		grep -v '^#' .env | grep -v '^$$' | sed 's/=.*/=***/' || true; \
	else \
		echo "$(RED)  Fichier .env introuvable$(NC)"; \
	fi
	@echo ""
	@echo "$(YELLOW)Produits dans le catalogue :$(NC)"
	@if [ -f src/data/products.json ]; then \
		echo "  $$(cat src/data/products.json | grep -c '"id"') produits"; \
	else \
		echo "$(RED)  Fichier products.json introuvable$(NC)"; \
	fi

## test: Tester la configuration
test:
	@echo "$(GREEN)🧪 Vérification de la configuration...$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Vérification de Node.js...$(NC)"
	@node --version > /dev/null && echo "  ✅ Node.js installé" || echo "  ❌ Node.js manquant"
	@echo ""
	@echo "$(YELLOW)2. Vérification des dépendances...$(NC)"
	@if [ -d node_modules ]; then \
		echo "  ✅ Dépendances installées"; \
	else \
		echo "  ❌ Dépendances manquantes (lance: make install)"; \
	fi
	@echo ""
	@echo "$(YELLOW)3. Vérification du fichier .env...$(NC)"
	@if [ -f .env ]; then \
		echo "  ✅ Fichier .env présent"; \
		if grep -q "ta_cle_featherless_ici" .env; then \
			echo "  ⚠️  Clé Featherless non configurée"; \
		else \
			echo "  ✅ Clé Featherless configurée"; \
		fi; \
	else \
		echo "  ⚠️  Fichier .env manquant (lance: cp .env.example .env)"; \
	fi
	@echo ""
	@echo "$(YELLOW)4. Vérification des produits...$(NC)"
	@if [ -f src/data/products.json ]; then \
		echo "  ✅ Catalogue de produits présent ($$(cat src/data/products.json | grep -c '"id"') produits)"; \
	else \
		echo "  ❌ Catalogue de produits manquant"; \
	fi
	@echo ""
	@if [ -d node_modules ] && [ -f .env ] && [ -f src/data/products.json ]; then \
		echo "$(GREEN)✅ Configuration OK ! Lance: make dev$(NC)"; \
	else \
		echo "$(RED)❌ Configuration incomplète$(NC)"; \
	fi

## status: Vérifier si le serveur tourne
status:
	@if pgrep -f "vite" > /dev/null; then \
		echo "$(GREEN)✅ Serveur en cours d'exécution$(NC)"; \
		echo "$(YELLOW)   → http://localhost:5173$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Serveur arrêté$(NC)"; \
		echo "$(YELLOW)   Lance: make dev$(NC)"; \
	fi

## restart: Redémarrer le serveur
restart: stop dev

## setup: Installation complète (première utilisation)
setup:
	@echo "$(GREEN)🎯 Configuration initiale du projet...$(NC)"
	@echo ""
	@echo "$(YELLOW)Étape 1/3 : Installation des dépendances$(NC)"
	@make install
	@echo ""
	@echo "$(YELLOW)Étape 2/3 : Configuration de l'environnement$(NC)"
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "  ✅ Fichier .env créé"; \
		echo "  ⚠️  Pense à remplir ta clé Featherless !"; \
	else \
		echo "  ✅ Fichier .env déjà présent"; \
	fi
	@echo ""
	@echo "$(YELLOW)Étape 3/3 : Vérification$(NC)"
	@make test
	@echo ""
	@echo "$(GREEN)🎉 Setup terminé ! Lance: make dev$(NC)"
