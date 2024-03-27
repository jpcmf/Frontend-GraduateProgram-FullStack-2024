<h1 align="center">
    <img alt="SkateHub" title="SkateHub" src=".github/skatehub.svg" />
</h1>

<p align="center">
  <a href="#gear-build-setup">Build setup</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#memo-changelog">Changelog</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#rocket-nextjs-documentation">Next.js documentation</a>
</p>

## SkateHub Frontend powered by Next.js

The project requires [Node.js](https://nodejs.org) and [Backend-GraduateProgram-FullStack-2023](https://github.com/jpcmf/Backend-GraduateProgram-FullStack-2023) to run locally.

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

- 2024-03-27 - Add the `favicon` of the SkateHub project [#9](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/9) _(v0.1.7)_
- 2024-03-27 - Add the `prettier.config.js` file to the project to handle with code formatter [#8](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/8) _(v0.1.6)_
- 2024-03-27 - Create the `signin` page of the SkateHub project [#7](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/7) _(v0.1.5)_
- 2024-03-26 - Create the `header` component [#5](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/5) _(v0.1.4)_
- 2024-03-26 - Create the `home` page of the SkateHub project [#4](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/4) _(v0.1.3)_
- 2024-03-26 - Create the `sidebar` provider and components to handle with the aside menu [#3](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/3) _(v0.1.2)_
- 2024-03-24 - Add [Chakra UI](https://chakra-ui.com/) to handle with the user interface [#2](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/2) _(v0.1.1)_
- 2024-03-19 - Add a quick guide to getting started with the application [#1](https://github.com/jpcmf/Frontend-GraduateProgram-FullStack-2024/pull/1) _(v0.1.0)_

## :rocket: Next.js documentation

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

---

Made with 💙 by João Paulo Fricks
