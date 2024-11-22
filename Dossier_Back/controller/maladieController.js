const pool = require('../config/dbConfig'); // Importation de la configuration de la base de données

// Récupérer toutes les maladies
const getAllMaladies = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        
        // Récupérer toutes les maladies
        const [maladies] = await conn.query("SELECT * FROM Maladies;");
        // Compter le nombre total de maladies
        const [[{ count }]] = await conn.query("SELECT COUNT(*) AS count FROM Maladies;");

        // Vérifiez si des enregistrements ont été récupérés
        if (maladies.length === 0) {
            return res.status(404).json({ message: 'Aucune maladie trouvée' });
        }

        res.status(200).json({ total: count, maladies }); // Retourne le nombre total et les maladies
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des maladies' });
    } finally {
        if (conn) conn.release();
    }
};


// Récupérer tous les médicaments
const getAllMedicaments = async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query("SELECT * FROM Medicaments");

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des médicaments' });
    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    getAllMaladies,
    getAllMedicaments,
};
