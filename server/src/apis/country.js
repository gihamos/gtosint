import axios from 'axios';
import Country from '../models/country.js';
import debug from 'debug';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const logger = debug('back:api:country');

// Récupérer l'URL de l'API REST Countries depuis les variables d'environnement
const REST_COUNTRIES_URL = process.env.REST_COUNTRIES_URL;

/**
 * Récupère la liste des pays depuis l'API REST Countries.
 * @returns {Array} Liste des pays ou un tableau vide en cas d'erreur.
 */
export const fetchCountries = async () => {
  try {
    const response = await axios.get(REST_COUNTRIES_URL);
    return response.data;
  } catch (error) {
    logger('Erreur lors de la récupération des pays:', error);
    return [];
  }
};

/**
 * Sauvegarde la liste des pays dans la base de données MongoDB.
 * Vérifie si un pays est déjà présent avant de l'ajouter.
 * @param {Array} countries - Liste des pays à enregistrer.
 */
export const saveCountries = async (countries) => {
  for (const country of countries) {
    try {
      // Extraction des informations utiles du pays
      const name = country.name.common;
      const alpha2Code = country.cca2;
      const alpha3Code = country.cca3;
      const flagUrl = country.flags?.svg || country.flags?.png || '';
      const region = country.region || '';
      const subregion = country.subregion || '';
      const population = country.population || 0;
      const languages = country.languages ? Object.values(country.languages) : [];
      const currencies = country.currencies ? Object.keys(country.currencies) : [];

      // Vérification si le pays existe déjà en base de données
      const existingCountry = await Country.findOne({ alpha3Code });

      if (!existingCountry) {
        // Création d'un nouvel enregistrement pour le pays
        const newCountry = new Country({
          name,
          alpha2Code,
          alpha3Code,
          flagUrl,
          region,
          subregion,
          population,
          languages,
          currencies
        });

        logger(`Sauvegarde de ${newCountry.name} (${newCountry.alpha3Code})`);
        await newCountry.save();
      }
    } catch (error) {
      logger(`Erreur lors de l'ajout de ${country.name.common}:`, error);
    }
  }
};

/**
 * Synchronise les pays en récupérant les données depuis l'API
 * et en les enregistrant dans la base de données.
 */
export const syncCountries = async () => {
  const countries = await fetchCountries();
  logger(`Nombre de pays récupérés : ${countries.length}`);

  await saveCountries(countries);
  logger('Mise à jour terminée');
};

/**
 * Recherche un pays en fonction d'une chaîne de caractères (nom partiel ou complet).
 * @param {string} s - Chaîne de recherche.
 * @returns {Array|null} Liste des pays correspondants ou null si aucun résultat.
 */
export const searchCountryByString = async (s) => {
  try {
    const pays = await Country.find({ name: { $regex: s, $options: 'i' } }).limit(10);

    if (pays.length > 0) {
      logger('Pays correspondants :', pays);
      return pays;
    } else {
      logger('Aucun pays trouvé correspondant à la recherche');
      return null;
    }
  } catch (error) {
    logger('Erreur lors de la récupération des pays correspondants:', error);
    return null;
  }
};
