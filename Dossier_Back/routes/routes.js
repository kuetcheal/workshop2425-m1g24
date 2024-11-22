const express = require('express');
const router = express.Router();

// Importer tous les contrôleurs nécessaires
const medecinController = require('../controller/medecinController');
const patientController = require('../controller/patientController');
const adresseController = require('../controller/adresseController');
const maladieController = require('../controller/maladieController');
const { isAuthenticated } = require('../middleware/auth'); // Middleware d'authentification

// Routes pour les médecins
router.get('/medecins', medecinController.getAllMedecins);
router.get('/medecins/:id', medecinController.getMedecinById);
router.post('/medecins', isAuthenticated, medecinController.createMedecin);
router.put('/medecins/:id', isAuthenticated, medecinController.updateMedecin);
router.delete('/medecins/:id', isAuthenticated, medecinController.deleteMedecin);

// Routes pour les patients
router.get('/patients', patientController.getAllPatients);
router.get('/patients/:id', patientController.getPatientById);
router.post('/patients', patientController.createPatient);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);
router.post('/login', patientController.loginPatient);
router.post('/login', patientController.logoutPatient);

// Routes pour les adresses patients
router.post('/adresses/patient', adresseController.createAdressePatient);
router.get('/adresses/patients', adresseController.getAllAdressesPatients);
router.get('/adresses/patient/:id', adresseController.getAdressesPatient);
router.put('/adresses/patient/:id', adresseController.updateAdressePatient);
router.delete('/adresses/patient/:id', adresseController.deleteAdressePatient);

// Routes pour les adresses médecins
router.post('/adresses/medecin', adresseController.createAdresseMedecin);
router.get('/adresses/medecins', adresseController.getAllAdressesMedecins);
router.get('/adresses/medecin/:id', adresseController.getAdressesMedecin);
router.put('/adresses/medecin/:id', adresseController.updateAdresseMedecin);
router.delete('/adresses/medecin/:id', adresseController.deleteAdresseMedecin);

// Routes pour les maladies
router.get('/maladies', maladieController.getAllMaladies);
router.get('/medicaments', maladieController.getAllMedicaments);

// Exporter le routeur pour l'utiliser dans l'application principale
module.exports = router;
