const axios = require('axios');

let accessToken = '';

//SE REGENERA TOKEN 
const regenerarTokenDesk = async () => {
    setInterval(async () => {
          await refreshTokenDesk();
    },55 * 60 * 1000); //55 minutos en milisegundos55 * 60 * 1000
  };


//SE REFRESCA TOKEN
const refreshTokenDesk = async () => {
    const options = {
        url: "https://accounts.zoho.com/oauth/v2/token",
        method: "post",
        params: {
            refresh_token: "1000.2599f2fdccf7e3a64bbfb032061c8527.3ecb39190d545df6acf904b7a21387b0",
            client_id: "1000.ZUX6JVS98SECVRGGK6P336UUJVU4FF",
            client_secret: "2712cde083955cc908eae50b68676eb90aa6a4ced9",
            grant_type: "refresh_token" 
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        
    };
    try {
        let response = await axios(options);
        console.log(response.data)
        accessToken = await response.data.access_token;
        console.log("Nuevo token generado correctamente",accessToken)

    } catch (error) {
        console.log("ERROR AL GENERAR EL TOKEN ",error);
    }
};


//CONSULTAR TICKET POR ID
const viewTicket = async ()  => {
    try {
        let options = {
            url: "https://desk.zoho.com/api/v1/tickets/212945000227553826",
            method: "get",
            headers: {
                "Content-Type": "application/json",
                orgId: "651915269",
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            }

        }
        let response = await axios(options)
        console.log(response.data)
    } catch (error) {
        console.log('OCURRIO UN ERROR AL CONSULTAR EL TICKET',error)
    }
};



//CREAR TICKET EN ZOHO DESK
const createTicket = async (poliza,nombre,telefono) => {
    let objCrearTicket = {
        departmentId: "212945000000006907", //*** 212945000208125033*/
        channel: "Chat",
        status: "Open", //*** */
        subject: `Chatbot_Comercio_Conversacional_Solicitud de poliza: ${poliza}`, 
        language: "Spanish",
        email: "cotizacion_ventas@segurointeligente.zohodesk.com",
        contactId: "212945000192153009", //** */
        description: `Nombre: ${nombre}, Numero telefonico: ${telefono}`,
        phone: null,
        customFields: {
	        'Origen de Contacto': 'Encuesta de Satisfacción',
            Aseguradora: 'Seguro Inteligente',
            'Satisfacción WhatsApp': null,
        }
      };
      try {
        let configToken = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://desk.zoho.com/api/v1/tickets",
          headers: {
            "Content-Type": "application/json",
            orgId: "651915269",
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
          data: objCrearTicket,
        };
        let response = await axios(configToken);
        console.log(response.data)
        return response.data;
      } catch (error) {
        console.log(error)
        throw error;
      }
};

const createTicketEO = async (title) => {
    let objCrearTicket = {
        departmentId: "212945000248665077", //*** 212945000208125033*/
        channel: "Chat",
        status: "Open", //*** */
        subject: title, 
        language: "Spanish",
        //email: "cotizacion_ventas@segurointeligente.zohodesk.com",
        contactId: "212945000192153009", //** */
        //description: null,
        phone: null,
        //customFields: {
	        //'Origen de Contacto': 'Encuesta de Satisfacción',
            //Aseguradora: 'Seguro Inteligente',
            //'Satisfacción WhatsApp': null,
        //}
      };
      try {
        let configToken = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://desk.zoho.com/api/v1/tickets",
          headers: {
            "Content-Type": "application/json",
            orgId: "651915269",
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
          data: objCrearTicket,
        };
        let response = await axios(configToken);
        console.log(response.data)
        return response.data;
      } catch (error) {
        console.log(error)
        throw error;
      }
};
module.exports = {
    regenerarTokenDesk,
    createTicket,
    createTicketEO,
    refreshTokenDesk
}