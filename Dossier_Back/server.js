const express = require('express');
const routes = require('./routes/routes');
const cors = require('cors'); // Importer CORS
const session = require('express-session'); // Importer express-session
const { isAuthenticated } = require('./middleware/auth'); // Importer le middleware d'authentification
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Pour gérer les requêtes JSON

// Configuration des sessions
app.use(session({
  secret: process.env.SESSION_SECRET || '7p$A2w!nJ@fH9k%z', // Remplace par un secret fort
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Met à true si tu utilises HTTPS
}));

app.use(cors({
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
  credentials: true
}));

// Routes publiques (comme la connexion)
app.use('/', routes);

// Appliquer le middleware d'authentification uniquement aux routes protégées
app.use(isAuthenticated); // Cela appliquera le middleware d'authentification

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
