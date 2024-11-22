CREATE TABLE Medecins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),  -- Changement ici
    numero_RPPS VARCHAR(255),
    est_generaliste BOOLEAN,
    est_cardiologue BOOLEAN,
    est_dermatologue BOOLEAN,
    est_radiologue BOOLEAN,
    est_gynecologue BOOLEAN,
    est_neurologue BOOLEAN,
    est_ophtalmologue BOOLEAN,
    est_pediatre BOOLEAN,
    est_psychiatre BOOLEAN,
    est_urgentiste BOOLEAN,
    description VARCHAR(255)
);

CREATE TABLE Patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    authentification_carte_vitale BOOLEAN DEFAULT FALSE,
    numero_securite_sociale VARCHAR(15),
    date_naissance DATE,
    sexe ENUM('Homme', 'Femme', 'Autre'),  -- Considérer l'inclusivité
    telephone VARCHAR(20),  -- Changement ici
    est_abonne BOOLEAN,
    adresse_complete VARCHAR(255),
    description TEXT  -- Changement ici
);

CREATE TABLE Adresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adresse_1 VARCHAR(255) NOT NULL,
    adresse_2 VARCHAR(255),
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(20) NOT NULL,
    pays VARCHAR(100) NOT NULL,
    id_patient INT,
    FOREIGN KEY (id_patient) REFERENCES Patients(id) ON DELETE SET NULL
);

CREATE TABLE Adresses_Medecin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adresse_1 VARCHAR(255) NOT NULL,
    adresse_2 VARCHAR(255),
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(20) NOT NULL,
    pays VARCHAR(100) NOT NULL,
    id_medecin INT,
    FOREIGN KEY (id_medecin) REFERENCES Medecins(id) ON DELETE SET NULL
);

CREATE TABLE Maladies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    code_CIM VARCHAR(20),
    est_chronique BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Medicaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    principe_actif VARCHAR(255) NOT NULL,
    forme_pharmaceutique ENUM('Comprimé', 'Gélule', 'Sirop', 'Pommade', 'Injection'),
    dosage VARCHAR(50),
    indications TEXT,
    contre_indications TEXT,
    effets_secondaires TEXT
);

CREATE TABLE Medecin_Patient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_medecin INT,
    id_patient INT,
    date_debut_relation DATE NOT NULL,
    FOREIGN KEY (id_medecin) REFERENCES Medecins(id) ON DELETE CASCADE,
    FOREIGN KEY (id_patient) REFERENCES Patients(id) ON DELETE CASCADE
);

CREATE TABLE Patients_Maladies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT,
    id_maladie INT,
    date_diagnostique DATE,
    FOREIGN KEY (id_patient) REFERENCES Patients(id) ON DELETE CASCADE,
    FOREIGN KEY (id_maladie) REFERENCES Maladies(id) ON DELETE CASCADE
);

CREATE TABLE Traitements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_patient_maladie INT,
    id_medicament INT,
    date_prescription DATE,
    dose_a_prendre VARCHAR(50),
    nombre_de_fois INT,
    frequence_prise INT,
    FOREIGN KEY (id_patient_maladie) REFERENCES Patients_Maladies(id) ON DELETE CASCADE,
    FOREIGN KEY (id_medicament) REFERENCES Medicaments(id) ON DELETE CASCADE 
);

CREATE TABLE Abonnements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    duree_en_jours INT NOT NULL,
    est_actif BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Patient_Abonnement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT,
    id_abonnement INT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    est_actif BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_patient) REFERENCES Patients(id) ON DELETE CASCADE,
    FOREIGN KEY (id_abonnement) REFERENCES Abonnements(id) ON DELETE CASCADE
);

