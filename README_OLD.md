# Automation Testing Framework

This repository contains an automation testing framework using CodeceptJS and Playwright.

## Project Structure

```
root/
├── .github/                # CI configuration files
│   └── workflow.yml
├── configuration/          # Core configuration files
│   ├── environment/
│   │   └── dev.env
│   └── coreConfiguration/
├── core/                   # Core framework logic
│   ├── api/
│   │   ├── accountApi.ts
│   │   └── apiRequestModule.ts
│   ├── basePage.ts
│   └── pages/
│       ├── checkoutPage.ts
│       ├── evaluationPage.ts
│       ├── exploresPage.ts
│       ├── homePage.ts
│       └── loginPage.ts
├── helpers/                # Plugins and utilities
│   ├── fragment/
│   │   └── fakes.ts
│   └── plugins/
│       ├── playwright/
│       ├── allure/
│       └── ...
├── modules/                # Noah modules
│   ├── api/
│   ├── databaseConnection/
│   └── ...
├── pages/                  # Web/mobile page objects
│   ├── login/
│   │   └── login.ts
│   ├── checkout/
│   ├── cart/
│   └── productDetailModal/
├── reports/                # Test reports and attachments
├── test/                   # Test files
│   ├── mock/
│   │   └── smoke.spec.ts
│   ├── api/
│   ├── web/
│   │   ├── customer/
│   │   ├── ops/
│   │   └── doctor/
│   └── mobile/
├── node_modules/
├── .gitignore  
├── codecept.conf.js
├── LICENSE
├── package.json
├── README.md
├── steps_file.js
├── steps.d.ts
├── tsconfig.json
└── yarn.lock
```

## Naming Conventions

- **Folders & Filenames:** Use `snake_case`
- **Scenarios:** Start with uppercase
- **Variables & Functions:** Use `camelCase`

## Recommended VS Code Extensions

- ESLint
- Prettier - Code formatter
- Jasmine ES5 Code Snippets
- JavaScript (ES6) code snippets
- Better Comments
- Terminal
- YAML

---

For more details, see the source files in this repository.
