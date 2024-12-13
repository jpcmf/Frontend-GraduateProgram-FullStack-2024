<h1 align="center">
    <img alt="SkateHub" title="SkateHub" src=".github/skatehub.svg" />
</h1>

<p align="center">
  <a href="#gear-build-setup">Build setup</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#memo-changelog">Changelog</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#rocket-nextjs-documentation">Next.js documentation</a>
</p>

## SkateHub Frontend

The project requires [Next.js](https://nextjs.org), [Node.js](https://nodejs.org) and [Backend-GraduateProgram-FullStack-2023](https://github.com/jpcmf/Backend-GraduateProgram-FullStack-2023) to run locally.

## :gear: Build setup

Welcome! Here's a quick guide to getting started with `SkateHub Frontend`. Let's dive in:

### 👣 Step 1: Clone the repository

First things first, let's clone the repository onto your local machine. If you're not sure how to do this, no worries! Here's a simple command you can run in your terminal:

```bash
# clone the repository

git clone https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024.git
```

### 👣 Step 2: Navigate to the project directory

Once the repository is cloned, navigate into the project directory using the cd command in your terminal:

```bash
# navigate to the project directory

cd Frontend-GraduateProgram-FullStack-2024
```

### 👣 Step 3: Switch to the develop branch

Our development work usually happens in the develop branch. Make sure you're on the right branch by executing the following command:

```bash
# switch to the develop branch

git checkout develop
```

### 👣 Step 4: Configure environment variables

Before running the project, you'll need to configure the environment variables. This typically involves setting up database credentials and other configurations. Locate the `.env.example` file in the project root directory, and create a new file named `.env` with your configurations. You may need to consult the project documentation for the required variables.

```bash
# configure environment variables

cp .env.example .env.local
```

### 👣 Step 5: Install dependencies

Now that you're in the project directory and on the correct branch, it's time to install all the dependencies. Simply run:

```bash
# install dependencies
npm install
```

### 👣 Step 6: Run the project

You're almost there! To start the application in development mode, just type the following command:

```bash
# run at localhost:3000
npm run dev
```

And that's it! Your `SkateHub Frontend` should now be up and running locally on your [machine](http://localhost:3000).

## :memo: Changelog

### 2024

- 2024-12-12 - Update user avatar handling and modify user data structure [#99](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/99) _(v0.1.29)_
- 2024-12-07 - Add custom `404 error` page [#91](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/91) _(v0.1.28)_
- 2024-12-07 - Implement user profile update functionality in AuthContext [#89](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/89) _(v0.1.27)_
- 2024-12-07 - Create `textarea` form component [#88](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/88) _(v0.1.26)_
- 2024-11-19 - Add reCAPTCHA verification to sign-up process [#70](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/70) _(v0.1.25)_
- 2024-11-19 - Add Lint-Staged to enhance pre-commit validations [#65](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/65) _(v0.1.24)_
- 2024-11-19 - Create an API Route for the Sitemap [#62](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/62) _(v0.1.23)_
- 2024-11-13 - Add reCAPTCHA verification to sign-in process [#59](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/59) _(v0.1.22)_
- 2024-11-08 - Add Husky [#53](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/53) _(v0.1.21)_
- 2024-11-08 - Add vercel development deployment configuration [#31](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/31) _(v0.1.20)_
- 2024-11-06 - Add `forgot-password` button [#25](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/25) _(v0.1.19)_
- 2024-11-06 - Upgrade libraries [#23](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/23) _(v0.1.18)_
- 2024-11-06 - Create `reset password` page [#21](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/21) _(v0.1.17)_
- 2024-04-28 - Update `forgot-password` page [#20](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/20) _(v0.1.16)_
- 2024-04-28 - Redirect to the root route when attempting to access /auth [#19](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/19) _(v0.1.15)_
- 2024-04-28 - Create `forgot-password` page [#18](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/18) _(v0.1.14)_
- 2024-04-11 - Update `signin` page [#17](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/17) _(v0.1.13)_
- 2024-04-08 - Create `confirmation` page [#15](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/15) _(v0.1.12)_
- 2024-04-06 - Update `signin` page [#14](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/14) _(v0.1.11)_
- 2024-04-03 - Create `signup` page [#12](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/12) _(v0.1.10)_
- 2024-03-31 - Update `authentication` and `session` management [#11](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/11) _(v0.1.9)_
- 2024-03-29 - Create the `toast` component [#10](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/10) _(v0.1.8)_
- 2024-03-27 - Add the `favicon` [#9](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/9) _(v0.1.7)_
- 2024-03-27 - Add the `prettier.config.js` file to the project to handle with code formatter [#8](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/8) _(v0.1.6)_
- 2024-03-27 - Create the `signin` page [#7](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/7) _(v0.1.5)_
- 2024-03-26 - Create the `header` component [#5](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/5) _(v0.1.4)_
- 2024-03-26 - Create the `home` page [#4](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/4) _(v0.1.3)_
- 2024-03-26 - Create the `sidebar` provider and components to handle with the aside menu [#3](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/3) _(v0.1.2)_
- 2024-03-24 - Add [Chakra UI](https://chakra-ui.com/) to handle with the user interface [#2](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/2) _(v0.1.1)_
- 2024-03-19 - Add a quick guide to getting started with the application [#1](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/1) _(v0.1.0)_

## :rocket: Next.js documentation

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

---

Made with <span style="color: #6664F1;">&hearts;</span> in Brazil
