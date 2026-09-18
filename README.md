# Kudo

Kudo est une plateforme de prise de notes pensée pour les étudiants africains : transcription de cours, conversion de documents, mode hors connexion et consommation de données maîtrisée.

## Stack

- Next.js 16 et React 19
- TypeScript avec ESLint et Prettier
- PostgreSQL/Neon avec Drizzle ORM
- Tailwind CSS, Framer Motion et composants Radix UI
- Déploiement recommandé : Vercel

## Développement local

Pré-requis : Node.js 20 ou supérieur et une base PostgreSQL (Neon convient très bien).

```bash
npm install
Copy-Item .env.example .env.local
```

Renseignez ensuite `DATABASE_URL` et `ADMIN_PASSWORD` dans `.env.local`, puis créez la table :

```bash
npm run db:generate
npm run db:migrate
npm run dev
```

Les contrôles qualité disponibles sont :

```bash
npm run typecheck
npm run lint
npm run build
```

## Déploiement Vercel

1. Importez le dépôt GitHub dans Vercel.
2. Ajoutez `DATABASE_URL` et `ADMIN_PASSWORD` dans les variables d’environnement Production, Preview et Development selon le besoin.
3. Exécutez la migration Drizzle une fois contre la base de production (`npm run db:migrate`) avant la première utilisation.
4. Lancez le déploiement avec la commande de build par défaut `npm run build`.

`ADMIN_PASSWORD` doit être une valeur longue et aléatoire. Elle ne doit jamais être commitée, affichée dans le navigateur ou ajoutée à une variable `NEXT_PUBLIC_*`.

## Fonctionnalités publiques

- Inscription à la liste d’attente avec code de parrainage.
- Classement recalculé côté serveur.
- Adresses email masquées avant leur envoi au navigateur public.
- Tableau de bord admin protégé par cookie HTTP-only signé côté serveur.

## Données et sécurité

Les emails sont des données personnelles : utilisez une base de production protégée, limitez les accès Neon et prévoyez une politique de conservation/suppression adaptée à votre lancement.
