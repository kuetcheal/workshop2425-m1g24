const pool = require('../config/dbConfig'); // Importation de la configuration de la base de données

// Obtenir tous les médecins
const getAllMedecins = async (req, res) => {
    let conn; // Déclaration de la variable pour la connexion à la base de données
    try {
        conn = await pool.getConnection(); // Obtenir une connexion à la base de données
        const [rows] = await conn.query("SELECT * FROM Medecins"); // Exécuter la requête SQL pour sélectionner tous les médecins
        res.status(200).json(rows); // Retourner les résultats sous forme de JSON avec un statut 200 (OK)
    } catch (err) {
        console.error(err); // Afficher l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la récupération des médecins' }); // Gérer les erreurs avec un statut 500 (Erreur interne du serveur)
    } finally {
        if (conn) conn.release(); // Libérer la connexion à la base de données
    }
};

// Obtenir un médecin par ID
const getMedecinById = async (req, res) => {
    let conn; // Déclaration de la variable pour la connexion à la base de données
    const id = req.params.id; // Récupérer l'ID du médecin à partir des paramètres de la requête
    try {
        conn = await pool.getConnection(); // Obtenir une connexion à la base de données
        const [rows] = await conn.query("SELECT * FROM Medecins WHERE id = ?", [id]); // Exécuter la requête SQL pour obtenir le médecin par ID
        if (rows.length === 0) { // Vérifier si aucun médecin n'est trouvé
            return res.status(404).json({ message: 'Médecin non trouvé' }); // Retourner un statut 404 si le médecin n'est pas trouvé
        }
        res.status(200).json(rows); // Retourner le médecin trouvé sous forme de JSON avec un statut 200 (OK)
    } catch (err) {
        console.error(err); // Afficher l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la récupération du médecin' }); // Gérer les erreurs avec un statut 500
    } finally {
        if (conn) conn.release(); // Libérer la connexion à la base de données
    }
};

// Créer un nouveau médecin
const createMedecin = async (req, res) => {
    let conn; // Déclaration de la variable pour la connexion à la base de données
    const { nom, prenom, email, mot_de_passe, telephone, numero_RPPS, est_generaliste, est_cardiologue, est_dermatologue, est_radiologue, est_gynecologue, est_neurologue, est_ophtalmologue, est_pediatre, est_psychiatre, est_urgentiste, description } = req.body; // Récupérer les données du médecin à partir du corps de la requête

    try {
        conn = await pool.getConnection(); // Obtenir une connexion à la base de données
        const result = await conn.query(
            "INSERT INTO Medecins (nom, prenom, email, mot_de_passe, telephone, numero_RPPS, est_generaliste, est_cardiologue, est_dermatologue, est_radiologue, est_gynecologue, est_neurologue, est_ophtalmologue, est_pediatre, est_psychiatre, est_urgentiste, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [nom, prenom, email, mot_de_passe, telephone, numero_RPPS, est_generaliste, est_cardiologue, est_dermatologue, est_radiologue, est_gynecologue, est_neurologue, est_ophtalmologue, est_pediatre, est_psychiatre, est_urgentiste, description] // Insérer le nouveau médecin dans la base de données
        );

        // Vérifiez si le résultat est valide
        if (result && result.affectedRows > 0) {
            // Si l'insertion est réussie, retourner l'ID du nouveau médecin
            res.status(201).json('Médecin créé avec succès'); // Retourner l'ID du nouveau médecin avec un statut 201 (Créé)
        } else {
            // Si l'insertion échoue pour une raison quelconque
            res.status(400).json({ error: 'Erreur lors de la création du médecin' });
        }
    } catch (err) {
        console.error(err); // Afficher l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la création du médecin' }); // Gérer les erreurs avec un statut 500
    } finally {
        if (conn) conn.release(); // Libérer la connexion à la base de données
    }
};

// Mettre à jour un médecin
const updateMedecin = async (req, res) => {
    let conn; // Déclaration de la variable pour la connexion à la base de données
    const id = req.params.id; // Récupérer l'ID du médecin à partir des paramètres de la requête
    const { nom, prenom, email, mot_de_passe, telephone, numero_RPPS, est_generaliste, est_cardiologue, est_dermatologue, est_radiologue, est_gynecologue, est_neurologue, est_ophtalmologue, est_pediatre, est_psychiatre, est_urgentiste, description } = req.body; // Récupérer les données à partir du corps de la requête

    try {
        conn = await pool.getConnection(); // Obtenir une connexion à la base de données
        const result = await conn.query(
            "UPDATE Medecins SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, telephone = ?, numero_RPPS = ?, est_generaliste = ?, est_cardiologue = ?, est_dermatologue = ?, est_radiologue = ?, est_gynecologue = ?, est_neurologue = ?, est_ophtalmologue = ?, est_pediatre = ?, est_psychiatre = ?, est_urgentiste = ?, description = ? WHERE id = ?",
            [nom, prenom, email, mot_de_passe, telephone, numero_RPPS, est_generaliste, est_cardiologue, est_dermatologue, est_radiologue, est_gynecologue, est_neurologue, est_ophtalmologue, est_pediatre, est_psychiatre, est_urgentiste, description, id] // Mettre à jour le médecin dans la base de données
        );

        // Vérifiez si 'result' a la propriété 'affectedRows' 
        if (result.affectedRows === 0) { // Vérifier si aucun médecin n'est affecté par la mise à jour
            return res.status(404).json({ message: 'Médecin non trouvé' }); // Retourner un statut 404 si le médecin n'est pas trouvé
        }

        res.status(200).json({ message: 'Médecin mis à jour avec succès' }); // Retourner un message de succès avec un statut 200 (OK)
    } catch (err) {
        console.error(err); // Afficher l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la mise à jour du médecin' }); // Gérer les erreurs avec un statut 500
    } finally {
        if (conn) conn.release(); // Libérer la connexion à la base de données
    }
};

// Supprimer un médecin
const deleteMedecin = async (req, res) => {
    let conn; // Déclaration de la variable pour la connexion à la base de données
    const id = req.params.id; // Récupérer l'ID du médecin à partir des paramètres de la requête

    try {
        conn = await pool.getConnection(); // Obtenir une connexion à la base de données
        const result = await conn.query("DELETE FROM Medecins WHERE id = ?", [id]); // Exécuter la requête SQL pour supprimer le médecin

        if (result.affectedRows === 0) { // Vérifier si aucun médecin n'est affecté par la suppression
            return res.status(404).json({ message: 'Médecin non trouvé' }); // Retourner un statut 404 si le médecin n'est pas trouvé
        }

        res.status(200).json({ message: 'Médecin supprimé avec succès' }); // Retourner un message de succès avec un statut 200 (OK)
    } catch (err) {
        console.error(err); // Afficher l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la suppression du médecin' }); // Gérer les erreurs avec un statut 500
    } finally {
        if (conn) conn.release(); // Libérer la connexion à la base de données
    }
};


// Exporter les fonctions du contrôleur pour les utiliser dans les routes
module.exports = { getAllMedecins, getMedecinById, createMedecin, updateMedecin, deleteMedecin };
