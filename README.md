# Treasure Track

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img alt="Recharts" src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge" />
</p>

<img src="/public/tela-treasure-track.png" alt="Exemplo imagem">

> <b> Treasure Track is a personal finance manager designed to help users gain full control over their money by manually tracking incomes and expenses.</b>

## 🎯 Project Purpose

- Serve as a personal project to practice modern web development
- Promote financial awareness through manual tracking
- Centralize all financial information in one place
- Provide clear insights into incomes and expenses

## 📌 Project Status

🚧 In active development
This is a personal project, continuously evolving with new features, UI improvements, and refinements.

### ✨ Key Features

- [x] 🧾 Manual income and expense tracking
- [x] 📊 Interactive dashboard with visual insights
- [x] 🗂️ Custom categories and accounts
- [ ] 📤 Export transactions table
- [ ] ⚙️ Settings page(Currency and locale preferences)

## 🤓 Getting Started

### ☝ Required

- Node.js >= 20
  Recommended: latest LTS version
- npm (comes with Node.js) or pnpm / yarn
- Git

### 💻 Backend & Services

- Supabase account
- Used as the database and authentication provider
  <b>You will need: </b>
  - Supabase Project URL
  - Supabase Anon Public Key

### 💿 Recommended

- These tools are not mandatory but improve the development experience:
- TypeScript (already configured)
- ESLint (already configured)
- Modern browser (Chrome, Edge, Firefox)

## 🚀 Installation & Running Locally

Follow the steps below to run Treasure Track on your local machine.

1. Clone the repository

```bash
   git clone https://github.com/joao-ressel/trt
   cd trt
```

2. Install dependencies

Using npm, yarn or :

```bash
npm install
```

Or with :

```bash
yarn install
```

Or with pnpm:

```bash
pnpm install
```

3. Configure environment variables

Create a .env.local file at the root of the project and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=sb_publishable_xxxxx
SUPABASE_SECRET_KEY=xxxxxxxxxxxxxxxxxxx
```

These values can be found in your Supabase project settings.

4. Run the development server

```bash
   npm run dev
```

The application will be available at:

```
http://localhost:3000
```

5. Build for production (optional)

```
   npm run build
   npm run start
```

\*\*Notes

- This project uses Next.js with Webpack
- Tailwind CSS and Radix UI are preconfigured
- Supabase handles authentication and database management

## 🌐 Live Demo

The application is deployed on **Vercel** and can be accessed here:
[https://trt-liart.vercel.app/](https://trt-liart.vercel.app/).

## 📄 License

This project is licensed under the MIT License. [LICENCE](LICENSE.md) for more details.
