# GitHub Repo Search

Search repos on GitHub for your favorite languages, and sort them by stars, forks or last update date.

Try it out: https://github-repos-ui.vercel.app/

## Tech Stack

- Vite
- React
- Typescript
- TanStack Query
- TanStack Table
- shadcn/ui
- Tailwind
- Radix UI

## How to run it?

Clone the repo:

```bash
git clone https://github.com/yusufff/github-repos.git
cd github-repos
```

Install the packages:

```bash
yarn install
# or
npm install
# or
pnpm install
# or
bun install
```

Create the .env file and add your [Github Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token):

```bash
cp .env.example .env
```

Run the application:

```bash
yarn dev
# or
npm run dev
# or
pnpm run dev
# or
bun dev
```

## FAQ

### Why TanStack Query and not something like Redux?

> The purpose of this application is to display the server-side data. Pagination, sorting, filtering, all of that are done on the server-side. For this type of applications, we don't need to manage the client-side state ourselves. Infact, to avoid unnecessary overhead, we shouldn't. TanStack Query is of the best solutions for this kind of state management. Alternatives are SWR or RTK Query.

### Why Vite and not something like NextJS?

> Simply put; faster development. If this was a real production project, I would probably use NextJS.

### Why shadcn/ui and not something like Mantine?

> Fully featured component libraries like Mantine, MUI, and Bootstrap are great when you want to try something, don't really care about owning the design, and will throw it away after you are done. I'm not particularly eager to use them because I care about owning the design and shadcn/ui is an amazing solution for good predefined design and infinite extensibility.
