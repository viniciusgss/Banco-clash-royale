# 📦 Clash Royale Stats

A website to display analytics made with Clash Royale API data.

## 📸 Demo

![Print do Projeto](printclash.PNG)

---

## 📜 Description
The page of the project was built with pure HTML, CSS and JavaScript. And the graphs were made with the chart.js library.

Our Node.js API was developed with express, cors, helmet and morgan.

The API make queries to a MongoDB database. Each query have it own pipeline, that filters some clash royale battle info to return to the user with useful graphs to better understanding.

All the Clash Royale battle data was taken from the [Clash Royale API](https://developer.clashroyale.com/#/)

## 🛠️ Installation Guide

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Installation - Backend

Clone the repository:

```bash
git clone https://github.com/viniciusgss/Banco-clash-royale.git
cd Banco-clash-royale
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Set up environment variables:

```bash
cp .env.example .env
# edit the .env file as needed
# MONGODB_URI
# PORT
```

Run the project:

```bash
npm run start
# or
yarn start
```

### Installation - Frontend

Clone the repository:

```bash
git clone https://github.com/viniciusgss/Banco-clash-royale.git
cd Banco-clash-royale
```

Open with Live Server

## 📘 API Reference
You can access the documentation in the [API_REFERENCE.md](API_REFERENCE.md) file.

## 🤝 Contribution Guide

### How to Contribute

1. Fork the project
2. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: your feature description'
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

### Guidelines

- Commits: Use [Conventional Commits](https://www.conventionalcommits.org/)
- Code: Follow linting best practices (ESLint, Prettier, etc.)
- Docs: Update the README and/or API comments if needed

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋 Questions?

Open an [issue](https://github.com/viniciusgss/Banco-clash-royale/issues) or contact me via [email](mailto:Viniciusgss22@gmail.com).