CREATE TABLE Paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_patient_abonnement INT,
    montant DECIMAL(10, 2) NOT NULL,
    date_paiement DATE NOT NULL,
    mode_de_paiement ENUM('Carte de crédit', 'PayPal', 'Virement', 'Autre') NOT NULL,
    statut ENUM('Effectué', 'Échoué', 'En attente') NOT NULL,
    FOREIGN KEY (id_patient_abonnement) REFERENCES Patient_Abonnement(id) ON DELETE CASCADE
);

-- Insertion de 25 enregistrements dans la table Maladies
INSERT INTO Maladies (nom, description, code_CIM, est_chronique) VALUES
('Diabète de type 1', 'Maladie auto-immune affectant la production insuline.', 'E10', TRUE),
('Diabète de type 2', 'Trouble métabolique provoquant une hyperglycémie chronique.', 'E11', TRUE),
('Asthme', 'Maladie respiratoire causant une inflammation des voies aériennes.', 'J45', TRUE),
('Hypertension artérielle', 'Augmentation chronique de la pression sanguine.', 'I10', TRUE),
('Maladie de Crohn', 'Inflammation chronique du système digestif.', 'K50', TRUE),
('Sclérose en plaques', 'Maladie auto-immune affectant le système nerveux central.', 'G35', TRUE),
('Anémie', 'Diminution du nombre de globules rouges.', 'D50', FALSE),
('Insuffisance cardiaque', 'Incapacité du cœur à pomper le sang correctement.', 'I50', TRUE),
('Migraine', 'Céphalées récurrentes, souvent accompagnées de nausées.', 'G43', FALSE),
('Bronchite aiguë', 'Inflammation aiguë des bronches.', 'J20', FALSE),
('Cirrhose hépatique', 'Destruction progressive du foie.', 'K74', TRUE),
('Pneumonie', 'Infection pulmonaire causée par des bactéries, des virus ou des champignons.', 'J18', FALSE),
('Tuberculose', 'Maladie infectieuse pulmonaire causée par le bacille de Koch.', 'A15', TRUE),
('Angine de poitrine', 'Douleur thoracique due à une réduction de apport sanguin au cœur.', 'I20', FALSE),
('Arthrite rhumatoïde', 'Inflammation chronique des articulations.', 'M05', TRUE),
('Sinusite', 'Inflammation des sinus paranasaux.', 'J32', FALSE),
('Malaria', 'Maladie infectieuse transmise par les moustiques.', 'B50', FALSE),
('COVID-19', 'Infection virale provoquée par le coronavirus SARS-CoV-2.', 'U07.1', FALSE),
('Cancer du poumon', 'Tumeur maligne dans les poumons.', 'C34', TRUE),
('Hépatite B', 'Infection virale chronique du foie.', 'B18.1', TRUE),
('Hépatite C', 'Infection virale du foie, souvent asymptomatique.', 'B18.2', TRUE),
('Grippe', 'Infection virale des voies respiratoires.', 'J10', FALSE),
('Varicelle', 'Infection virale courante chez les enfants.', 'B01', FALSE),
('Gastro-entérite', 'Inflammation de estomac et des intestins, souvent causée par une infection.', 'A09', FALSE),
('Infarctus du myocarde', 'Mort des cellules du muscle cardiaque due à un manque oxygène.', 'I21', FALSE);

