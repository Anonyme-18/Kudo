# Kudo 🎓

Kudo est une plateforme de prise de notes intelligente, conçue spécifiquement pour répondre aux défis des étudiants sur les campus africains : connexions internet instables, coût élevé de la data, et besoin d'efficacité maximale lors des révisions.

## 🚀 Fonctionnalités clés

- **Transcription Intelligente** : Enregistrez vos cours, obtenez des transcriptions structurées avec définitions et points clés, même dans un environnement bruyant.
- **Conversion de documents** : Transformez vos photos de polycopiés ou scans de faible qualité en fiches de révision lisibles et structurées.
- **Mode Hors-ligne (Offline First)** : L'application est pensée pour fonctionner sans connexion, avec une synchronisation automatique dès que le réseau est disponible.
- **Optimisation Data** : Consommation ultra-faible (< 4 Mo/h), parfaitement adaptée aux forfaits limités.

## 🛠️ Stack Technique

Ce projet utilise des technologies modernes pour garantir performance, type-safety et expérience développeur :

- **Framework** : [Next.js](https://nextjs.org/) (App Router) pour le routage et le rendu optimisé.
- **Routing** : [TanStack Router](https://tanstack.com/router/latest) pour une gestion de routage type-safe.
- **Base de données** : [PostgreSQL](https://www.postgresql.org/) avec [Neon](https://neon.tech/) pour le stockage, via [Drizzle ORM](https://orm.drizzle.team/).
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/) pour un design flexible et moderne.
- **Animations** : [Framer Motion](https://www.framer.com/motion/) pour des interfaces fluides et immersives.

## 📦 Installation & Démarrage

1. Clonez le dépôt et installez les dépendances :
   ```bash
   npm install
   ```
2. Configurez vos variables d'environnement (copiez `.env.example` en `.env.local`) :
   ```bash
   cp .env.example .env.local
   ```
   Remplissez les valeurs nécessaires :
   - `DATABASE_URL` : Votre chaîne de connexion Neon PostgreSQL.
   - `ADMIN_PASSWORD` : Le mot de passe sécurisé pour l'espace fondateur.

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## 🚀 Déploiement

Le projet est configuré pour un déploiement fluide sur [Vercel](https://vercel.com/). Assurez-vous d'ajouter `DATABASE_URL` et `ADMIN_PASSWORD` dans les **Environment Variables** des paramètres de votre projet sur le tableau de bord Vercel avant le premier déploiement.
