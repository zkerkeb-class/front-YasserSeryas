# Book My Event - Application de Réservation d'Événements

Une application web moderne et élégante pour la réservation d'événements, construite avec React, Material-UI et Tailwind CSS.

## ✨ Fonctionnalités

- **Interface utilisateur moderne** avec Material-UI et Tailwind CSS
- **Recherche avancée** d'événements avec filtres multiples
- **Catalogue d'événements** avec vue grille et liste
- **Système de réservation** intuitif
- **Espace client et administration** séparés
- **Design responsive** pour tous les appareils
- **Animations et transitions** fluides

## 🎨 Design et UX

- Interface épurée et moderne
- Palette de couleurs harmonieuse (bleu et violet)
- Composants Material-UI personnalisés
- Animations CSS et transitions
- Typographie optimisée
- Icônes Material Design

## 🚀 Technologies Utilisées

- **React** 19.1.0 - Framework frontend
- **Material-UI** (@mui/material) - Bibliothèque de composants
- **Tailwind CSS** - Framework CSS utilitaire
- **Material Icons** - Icônes
- **Emotion** - CSS-in-JS pour Material-UI

## 📦 Installation

1. Clonez le repository
```bash
git clone https://github.com/votre-username/book-my-event.git
cd book-my-event
```

2. Installez les dépendances
```bash
npm install
```

3. Démarrez l'application
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Structure du Projet

```
src/
├── components/
│   ├── Header.jsx              # En-tête avec navigation
│   ├── SearchBar.jsx           # Barre de recherche avancée
│   ├── FeaturedEvents.jsx      # Événements en vedette
│   ├── EventList.jsx           # Liste/grille d'événements
│   ├── EventFilters.jsx        # Filtres d'événements
│   ├── BookingForm.jsx         # Formulaire de réservation
│   └── ...
├── pages/
│   ├── HomePage.jsx            # Page d'accueil
│   ├── EventsPage.jsx          # Page des événements
│   ├── LoginPage.jsx           # Page de connexion
│   ├── BookingPage.jsx         # Page de réservation
│   └── AdminDashboard.jsx      # Tableau de bord admin
├── theme.js                    # Thème Material-UI personnalisé
├── App.js                      # Composant principal
└── index.js                    # Point d'entrée
```

## 🎯 Fonctionnalités Principales

### Page d'Accueil
- Hero section avec gradient et animations
- Barre de recherche avancée avec filtres rapides
- Événements en vedette avec cartes interactives
- Design responsive et moderne

### Page des Événements
- Filtres avancés (catégorie, lieu, prix, date, etc.)
- Vue grille et liste
- Tri par date, prix, popularité, note
- Pagination
- Cartes d'événements avec informations détaillées

### Système de Recherche
- Recherche par mots-clés
- Filtres par localisation
- Filtres par catégorie
- Suggestions de recherche rapide

### Page de Connexion
- Onglets client/admin
- Validation de formulaire
- Connexion via réseaux sociaux
- Design sécurisé et intuitif

## 🎨 Personnalisation du Design

### Thème Material-UI
Le thème est configuré dans `src/theme.js` avec :
- Palette de couleurs personnalisée
- Typographie optimisée
- Composants stylisés
- Bordures arrondies

### Classes Tailwind Personnalisées
- `.line-clamp-*` pour tronquer le texte
- `.gradient-text` pour les textes en dégradé
- `.animate-float` pour les animations flottantes

## 📱 Responsive Design

L'application est entièrement responsive avec :
- Breakpoints Tailwind CSS
- Composants Material-UI adaptatifs
- Navigation mobile optimisée
- Cartes d'événements redimensionnables

## 🔧 Scripts Disponibles

- `npm start` - Démarre le serveur de développement
- `npm build` - Construit l'application pour la production
- `npm test` - Lance les tests
- `npm run eject` - Éjecte la configuration (non recommandé)

## 🎭 Améliorations Récentes

- ✅ Intégration de Material-UI avec des composants modernes
- ✅ Ajout de Tailwind CSS pour un styling rapide
- ✅ Refactorisation complète de l'interface utilisateur
- ✅ Amélioration des animations et transitions
- ✅ Optimisation de l'expérience utilisateur
- ✅ Design system cohérent
- ✅ Responsiveness amélioré

## 🔮 Fonctionnalités Futures

- [ ] Système de paiement intégré
- [ ] Notifications en temps réel
- [ ] Géolocalisation des événements
- [ ] Chat en direct
- [ ] Application mobile (React Native)
- [ ] Mode sombre
- [ ] Internationalisation (i18n)

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Committer vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développeur Frontend** - Conception et développement de l'interface utilisateur
- **Designer UI/UX** - Design et expérience utilisateur

---

**Book My Event** - Réservez vos événements en toute simplicité ! 🎉