-- Insertion de 25 enregistrements dans la table Medicaments
INSERT INTO Medicaments (nom, principe_actif, forme_pharmaceutique, dosage, indications, contre_indications, effets_secondaires) VALUES
('Paracétamol', 'Paracétamol', 'Comprimé', '500mg', 'Douleur légère à modérée, fièvre', 'Insuffisance hépatique', 'Nausées, éruptions cutanées'),
('Ibuprofène', 'Ibuprofène', 'Comprimé', '400mg', 'Douleur, inflammation', 'Ulcères gastro-intestinaux', 'Douleurs gastriques, nausées'),
('Amoxicilline', 'Amoxicilline', 'Gélule', '500mg', 'Infections bactériennes', 'Allergie à la pénicilline', 'Diarrhée, éruption cutanée'),
('Oméprazole', 'Oméprazole', 'Comprimé', '20mg', 'Reflux gastro-œsophagien', 'Hypersensibilité', 'Maux de tête, diarrhée'),
('Salbutamol', 'Salbutamol', 'Sirop', '2mg/5ml', 'Asthme, bronchospasmes', 'Cardiopathies sévères', 'Tachycardie, tremblements'),
('Metformine', 'Metformine', 'Comprimé', '500mg', 'Diabète de type 2', 'Insuffisance rénale', 'Nausées, diarrhée'),
('Prednisone', 'Prednisone', 'Comprimé', '5mg', 'Inflammations', 'Infections actives', 'Rétention eau, hyperglycémie'),
('Aspirine', 'Acide acétylsalicylique', 'Comprimé', '100mg', 'Douleurs, fièvre, prévention des AVC', 'Ulcères gastro-intestinaux', 'Saignements, douleurs gastriques'),
('Loratadine', 'Loratadine', 'Comprimé', '10mg', 'Allergies', 'Hypersensibilité', 'Somnolence, maux de tête'),
('Clarithromycine', 'Clarithromycine', 'Gélule', '250mg', 'Infections respiratoires', 'Hypersensibilité', 'Diarrhée, nausées'),
('Fluconazole', 'Fluconazole', 'Gélule', '150mg', 'Infections fongiques', 'Insuffisance hépatique', 'Maux de tête, douleurs abdominales'),
('Diclofénac', 'Diclofénac', 'Pommade', '1%', 'Douleur et inflammation locales', 'Ulcères cutanés', 'Irritation locale, rougeur'),
('Insuline glargine', 'Insuline glargine', 'Injection', '100U/ml', 'Diabète', 'Hypoglycémie sévère', 'Hypoglycémie, réactions au site injection'),
('Furosemide', 'Furosemide', 'Comprimé', '40mg', 'Insuffisance cardiaque, œdème', 'Anurie', 'Déséquilibres électrolytiques'),
('Levothyroxine', 'Levothyroxine', 'Comprimé', '100µg', 'Hypothyroïdie', 'Hyperthyroïdie', 'Palpitations, perte de poids'),
('Hydrocortisone', 'Hydrocortisone', 'Pommade', '1%', 'Inflammation cutanée', 'Infections cutanées', 'Irritation locale, amincissement de la peau'),
('Ciprofloxacine', 'Ciprofloxacine', 'Comprimé', '500mg', 'Infections bactériennes', 'Tendinite, insuffisance rénale', 'Nausées, diarrhée'),
('Azithromycine', 'Azithromycine', 'Gélule', '250mg', 'Infections bactériennes', 'Insuffisance hépatique', 'Nausées, douleurs abdominales'),
('Tramadol', 'Tramadol', 'Comprimé', '50mg', 'Douleurs sévères', 'Insuffisance respiratoire', 'Somnolence, nausées'),
('Morphine', 'Morphine', 'Injection', '10mg/ml', 'Douleur sévère', 'Dépression respiratoire', 'Somnolence, nausées, constipation'),
('Captopril', 'Captopril', 'Comprimé', '25mg', 'Hypertension', 'Angioœdème', 'Toux, hypotension'),
('Diazépam', 'Diazépam', 'Comprimé', '5mg', 'Anxiété, convulsions', 'Insuffisance respiratoire', 'Somnolence, dépendance'),
('Warfarine', 'Warfarine', 'Comprimé', '5mg', 'Prévention des thromboses', 'Troubles de la coagulation', 'Saignements'),
('Simvastatine', 'Simvastatine', 'Comprimé', '20mg', 'Hypercholestérolémie', 'Insuffisance hépatique', 'Douleurs musculaires, maux de tête'),
('Zolpidem', 'Zolpidem', 'Comprimé', '10mg', 'Insomnie', 'Insuffisance respiratoire', 'Somnolence, confusion');