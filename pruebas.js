const axios = require('axios');
const addLead = async (numero,nombre,email,Descripcion) => {
  try {
    const response = await axios.post(
      'https://www.zohoapis.com/crm/v2/Leads',
      {
        data: [{
          Company: 'Comercio conversacional',
          Last_Name: nombre,
          //First_Name: nombre,
          Email: email,
          Title: 'El cliente no cumple con las preguntas filtro',
          Phone: numero,
          Mobile: numero,
          Description: Descripcion
        }],
        trigger: [
          'approval',
          'workflow',
          'blueprint',
        ],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken 1000.b41cae95a935a634075b353067e2714c.0c18eb620be37db80f66d8e0c9e5e5bd` 
        },
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error en la funcion:', error);
    throw error; // Rethrow the error to be caught in the calling function
  }
};

data = {
  code: 'INVALID_DATA',
  details: [Object],
  message: 'invalid data',
  status: 'error'
}

console.log(data)
  