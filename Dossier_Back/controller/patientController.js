const pool = require('../config/dbConfig'); // Importation de la configuration de la base de données
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Obtenir tous les patients
const getAllPatients = async (req, res) => {
    let conn; // Déclaration de la variable pour la connexion à la base de données
    try {
        conn = await pool.getConnection(); // Obtenir une connexion à la base de données
        const [rows] = await conn.query("SELECT * FROM Patients"); // Exécuter la requête SQL pour sélectionner tous les patients
        res.status(200).json(rows); // Retourner les résultats sous forme de JSON avec un statut 200 (OK)
    } catch (err) {
        console.error(err); // Afficher l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la récupération des patients' }); // Gérer les erreurs avec un statut 500 (Erreur interne du serveur)
    } finally {
        if (conn) conn.release(); // Libérer la connexion à la base de données
    }
};

// Obtenir un patient par ID
const getPatientById = async (req, res) => {
    let conn;
    const id = req.params.id;

    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query("SELECT * FROM Patients WHERE id = ?", [id]);


        if (rows.length === 0) {
            return res.status(404).json({ message: 'Patient non trouvé' });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du patient' });
    } finally {
        if (conn) conn.release();
    }
};


// Créer un nouveau patient
const createPatient = async (req, res) => {
    let conn; // Déclaration de la variable pour la connexion à la base de données
    const { nom, prenom, email, mot_de_passe, authentification_carte_vitale, numero_securite_sociale, date_naissance, sexe, telephone, est_abonne, adresse_complete, description } = req.body; // Récupérer les données du patient à partir du corps de la requête

    try {
        conn = await pool.getConnection(); // Obtenir une connexion à la base de données
        const result = await conn.query(
            "INSERT INTO Patients (nom, prenom, email, mot_de_passe, authentification_carte_vitale, numero_securite_sociale, date_naissance, sexe, telephone, est_abonne, adresse_complete, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [nom, prenom, email, mot_de_passe, authentification_carte_vitale, numero_securite_sociale, date_naissance, sexe, telephone, est_abonne, adresse_complete, description] // Insérer le nouveau patient dans la base de données
        );

        // Configuration du transporteur de courriers
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Remplacez par le serveur SMTP de votre fournisseur
            port: 587, // Utilisez 465 pour SSL
            secure: false, // true pour 465, false pour les autres ports
            auth: {
                user: 'workshop2425.m1g24@gmail.com', // Votre adresse e-mail
                pass: 'zkta aszu aabj rdlo', // Votre mot de passe
            },
        });

        // Définir les options de l'e-mail
        let mailOptions = {
            from: '"Nom de l\'expéditeur" <votre_email@example.com>', // Adresse de l'expéditeur
            to: email, // Adresse e-mail du patient
            subject: 'Inscription réussie', // Sujet de l'e-mail
            text: `Bonjour ${prenom},\n\nVotre inscription en tant que patient a été réussie.\n\nCordialement,\nL'équipe de santé`, // Corps de l'e-mail en texte brut
            html: `<b>Bonjour ${prenom},</b><br><br>Votre inscription en tant que patient a été réussie.<br><br>Cordialement,<br>L'équipe de santé`, // Corps de l'e-mail en HTML
        };

        // Envoyer l'e-mail
        await transporter.sendMail(mailOptions);

        res.status(201).json('Patient créé avec succès'); // Retourner un message de succès avec un statut 201 (Créé)
    } catch (err) {
        console.error(err); // Afficher l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la création du patient' }); // Gérer les erreurs avec un statut 500
    } finally {
        if (conn) conn.release(); // Libérer la connexion à la base de données
    }
};

// Mettre à jour un patient
const updatePatient = async (req, res) => {
    let conn;
    const id = req.params.id;
    const { nom, prenom, email, mot_de_passe, authentification_carte_vitale, numero_securite_sociale, date_naissance, sexe, telephone, est_abonne, adresse_complete, description } = req.body;

    try {
        conn = await pool.getConnection(); // Obtenir une connexion à la base de données
        const result = await conn.query(
            "UPDATE Patients SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, authentification_carte_vitale = ?, numero_securite_sociale = ?, date_naissance = ?, sexe = ?, telephone = ?, est_abonne = ?, adresse_complete = ?, description = ? WHERE id = ?",
            [nom, prenom, email, mot_de_passe, authentification_carte_vitale, numero_securite_sociale, date_naissance, sexe, telephone, est_abonne, adresse_complete, description, id]
        );

        // Vérifier si aucune ligne n'a été affectée par la mise à jour
        if (result.affectedRows === 0) { 
            return res.status(404).json({ message: 'Patient non trouvé' }); // Retourner un statut 404 si le patient n'est pas trouvé
        }

        res.status(200).json({ message: 'Patient mis à jour avec succès' }); // Retourner un message de succès avec un statut 200 (OK)
    } catch (err) {
        console.error(err); // Afficher l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la mise à jour du patient' }); // Gérer les erreurs avec un statut 500
    } finally {
        if (conn) conn.release(); // Libérer la connexion à la base de données
    }
};


// Supprimer un patient
const deletePatient = async (req, res) => {
    let conn;
    const id = req.params.id;

    try {
        conn = await pool.getConnection(); // Obtenir une connexion à la base de données
        const result = await conn.query("DELETE FROM Patients WHERE id = ?", [id]); // Exécuter la requête SQL pour supprimer le patient

        // Vérifier si aucune ligne n'a été affectée par la suppression
        if (result.affectedRows === 0) { 
            return res.status(404).json({ message: 'Patient non trouvé' }); // Retourner un statut 404 si le patient n'est pas trouvé
        }

        res.status(200).json({ message: 'Patient supprimé avec succès' }); // Retourner un message de succès avec un statut 200 (OK)
    } catch (err) {
        console.error(err); // Afficher l'erreur dans la console
        res.status(500).json({ error: 'Erreur lors de la suppression du patient' }); // Gérer les erreurs avec un statut 500
    } finally {
        if (conn) conn.release(); // Libérer la connexion à la base de données
    }
};

const loginPatient = async (req, res) => {
    let conn;
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }

    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query("SELECT * FROM Patients WHERE email = ?", [email]);

        if (!rows || rows.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const patient = rows; // Récupérer le premier patient retourné

        // Comparer le mot de passe fourni avec le mot de passe en clair
        if (mot_de_passe !== patient.mot_de_passe) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Créer la session
        req.session.patientId = patient.id; // Stocke l'ID du patient dans la session
        res.status(200).json({ message: 'Connexion réussie', patient: { email: patient.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la tentative de connexion' });
    } finally {
        if (conn) conn.release();
    }
};



const logoutPatient = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
        }
        res.status(200).json({ message: 'Déconnexion réussie' });
    });
};



// Assurez-vous d'exporter cette fonction
module.exports = { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient, loginPatient, logoutPatient };

