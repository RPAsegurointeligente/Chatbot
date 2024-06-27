const axios = require('axios');
let token =  '';
//se genera token cada 55 minutos
const regenerarTokenCRM = async () => {
  setInterval(async () => {
        token = await refreshTokenCRM();
        console.log('token CRM generado correctamente :', token);
  },55 * 60 * 1000); //55 minutos en milisegundos55 * 60 * 1000
};

//Refrescar token
async function refreshTokenCRM(){
  try {
    const options = {
      url: 'https://accounts.zoho.com/oauth/v2/token',
      method: 'post',
      params: {  
        refresh_token: '1000.e3907f75c224f3eb4f33cb2cc556fd79.483cc364b02f8fcb8083b2a7c3f24c62',
        grant_type: 'refresh_token',
        client_id: '1000.06IM5YF2VIKSAUOEF9QQ5SJC4NBHYC',
        client_secret: 'c7f91e59731535e2b06b7aba563936a1ba40292995',
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    let responseRefreshToken = await axios(options);
    console.log('data generado en axios :',responseRefreshToken.data)
    token = await responseRefreshToken.data.access_token;
    console.log('Primer token CRM: ', token)
    //token2 = await responseRefreshToken.data.access_token;
    return responseRefreshToken.data.access_token;
  } catch (error) {
    console.log('Se produjo un error al refrescar el token con el siguiente error: ', error);
  }
    
};

//SE CREA LEAD EN CRM
const addLead = async (numero,nombre,email,Descripcion) => {
  console.log('DATOS ANTES DE EJECUTAR LA PETICION',numero,nombre,email,Descripcion)
  try {
    console.log('numero en el post', numero);
    console.log('token en post :', token);
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
          Authorization: `Zoho-oauthtoken ${token}` 
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

//SE BUSCA LEAD POR MEDIO DEL 'ID'
const viewLead = async (id) => {
  try {
      const response = await axios.get(
        `https://www.zohoapis.com/crm/v2/Leads/search?criteria=(id:equals:${id})`,
    {
      headers: { 
        Authorization: `Zoho-oauthtoken ${token}`
      },
    }
  );
  console.log(response.data)
  return response.data
  } catch (error) {
    console.log('Error al realizar la peticion GET LEAD', error)
    return false;
  }
}

//SE CREA NOTAS EN CRM
const addNote = async (contenido,id) => {
  try {
    const response = await axios.post(`https://www.zohoapis.com/crm/v2/Leads/${id}/Notes`,
    {
      "data": [
        {
             "Note_Title": "DATOS DEL CLIENTE",
             "Note_Content": contenido,
             "Parent_Id": id,
             "se_module": "Leads"
         }
     ]
    },
    { 
      headers: {
      Authorization: `Zoho-oauthtoken ${token}`
        }
    }
    
    )

    console.log('notas', response.data)
  } catch (error) {
    console.log('se produjo un error', error)
  }
}
//setTimeout(()=> {addNote('Nombre: Gustavo Meneses sierra, CP:14500, Telefono: 5148796212, Nacional: no, Tarjeta de credito: no','2731176000366754090')},3000)

//SE CREA LEAD EN CRM CON LA MAYOR PARTE DE DATOS
const addLeadALL = async (numero,nombre,email, primaNeta,primaTotal, CP, aseguradora,Descripcion, Genero, nombres) => {
  //Zoho-oauthtoken
  try {
    console.log('DATOS DE ENTRADA API', numero,nombre,email, primaNeta,primaTotal, CP, aseguradora,Descripcion, Genero)
    console.log(numero)
    console.log(nombre)
    const response = await axios.post(
      //https://www.zohoapis.com/crm/v6/Leads/upsert
      //https://www.zohoapis.com/crm/v2/Leads
      'https://www.zohoapis.com/crm/v2/Leads',
      {
        data: [{
          Company: 'Comercio conversacional',
          Last_Name: nombre,
          First_Name: nombre,
          Email: email,
          //Title: 'El cliente no cumple con las preguntas filtro',
          Phone: numero,
          Mobile: numero,
          Aseguradora_Campa_a: aseguradora,
          Forma_de_Pago: 'Tarjeta de Credito',
          Periodicidad: 'Mensual',
          Monto_Prima_Neta: primaNeta,
          Monto_Prima_Total: primaTotal,
          Zip_Code: CP,
          Aseguradora_Emisi_n: aseguradora,
          Lead_Status: 'Sin Contacto efectivo',
          Description: Descripcion,
          Ramo: 'AUTO',
          Lead_Source: 'LP-SEGURO-AUTO',
          //Estatus_de_Contactacion: 'Oportunidad Ganada / Venta en proceso de emision',
          firstPage: 'https://segurointeligente.mx/seguro-auto/',
          Genero: Genero,
          //MKT_Campaigns: 'campana',
          //Full_Name: nombre+apellidos,
          //smsmagic4__Plain_Phone: numero,
        }],
        trigger: [
          'approval',
          'workflow',
          'blueprint',
        ],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}` 
        },
      }
    );
    let obj = response.data;
    console.log(obj.data[0].details)
 // console.log(obj.data[0].details)
 // console.log('Numero de ticket : ',obj.data[0].details.id)
  //console.log('ha nombre de :',obj.data[0].details.Created_By.name)
  //console.log('Creado el : ',obj.data[0].details.Created_Time)
    return response.data;
  } catch (error) {
    console.error('Error en la funcion:', error);
    throw error; // Rethrow the error to be caught in the calling function
  }
};

const createLeadeCRM = async (Correo,marca,modelo,cpostal,celular,nombre,nacimiento,apellidos, nombreCompleto,genero, Descripcion) => {
  try {
    const response = await axios('https://axa.segurointeligente.mx/CrearProspecto',{
        method: 'post',
        data: JSON.stringify({
          "usuario": "MAG",
          "pass": "MAG2022*",
          "email": Correo,
          "ramo": "AUTO",
          "marca": marca,
          "modelo": modelo,
          "cpostal": cpostal,
          "celular": celular,
          "nombre": nombre,
          "fnacimiento": nacimiento,
          "ap": apellidos,
          "nombreCompleto": nombreCompleto,
          "genero": genero,
          "leadsource": "LP-SEGURO-AUTO",
          "FirstPage": "https://segurointeligente.mx/seguro-auto/",
          "des": Descripcion,
          "Departamento": "General",
          "Campaing": "campana",
          "AseguradoraCampania": "",
          "gclid1": "gclid",
          "PlanSolicitado": "N/A",
          "NivelCliente": ""
        }),
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json'
        }
    })
    //console.log('Respuesta del lead nuava api')
    //console.log(response.data)
    return response.data
  } catch (error) {
    throw error;
  }

}

module.exports = {
  regenerarTokenCRM,
  refreshTokenCRM,
  addLead,
  viewLead,
  addNote,
  addLeadALL,
  createLeadeCRM
}
