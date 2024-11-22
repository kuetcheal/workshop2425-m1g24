const pool = require('../config/dbConfig'); // Importation de la configuration de la base de données

// Créer une nouvelle adresse pour un patient
const createAdressePatient = async (req, res) => {
    let conn;
    const { adresse_1, adresse_2, ville, code_postal, pays, id_patient } = req.body;

    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            "INSERT INTO Adresses (adresse_1, adresse_2, ville, code_postal, pays, id_patient) VALUES (?, ?, ?, ?, ?, ?)",
            [adresse_1, adresse_2, ville, code_postal, pays, id_patient]
        );

        res.status(201).json('Adresse créée avec succès');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la création de l\'adresse' });
    } finally {
        if (conn) conn.release();
    }
};

// Récupérer toutes les adresses des patients avec des informations sur le patient
const getAllAdressesPatients = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        // Jointure avec la table Patients pour récupérer les informations des patients
        const [rows] = await conn.query(`
            SELECT a.*, p.nom AS patient_nom, p.prenom AS patient_prenom, p.email AS patient_email 
            FROM Adresses a
            LEFT JOIN Patients p ON a.id_patient = p.id
        `);

        res.status(200).json(rows); // Retourner toutes les adresses avec les informations des patients associés
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des adresses des patients' });
    } finally {
        if (conn) conn.release();
    }
};


// Récupérer toutes les adresses d'un patient
const getAdressesPatient = async (req, res) => {
    let conn;
    const id_patient = req.params.id;

    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query("SELECT * FROM Adresses WHERE id_patient = ?", [id_patient]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aucune adresse trouvée pour ce patient' });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des adresses' });
    } finally {
        if (conn) conn.release();
    }
};

// Mettre à jour une adresse d'un patient
const updateAdressePatient = async (req, res) => {
    let conn;
    const id = req.params.id; // ID de l'adresse à mettre à jour
    const { adresse_1, adresse_2, ville, code_postal, pays } = req.body;

    try {
        conn = await pool.getConnection();
        // Récupérons le résultat de la requête sans destructurer
        const result = await conn.query(
            "UPDATE Adresses SET adresse_1 = ?, adresse_2 = ?, ville = ?, code_postal = ?, pays = ? WHERE id = ?",
            [adresse_1, adresse_2, ville, code_postal, pays, id]
        );

        // Vérification si des lignes ont été affectées par la mise à jour
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Adresse non trouvée' });
        }

        res.status(200).json({ message: 'Adresse mise à jour avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'adresse' });
    } finally {
        if (conn) conn.release();
    }
};

// Supprimer une adresse d'un patient
const deleteAdressePatient = async (req, res) => {
    let conn;
    const id = req.params.id; // ID de l'adresse à supprimer

    try {
        conn = await pool.getConnection();
        // Ici, nous récupérons simplement le `result` sans destructurer
        const result = await conn.query("DELETE FROM Adresses WHERE id = ?", [id]);

        // Vérifions si le `affectedRows` est bien présent dans `result[0]` ou `result`
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Adresse non trouvée' });
        }

        res.status(200).json({ message: 'Adresse supprimée avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'adresse' });
    } finally {
        if (conn) conn.release();
    }
};

// Créer une nouvelle adresse pour un médecin
const createAdresseMedecin = async (req, res) => {
    let conn;
    const { adresse_1, adresse_2, ville, code_postal, pays, id_medecin } = req.body;

    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            "INSERT INTO Adresses_Medecin (adresse_1, adresse_2, ville, code_postal, pays, id_medecin) VALUES (?, ?, ?, ?, ?, ?)",
            [adresse_1, adresse_2, ville, code_postal, pays, id_medecin]
        );

        res.status(201).json('Adresse du médecin créée avec succès');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la création de l\'adresse du médecin' });
    } finally {
        if (conn) conn.release();
    }
};

// Récupérer toutes les adresses des médecins
const getAllAdressesMedecins = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query("SELECT * FROM Adresses_Medecin");

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des adresses des médecins' });
    } finally {
        if (conn) conn.release();
    }
};

// Récupérer toutes les adresses d'un médecin
const getAdressesMedecin = async (req, res) => {
    let conn;
    const id_medecin = req.params.id;

    try {
        conn = await pool.getConnection();
        // Exécuter la requête sans destructurer immédiatement
        const result = await conn.query("SELECT * FROM Adresses_Medecin WHERE id_medecin = ?", [id_medecin]);

        // Vérifier si le résultat contient des données
        const rows = result[0];
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Aucune adresse trouvée pour ce médecin' });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des adresses du médecin' });
    } finally {
        if (conn) conn.release();
    }
};


const updateAdresseMedecin = async (req, res) => {
    let conn;
    const id = req.params.id; // ID de l'adresse à mettre à jour
    const { adresse_1, adresse_2, ville, code_postal, pays } = req.body;

    try {
        conn = await pool.getConnection();
        
        // Exécution de la requête de mise à jour
        const result = await conn.query(
            "UPDATE Adresses_Medecin SET adresse_1 = ?, adresse_2 = ?, ville = ?, code_postal = ?, pays = ? WHERE id = ?",
            [adresse_1, adresse_2, ville, code_postal, pays, id]
        );

        // Vérification de result.affectedRows (au lieu de déstructurer)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Adresse non trouvée' });
        }

        res.status(200).json({ message: 'Adresse du médecin mise à jour avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'adresse du médecin' });
    } finally {
        if (conn) conn.release();
    }
};

// Supprimer une adresse d'un médecin
const deleteAdresseMedecin = async (req, res) => {
    let conn;
    const id = req.params.id; // ID de l'adresse à supprimer

    try {
        conn = await pool.getConnection();
        
        // La requête retourne un objet, pas un tableau
        const result = await conn.query("DELETE FROM Adresses_Medecin WHERE id = ?", [id]);

        // Vérification de result.affectedRows pour savoir si quelque chose a été supprimé
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Adresse non trouvée' });
        }

        res.status(200).json({ message: 'Adresse du médecin supprimée avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'adresse du médecin' });
    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    createAdressePatient,
    getAllAdressesPatients,
    getAdressesPatient,
    updateAdressePatient,
    deleteAdressePatient,
    createAdresseMedecin,
    getAllAdressesMedecins,
    getAdressesMedecin,
    updateAdresseMedecin,
    deleteAdresseMedecin,
};
