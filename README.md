# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Project Structure

```
Petique-Clinic/
├── public/                          # Static assets
├── src/
│   ├── Apis/                       # API calls and configurations
│   │   ├── BaseUrl.ts
│   │   ├── CategoryApis.ts
│   │   └── ContactApis.ts
│   ├── assets/                     # Project assets
│   │   ├── images/
│   │   └── svgs/
│   ├── Components/                 # Reusable components
│   │   ├── CategorySlider/
│   │   │   └── CategorySlider.tsx
│   │   ├── Footer/
│   │   │   └── Footer.tsx
│   │   ├── NavBar/
│   │   │   └── NavBar.tsx
│   │   ├── NotFound/
│   │   │   └── NotFound.tsx
│   │   ├── SEO/
│   │   │   └── SEO.tsx
│   │   └── UserProfile/
│   │       ├── OrderHistory.tsx
│   │       ├── Orders.tsx
│   │       └── UserUpdateData.tsx
│   ├── Hooks/                      # Custom React hooks
│   │   └── Categories/
│   │       └── useCategories.ts
│   ├── Interfaces/                 # TypeScript interfaces
│   │   ├── categryInterfaces.ts
│   │   ├── IAppointment.ts
│   │   ├── IContact.ts
│   │   ├── Ipet.ts
│   │   ├── IPriceAlert.ts
│   │   ├── IProducts.ts
│   │   ├── IReminder.ts
│   │   ├── IService.ts
│   │   └── IUser.ts
│   ├── Pages/                      # Page components
│   │   ├── ContactUs/
│   │   │   └── ContactUs.tsx
│   │   ├── ForgetPassword/
│   │   │   └── ForgetPassword.tsx
│   │   ├── Home/
│   │   │   └── Home.tsx
│   │   ├── Login/
│   │   │   └── Login.tsx
│   │   ├── Otp/
│   │   │   └── OtpConfirmation.tsx
│   │   ├── ProductDetails/
│   │   │   └── ProductDetails.tsx
│   │   ├── Products/
│   │   │   └── Products.tsx
│   │   ├── Register/
│   │   │   └── Register.tsx
│   │   └── UserProfile/
│   │       └── UserProfile.tsx
│   ├── Shared/                     # Shared layout and route components
│   │   ├── AuthLayout/
│   │   │   └── AuthLayout.tsx
│   │   ├── Layout/
│   │   │   └── layout.tsx
│   │   ├── LoaderPage/
│   │   │   └── LoaderPage.tsx
│   │   └── ProtectedRoutes/
│   │       ├── AdminProtectedRoutes.tsx
│   │       └── ProtectedRoutes.tsx
│   ├── Store/                      # Redux store configuration
│   │   ├── store.ts
│   │   └── Slices/
│   │       ├── AuthSlice.ts
│   │       └── CartSlice.ts
│   ├── Types/                      # TypeScript type definitions
│   │   ├── CartTypes.ts
│   │   ├── Category.ts
│   │   └── QrResponse.ts
│   ├── App.tsx                     # Main App component
│   ├── App.css                     # App styles
│   ├── index.css                   # Global styles
│   └── main.tsx                    # Application entry point
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json               # TypeScript app configuration
├── tsconfig.node.json              # TypeScript node configuration
├── vite.config.ts                  # Vite configuration
└── README.md                       # This file
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
