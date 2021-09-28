# Bugs

Please create an [issue](https://github.com/Internet-Society-Belgium/isTrust/issues/new/choose).

# Feature request

Please create an [issue](https://github.com/Internet-Society-Belgium/isTrust/issues/new/choose).

# Propose changes

## Prerequisites

-   [git](https://git-scm.com/)
-   [Node.js](https://nodejs.org/en/)
    -   npm
-   [VSCode](https://code.visualstudio.com/)
    -   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    -   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    -   [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
    -   [Jest](https://marketplace.visualstudio.com/items?itemName=orta.vscode-jest)
    -   [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Development Workflow

#### 1. Fork the repository

Go to the [repository](https://github.com/Internet-Society-Belgium/isTrust) and fork it with your GitHub account.

#### 2. Clone your fork on your local machine

```bash
git clone https://github.com/<YOUR_USERNAME>/isTrust.git
```

#### 3. Install the dependencies

```bash
npm install
```

#### 4. Create a branch per feature

```bash
git checkout -b <FEATURE>
git push -u origin <FEATURE>
```

#### 5. Commit modifications

Split modifications into separate commits. And for each :

```bash
git add <FILES_TO_STAGED>
npm run commit
git push
```

#### 6. Propose changes to the main project

Go to your repo on [github](https://github.com) and make a pull request from the desired branch to `main`

#### 7. Wait for review

Don't hesitate to make more commits to improve and fix your code before the approval.
