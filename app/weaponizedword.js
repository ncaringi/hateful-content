const axios = require('axios');
const formData = require('form-data');
const fs = require('fs');

const apiConnection = async () => {
   try {
      const body = new formData();
      body.append('api_key', process.env.API_KEY_WEAPONIZEDWORD);
      const response = await axios.post('https://api.weaponizedword.org/lexicons/1-0/authenticate', body);
      const token = response.data.result.token;
      console.log('Token récupéré');
      return token;
   } catch (error) {
      if (error.response) {
         console.error("Erreur API :", error.response.data); // Message d'erreur détaillé
         console.error("Code HTTP :", error.response.status);
      } else {
         console.error("Erreur inconnue :", error.message);
      }
      console.error("Erreur lors de la récupération du token :", error);
      throw error;
   }
};

const getDerogatory = async (page, token) => {
   try {
      const body = new formData();
      body.append('token', token);
      body.append('page', page);
      body.append('language_id', 'fra');
      const response = await axios.post('https://api.weaponizedword.org/lexicons/1-0/get_derogatory', body);
      console.log('Lexique derogatory récupéré');
      return response
   } catch (error) {
      console.error("Erreur lors de la récuparation du lexique derogatory :", error);
   }
};
const getDiscriminatory = async (page, token) => {
   try {
      const body = new formData();
      body.append('token', token);
      body.append('page', page);
      body.append('language_id', 'fra');
      const response = await axios.post('https://api.weaponizedword.org/lexicons/1-0/get_discriminatory', body);
      console.log('Lexique discriminatory récupéré');
      return response
   } catch (error) {
      console.error("Erreur lors de la récuparation du lexique discriminatory :", error);
   }
};
const getThreatening = async (page, token) => {
   try {
      const body = new formData();
      body.append('token', token);
      body.append('page', page);
      body.append('language_id', 'fra');
      const response = await axios.post('https://api.weaponizedword.org/lexicons/1-0/get_threatening', body);
      console.log('Lexique threatening récupéré');
      return response
   } catch (error) {
      console.error("Erreur lors de la récuparation du lexique threatening :", error);
   }
};
const getWatchwords = async (page, token) => {
   try {
      const body = new formData();
      body.append('token', token);
      body.append('page', page);
      body.append('language_id', 'fra');
      const response = await axios.post('https://api.weaponizedword.org/lexicons/1-0/get_watchwords', body);
      console.log('Lexique watchwords récupéré');
      return response
   } catch (error) {
      console.error("Erreur lors de la récuparation du lexique watchwords :", error);
   }
};

const lexiconsRetrieval = async () => {
   try {
      const token = await apiConnection();
      const actions = [getDerogatory, getDiscriminatory, getThreatening, getWatchwords];
      for (let i = 0; i < actions.length; i++) {
         console.log('i :', i);
         let number_of_pages = 1;
         const lexiconData = [];

         for (let j = 1; j <= number_of_pages; j++) {
            console.log('j :', j);
            const response = await actions[i](j, token);
            number_of_pages = response.data.number_of_pages;
            lexiconData.push(response.data.result);
         }
         console.log('/!\ Lexicon data :', lexiconData);
         const actionName = actions[i].name;
         fs.writeFileSync(`./lexicons/lexicon_${actionName}.json`, JSON.stringify(lexiconData));
      }
   } catch (error) {
      console.error("Erreur lors de la récupération des lexiques :", error);
   }
}

module.exports = { lexiconsRetrieval };
