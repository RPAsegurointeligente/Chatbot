const {addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')
const createthread = require('../assistant/createThreads.js')
const {messageInit,messages }= require('../assistant/addMessage.js')
const runAssis = require('../assistant/runAssistant.js')
const deleteThreads = require('../assistant/deleteThreads.js')
const {searchPolicy,sendPolicy} = require('../APIs/Polizaservice.js')
const {getMarcas,getModelos,getSubMarcas,getCotizar } = require('../APIs/Autoservice.js')
const {truncate, returnName} = require('./Validaciones.js')
const {viewLead,addLead,addLeadALL,addNote} = require('../APIs/zohoCRM.js')
const {createTicket,createTicketEO} = require('../APIs/zohoDesk.js')
const { jidDecode } = require('@whiskeysockets/baileys')
const USER_DATA = {}
const TICKET = {}
const USER_POLIZA = {}
const ESTADO_ASEGURADORAS = {
    AXA: true,
    MAPFRE: true,
    ANA: true,
    QUALITAS: true,
    CHUBB: true,
    GNP: true
  };

  const flujoInactividad = addKeyword(EVENTS.ACTION).addAnswer('!Hasta luego¡ 👋 te recuerdo que estoy para apoyarte 🤖\n\n',null, async (ctx,{endFlow}) => {
    try {
      await deleteThreads(USER_DATA[ctx.from].id);
      delete USER_DATA[ctx.from];
      //FALTA ELIMINAR HILO DEL USUARIO
      console.log('se elimino instancia e hilo del usuario', ctx.from)
    } catch (error) {
      console.log('Error al eliminar instancia del usuario', ctx.from)
    }
    return endFlow('Si requieres que te apoye en algo, recuerda activarme mandando un *Hola*')
  })


const inicializacion = async (id) => {
    if (USER_DATA[id]) return;
    // Bloqueamos la inicialización hasta que todos los campos estén listos.
    USER_DATA[id] = await new Promise(async (resolve) => {
        resolve({
            response: null,
            id: '',
            body: '',
            add: '',
            one: false,
            myState: null,
            myState2: null,
            myState3: null,
            polizaStatus: null,
            argumentos: null,
            nombre: null,
            apellidos: null,
            telefono: null,
            codigo_postal: null,
            fecha_nacimiento: null,
            genero: null,
            correo: null,
            uso_particular: null,
            procedencia_nacional: null,
            tarjeta_credito: null,
            marca: null,
            modelo: null,
            submarca: null,
            cotizacion: null,
            seguimiento: null,
            getmarca: null,
            getmodelo: null,
            getsubmarca: null,
            autoservicio: null,
            DATA: null,
            AXA:null,
            MAPFRE: null,
            ANA: null,
            CHUBB: null,
            GNP: null,
            folio: null,
            seguimiento: null,
            consulta: null,
            consulta_poliza: null,
            descripcion: null,
            MODELOS: null,
            modelos:null,
            SUBMARCA: null,
            modelo_usuario: null,
            submarcas: null,
            LEADALL: null,
            ejecutivo: null,
            generoAPI: null,
            prima_Neta: null,
            prima_Total: null,
            nombreLead: null,

        });
    });
    console.log(`Se inicializo con el numero: ${id}`);
};


const flowApagar = addKeyword('######################').addAnswer('\n\n*DESCRIPCION:*\nSELECCIONA EL NUMERO DE LA ASEGURADORA PARA CAMBIAR AL ESTADO CONTRARIO ACTUAL', {capture:true, delay: 1500}, async (ctx, {fallBack, flowDynamic, endFlow}) => {
    switch (ctx.body) {
        case '1':
            ESTADO_ASEGURADORAS.AXA = !ESTADO_ASEGURADORAS.AXA
            break;
        case '2':
            ESTADO_ASEGURADORAS.CHUBB = !ESTADO_ASEGURADORAS.CHUBB
            break;
        case '3':
            ESTADO_ASEGURADORAS.ANA = !ESTADO_ASEGURADORAS.ANA
            break;
        case '4':
            ESTADO_ASEGURADORAS.QUALITAS = !ESTADO_ASEGURADORAS.QUALITAS
            break;
        case '5':
            ESTADO_ASEGURADORAS.MAPFRE = !ESTADO_ASEGURADORAS.MAPFRE
            break;
        case '6':
            ESTADO_ASEGURADORAS.GNP = !ESTADO_ASEGURADORAS.GNP
            break;
        default:
            if(['menu','Menu','Menú'].includes(ctx.body)) return;
            return fallBack('Ingresa una opcion valida ', ctx.body)
    }

    await flowDynamic('Los nuevos estados son estos')
    await flowDynamic(`
    ${(ESTADO_ASEGURADORAS.AXA)?'AXA '+ '🟢' :'AXA '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.CHUBB)?'CHUBB '+ '🟢' :'CHUBB '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.ANA)?'ANA '+ '🟢' :'ANA '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.QUALITAS)?'QUALITAS '+ '🟢' :'QUALITAS '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.MAPFRE)?'MAPFRE '+ '🟢' :'MAPFRE '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.GNP)?'GNP '+ '🟢' :'GNP '+ '⚪'}
`)

    await deleteThreads(USER_DATA[ctx.from].id)
    delete USER_DATA[ctx.from];
    return await flowDynamic('Para regresar al menu principal escribe: *menu*')
})


const flowConfiguracion = addKeyword('#################################').addAnswer('BIENVENIDO AL MENÙ DE CONFIGURACIÒN *ON/OFF* DE ASEGURADORAS ⚙️', null, async (ctx, {flowDynamic, endFlow, gotoFlow}) => {
    console.log(ctx.from)
    if(!['5215529188778', '5215614562120'].includes(ctx.from)) return await flowDynamic('Lo siento no tienes permiso, para ingresar a esta configuracion 🔒⚠️')
    await flowDynamic('Este es el estado actual de todas las aseguradoras')
    await flowDynamic(`
        ${(ESTADO_ASEGURADORAS.AXA)?'1️⃣ AXA '+ '🟢' :'1️⃣ AXA '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.CHUBB)?'2️⃣ CHUBB '+ '🟢' :'2️⃣ CHUBB '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.ANA)?'3️⃣ ANA '+ '🟢' :'3️⃣ ANA '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.QUALITAS)?'4️⃣ QUALITAS '+ '🟢' :'4️⃣ QUALITAS '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.MAPFRE)?'5️⃣ MAPFRE '+ '🟢' :'5️⃣ MAPFRE '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.GNP)?'6️⃣ GNP '+ '🟢' :'6️⃣ GNP '+ '⚪'}
    `)
    return gotoFlow(flowApagar)
    //await flowDynamic('1️⃣ AXA \n\n2️⃣ CHUBB \n\n3️⃣ ANA \n\n4️⃣ QUALITAS \n\n5️⃣ MAPFRE \n\n*DESCRIPCION:*\nSELECCIONA EL NUMERO DE LA ASEGURADORA PARA CAMBIAR AL ESTADO CONTRARIO ACTUAL')
},[flowApagar])

const flowEjecutivo = addKeyword('#######################################')
    .addAnswer('Un momento te estoy dirigiendo con uno de nuestros ejecutivos.....')
    .addAnswer('.......', {delay: 3000})
    .addAnswer('...', {delay: 1500})
    .addAction(async (ctx, {provider, flowDynamic, endFlow}) => {
        //let result = await addLead(ctx.from, USER_DATA[ctx.from].nombre, USER_DATA[ctx.from].correo, `El cliente ${USER_DATA[ctx.from].nombre} seleccion la opcion EJECUTIVO, NUMERO: ${ctx.from} CORREO: ${USER_DATA[ctx.from].correo}`);
        //console.log(result);
        const refProvider = await provider.getInstance();
        await refProvider.groupCreate(
            `Soporte SeguroInteligente.mx `,
            [
                `${ctx.from}@s.whatsapp.net`,
                `5215536434161@s.whatsapp.net`
                //`5215587264614@s.whatsapp.net`
            ]
        );
        await flowDynamic(`Te hemos agregado al grupo *"Soporte SeguroInteligente.mx* con uno de nuestros asesores`);
        await deleteThreads(USER_DATA[ctx.from].id);
        delete USER_DATA[ctx.from];
        await flowDynamic('Para regresar al menu principal, solo escribe *menu*')
    })

const flowContratar = addKeyword('#############################')
    .addAnswer('Por favor, escribe solo el nombre de la aseguradora a contratar, Ejemplo: *AXA*.', {capture: true, delay: 1500, idle: 300000}, async (ctx, {fallBack, flowDynamic, endFlow, gotoFlow}) => {
        if (ctx?.idleFallBack) {
            await deleteThreads(USER_DATA[ctx.from].id);
            delete USER_DATA[ctx.from];
            return gotoFlow(flujoInactividad);
        }
        const aseguradoras = ['CHUBB', 'MAPFRE', 'GNP', 'ANA', 'QUALITAS', 'AXA'];
        USER_DATA[ctx.from].descripcion = `Nombre: ${USER_DATA[ctx.from].nombre}, CP: ${USER_DATA[ctx.from].codigo_postal}, Correo: ${USER_DATA[ctx.from].correo}, Telefono: ${USER_DATA[ctx.from].telefono}, Genero: ${USER_DATA[ctx.from].genero}, Fecha de nacimiento: ${USER_DATA[ctx.from].fecha_nacimiento}, vehiculo nacional: ${USER_DATA[ctx.from].procedencia_nacional}, vehiculo particular: ${USER_DATA[ctx.from].uso_particular}, Tarjeta de credito: ${USER_DATA[ctx.from].tarjeta_credito}`;
        console.log(USER_DATA[ctx.from].descripcion);
        if (aseguradoras.includes(ctx.body.toUpperCase())) {
            USER_DATA[ctx.from].prima_Neta = truncate(USER_DATA[ctx.from][ctx.body.toUpperCase()].primaNeta);
            USER_DATA[ctx.from].prima_Total = truncate(USER_DATA[ctx.from][ctx.body.toUpperCase()].primaTotal);
            USER_DATA[ctx.from].nombreLead = returnName(USER_DATA[ctx.from].nombre);
            console.log("NOMBRE LEAD", USER_DATA[ctx.from].nombreLead);
            console.log("Nombre", USER_DATA[ctx.from].nombre);
            try {
                USER_DATA[ctx.from].LEADALL = await addLeadALL(USER_DATA[ctx.from].telefono, USER_DATA[ctx.from].nombre, USER_DATA[ctx.from].correo, USER_DATA[ctx.from].prima_Neta, USER_DATA[ctx.from].prima_Total, USER_DATA[ctx.from].codigo_postal, ctx.body.toUpperCase(), USER_DATA[ctx.from].descripcion, USER_DATA[ctx.from].genero);
                await flowDynamic(`*Datos del ticket:*\n\n*Nombre:*\n${USER_DATA[ctx.from].nombre}\n\n*Folio*\n${USER_DATA[ctx.from].LEADALL.data[0].details.id}\n\n*Estatus*\nEn proceso\n\n*Descripción:*\nSu cotización se está procesando.\n\n*Fecha y hora*\n${USER_DATA[ctx.from].LEADALL.data[0].details.Created_Time}\n\nEn breve uno de nuestros ejecutivos se pondrá en contacto contigo para brindarte más detalles de tu póliza. 🚘🛡️ ¡Gracias por tu confianza!😉\n\n*Los costos indicados son de carácter informativo y podrían estar sujetos a cambio*`);
            } catch (error) {
                await flowDynamic('¡Upss! Ocurrió un error de conexión, para continuar con tu cotización puedes marcar al número 5530987211 y uno de nuestros ejecutivos te atenderá.');
            }
        } else {
            return fallBack('Escribe el nombre de la aseguradora como se muestra en las cotizaciones');
        }
        await deleteThreads(USER_DATA[ctx.from].id);
        delete USER_DATA[ctx.from];
        await flowDynamic('Para regresar al menu principal, solo escribe *menu*');
    });

const flowEnd = addKeyword('#################')
    .addAnswer('Lo siento al parecer no existe cotización para tu vehículo\n\nSi gustas te puedes comunicar al número 5530987211 y uno de nuestros ejecutivos te atendera', null, async (ctx, {endFlow}) => {
        await deleteThreads(USER_DATA[ctx.from].id);
        delete USER_DATA[ctx.from];
        return endFlow('Para regresar al menu principal, solo escribe *menu*');
    });

const flowCotizacionAseguradoras = addKeyword('########################')
    .addAnswer('Un momento voy a consultar las cotizaciones que tenemos para ti', null, async (ctx, {flowDynamic, gotoFlow, endFlow}) => {
        const aseguradoras = ['CHUBB', 'MAPFRE', 'GNP', 'ANA', 'QUALITAS', 'AXA'];
        (USER_DATA[ctx.from].genero === 'MASCULINO') ? USER_DATA[ctx.from].generoAPI = '0' : USER_DATA[ctx.from].generoAPI = '1';
        console.log('DATOS ANTES DE LA COTIZACION', USER_DATA[ctx.from].marca, USER_DATA[ctx.from].modelo, USER_DATA[ctx.from].submarca, USER_DATA[ctx.from].codigo_postal, new Date(USER_DATA[ctx.from].fecha_nacimiento).toISOString(), USER_DATA[ctx.from].generoAPI, 'QUAA740806BX9');
        try {
            USER_DATA[ctx.from].DATA = await getCotizar(USER_DATA[ctx.from].marca, USER_DATA[ctx.from].modelo, USER_DATA[ctx.from].submarca, USER_DATA[ctx.from].codigo_postal, new Date(USER_DATA[ctx.from].fecha_nacimiento).toISOString(), USER_DATA[ctx.from].generoAPI, 'QUAA740806BX9');
            if (USER_DATA[ctx.from].DATA.cotizacionInfo[0].primaTotal < 1500 && USER_DATA[ctx.from].DATA.cotizacionInfo[1].primaTotal < 1500 && USER_DATA[ctx.from].DATA.cotizacionInfo[2].primaTotal < 1500 && USER_DATA[ctx.from].DATA.cotizacionInfo[3].primaTotal < 1500 && USER_DATA[ctx.from].DATA.cotizacionInfo[4].primaTotal < 1500 && USER_DATA[ctx.from].DATA.cotizacionInfo[5].primaTotal < 1500) {
                return gotoFlow(flowEnd);
            }
            await flowDynamic('Estas son algunas cotizaciones para ti:');
        } catch (error) {
            console.log('ERROR AL COTIZAR ASEGURADORAS');
            console.log(error);
        }
        for (const item of aseguradoras) {
            const find = (element) => element === item;
            console.log('estado aseguradoras', ESTADO_ASEGURADORAS[item]);
            try {
                if (USER_DATA[ctx.from].DATA.cotizacionInfo[aseguradoras.findIndex(find)].primaTotal > 1500 && ESTADO_ASEGURADORAS[item]) {
                    USER_DATA[ctx.from][item] = USER_DATA[ctx.from].DATA.cotizacionInfo[aseguradoras.findIndex(find)];
                    await flowDynamic(`*Datos generales:*\n\n*Marca:*\n${USER_DATA[ctx.from].DATA.marca}\n\n*Descripción:*\n${USER_DATA[ctx.from].DATA.cotizacionInfo[aseguradoras.findIndex(find)].descripcionCompleta}\n\n*Modelo:*\n${USER_DATA[ctx.from].DATA.modelo}\n\n*Aseguradora:*\n${USER_DATA[ctx.from].DATA.cotizacionInfo[aseguradoras.findIndex(find)].nombreCIA}\n\n*Prima total:*\n$${USER_DATA[ctx.from].DATA.cotizacionInfo[aseguradoras.findIndex(find)].primaTotal}`);
                } else {
                    await flowDynamic(`No encontre cotización para la aseguradora: *${item}*`);
                }
            } catch (error) {
                console.log(error);
            }
        }
        return gotoFlow(flowContratar);
    }, [flowContratar, flowEnd]);


const flowPreguntasFiltro = addKeyword('#####################################').addAnswer('¡Gracias! Estoy validando tus datos. 🙂', null ,async (ctx,{flowDynamic,endFlow}) => {
    USER_DATA[ctx.from].descripcion = `Nombre: ${USER_DATA[ctx.from].apellidos} ${USER_DATA[ctx.from].nombre}, CP:${USER_DATA[ctx.from].codigo_postal}, Correo: ${USER_DATA[ctx.from].correo} , Telefono: ${USER_DATA[ctx.from].telefono} , Genero: ${USER_DATA[ctx.from].genero} , Fecha de nacimiento : ${USER_DATA[ctx.from].fecha_nacimiento},  vehiculo nacional: ${USER_DATA[ctx.from].procedencia_nacional}, vehiculo particular: ${USER_DATA[ctx.from].uso_particular},  Tarjeta de credito : ${USER_DATA[ctx.from].tarjeta_credito}`;
    try {
        let res = await addLead(ctx.from,USER_DATA[ctx.from].apellidos,USER_DATA[ctx.from].nombre,USER_DATA[ctx.from].correo,USER_DATA[ctx.from].descripcion);
        await flowDynamic(`*DATOS DEL TICKET*\n\n*Nombre:*\n${USER_DATA[ctx.from].apellidos} ${USER_DATA[ctx.from].nombre}\n\n*FOLIO*\n${res.data[0].details.id}\n\n*ESTATUS*\nEn proceso\n\n*DESCRIPCION:*\nEjecutivo en proceso de contactarlo\n\n*FECHA Y HORA*\n${res.data[0].details.Created_Time}\n\n*En los próximos minutos un ejecutivo se estará comunicando contigo, para ofrecerte más información*`)
        await flowDynamic('Gracias por contactar a Seguro Inteligente, en breve nos pondremos en contacto contigo. 😉')
        return
    } catch (error) {
        console.log('ERROR EN FLOW PREGUNTAS FILTRO',error)
    }
})

const flowSeguimiento = addKeyword('####################################')
    .addAnswer('Un momento deja consulto el estatus de tu folio 🧐', null, async (ctx, {flowDynamic, endFlow}) => {
        let response;
        try {
            response = await viewLead(USER_DATA[ctx.from].folio);
            console.log(response);
            TICKET[ctx.from] = {estatus: '', descripcion: ''};
            switch (response.data[0].Estatus_Lead_Prospecto) {
                case 'Sin Tocar':
                    TICKET[ctx.from].estatus = 'En proceso';
                    TICKET[ctx.from].descripcion = 'Su cotización se está procesando';
                    break;
                case 'Sin Contacto efectivo':
                    TICKET[ctx.from].estatus = 'Cliente no contesta llamada';
                    TICKET[ctx.from].descripcion = 'El número que proporciona el cliente, no contesta las llamadas';
                    break;
                case 'Contacto Efectivo':
                    TICKET[ctx.from].estatus = 'Cliente contesta llamada';
                    TICKET[ctx.from].descripcion = 'El cliente contestó llamada para cerrar su cotización';
                    break;
                default:
                    TICKET[ctx.from].estatus = 'No se pudo obtener estatus';
                    TICKET[ctx.from].descripcion = 'No se pudo obtener descripcion';
                    break;
            }
            await flowDynamic(`*Información general:*\n\n*Nombre:*\n${response.data[0].Full_Name}\n\n*Correo:*\n${response.data[0].Email}\n\n*Estatus*\n${TICKET[ctx.from].descripcion}\n\n*Descripción:*\n${TICKET[ctx.from].estatus}\n\n*Fecha de cotización*\n${response.data[0].Created_Time}`);
        } catch (error) {
            console.log('OCURRIO UN ERROR EN LAS VALIDACIONES', error);
            await flowDynamic('Upsss... lo siento no he podido encontrar tu información');
        } finally {
            delete TICKET[ctx.from];
            await deleteThreads(USER_DATA[ctx.from].id);
            delete USER_DATA[ctx.from];
        }
        await flowDynamic('Para regresar al menu principal, solo escribe *menu*');
    });

const flowConsultaPoliza = addKeyword('############################################3')
    .addAnswer('Introduce tu numero de poliza', null, async (ctx, {fallBack, flowDynamic, state, endFlow, gotoFlow}) => {
        await state.update({poliza: USER_DATA[ctx.from].consulta_poliza});
        USER_POLIZA[ctx.from] = {policy: state.getMyState(), search: null, send: null, cut: null};
        USER_POLIZA[ctx.from].search = await searchPolicy(USER_POLIZA[ctx.from].policy.poliza);
        console.log(USER_POLIZA[ctx.from].search);
        if (USER_POLIZA[ctx.from].search.error) return await flowDynamic('Lo siento, tengo problemas para procesar tu solicitud. Intenta más tarde');
        if (USER_POLIZA[ctx.from].search.MENSAJE === 'SIN DATOS PARA MOSTRAR') {
            await createTicket(USER_POLIZA[ctx.from].policy.poliza, USER_DATA[ctx.from].nombre, USER_DATA[ctx.from].telefono);
            await flowDynamic('Lo siento no he podido encontrar tu poliza');
            await flowDynamic('Para regresar al menu principal, solo escribe *menu*');
            return;
        }
        USER_POLIZA[ctx.from].send = await sendPolicy(USER_POLIZA[ctx.from].policy.poliza, USER_POLIZA[ctx.from].search.Correo);
        if (USER_POLIZA[ctx.from].send.error) return await flowDynamic('Lo siento tengo problemas para procesar tu solicitud. Intenta más tarde');
        if (USER_POLIZA[ctx.from].send.status === 200 && USER_POLIZA[ctx.from].send.data.d === `Correo enviado exitosamente a ${USER_POLIZA[ctx.from].search.Correo}`) {
            USER_POLIZA[ctx.from].cut = USER_POLIZA[ctx.from].search.Correo.split('@');
            await flowDynamic(`Tu poliza fue enviada al correo con terminación: ${'*'.repeat(USER_POLIZA[ctx.from].cut[0].length)}@${USER_POLIZA[ctx.from].cut[1]}`);
            await createTicketEO(`Chatbot_Comercio_Conversacional_Solicitud de poliza: ${USER_POLIZA[ctx.from].policy.poliza}`);
            await state.update({poliza: null});
        } else {
            await flowDynamic('Lo siento no he podido enviar tu poliza. Intenta más tarde');
        }
        await deleteThreads(USER_DATA[ctx.from].id);
        delete USER_DATA[ctx.from];
        await flowDynamic('Para regresar al menu principal, solo escribe *menu*');
    });

const flowComprobante = addKeyword('#################################################')
    .addAnswer([
        'Te invito a cargar tu comprobante en el siguiente enlace: https://legacy.segurointeligente.mx/Formularios/Comprobante-Pago.aspx\n',
        'No olvides tener a la mano los siguientes documentos en formato pdf\n',
        '👉 Comprobante de pago bancario.',
        '👉 Copia de identificacion oficial(Frente)',
        '👉 Copia de identificacion oficial(Reverso)'
    ])
    .addAnswer('👉 Ademas no olvides llenar tu Carta de No Siniestro: solo en caso de exceder el periodo de gracia de tu póliza o si tienes 2 o más recibos pendientes de pago.')
    .addAnswer('pdf', {
        media: 'C:/Users/Gmag/Desktop/Comercio AI/base-baileys-memory/Documents/CARTA_NO_SINIESTRO.pdf'
    })
    .addAnswer('Para regresar al menu principal escribe *menu*', null, async (ctx) => {
        await deleteThreads(USER_DATA[ctx.from].id);
        delete USER_DATA[ctx.from];
        await createTicketEO("Chatbot_Comercio_Conversacional_Comprobante de pago");
        return;
    });

const flowStatus = addKeyword('#################################')
    .addAnswer('Permíteme un momento, deja consulto el status de tu poliza', null, async (ctx, {state, flowDynamic, endFlow}) => {
        console.log('POLIZA EN EL FLOW DE ESTATUS', USER_DATA[ctx.from].polizaStatus);
        await state.update({search: await searchPolicy(USER_DATA[ctx.from].polizaStatus)});
        const myState = state.getMyState();
        console.log(myState.search);
        if (myState.search.MENSAJE && myState.search.MENSAJE === "SIN DATOS PARA MOSTRAR" || myState.search.Status === '') {
            await createTicket(USER_DATA[ctx.from].polizaStatus, USER_DATA[ctx.from].nombre, USER_DATA[ctx.from].telefono);
            return await flowDynamic('Lo siento no he podido consultar tu estatus, intenta más tarde\n\nPara regresar al menu principal escribe *menu*');
            
        }
        if (myState.search.Status && myState.search.Status != '') {
            await flowDynamic(`El estatus de poliza es el siguiente: *${myState.search.Status}*\nCon una vigencia hasta: *${myState.search.Hasta}*\n\nPara regresar al menu principal escribe *menu*`);
            await createTicketEO(`Chatbot_Comercio_Conversacional_Solicitud de estatus`);
            myState.search = null;
            await deleteThreads(USER_DATA[ctx.from].id);
            delete USER_DATA[ctx.from];
            await flowDynamic('Para regresar al menu principal, solo escribe *menu*');
            return;
        }
        await flowDynamic('Para regresar al menu principal, solo escribe *menu*');
        return;
    });

//¡Hola! 👋  Soy el Asistente virtual de Seguro Inteligente. 🤖\n\nSelecciona la opción deseada solo con el número correspondiente:\n1️⃣ Nueva cotización.\n2️⃣ Seguimiento a una cotización\n3️⃣ Descarga, consulta de póliza, comprobante de pagos...\n\nSi deseas hablar con un asesor, escribe la palabra "EJECUTIVO" y en breve te contactaremos
const flowPrincipal = addKeyword(['hola', 'menu', 'menù'])
    .addAnswer(' ', null, async (ctx, {flowDynamic, state}) => {
        await inicializacion(ctx.from);

        if (USER_DATA[ctx.from] && !USER_DATA[ctx.from].one) {
            const threadId = await createthread();
            await state.update({id: threadId});
            const addMessage = await messageInit(threadId);
            await state.update({add: addMessage});
            const asis = await runAssis(threadId);
            await state.update({asis: asis});

            // Solo actualizamos USER_DATA después de completar todas las operaciones
            USER_DATA[ctx.from] = {
                ...USER_DATA[ctx.from],
                id: threadId,
                add: addMessage,
                one: true,
            };

            USER_DATA[ctx.from].myState = state.getMyState();
            console.log('MENU', USER_DATA[ctx.from].myState.asis);
            await flowDynamic(USER_DATA[ctx.from].myState.asis);
            USER_DATA[ctx.from].myState = null;
        }
    })
    .addAnswer('Selecciona una opción', {capture: true, idle: 300000}, async (ctx, {fallBack, state, endFlow, gotoFlow}) => {
        if (ctx?.idleFallBack) {
            await deleteThreads(USER_DATA[ctx.from].id);
            delete USER_DATA[ctx.from];
            await addLead('0000000000', 'Inactividad', 'gmeneses@segurointeligente.mx', 'Inactividad por usuario');

            return gotoFlow(flujoInactividad);
        }
        console.log(ctx);
        try {
            await state.update({add: await messages(USER_DATA[ctx.from].id, ctx.body)});
            await state.update({asis: await runAssis(USER_DATA[ctx.from].id)});
            const myState3 = state.getMyState();
            console.log('Valor del tercer estado', myState3.asis);
            console.log('valida si es objeto', Object.hasOwn(myState3.asis, 'name'));

            // Funciones
            if (Object.hasOwn(myState3.asis, 'name')) {
                switch (myState3.asis.name) {
                    case 'get_status_poliza':
                        USER_DATA[ctx.from].argumentos = JSON.parse(myState3.asis.arguments);
                        USER_DATA[ctx.from].polizaStatus = USER_DATA[ctx.from].argumentos.poliza;
                        USER_DATA[ctx.from].nombre = USER_DATA[ctx.from].argumentos.nombre_y_apellidos;
                        USER_DATA[ctx.from].telefono = USER_DATA[ctx.from].argumentos.telefono;
                        return gotoFlow(flowStatus);
                    case 'get_datos_cotizacion':
                        USER_DATA[ctx.from].cotizacion = JSON.parse(myState3.asis.arguments);
                        USER_DATA[ctx.from].uso_particular = USER_DATA[ctx.from].cotizacion.uso_particular;
                        USER_DATA[ctx.from].procedencia_nacional = USER_DATA[ctx.from].cotizacion.procedencia_nacional;
                        USER_DATA[ctx.from].nombre = USER_DATA[ctx.from].cotizacion.nombre_y_apellidos;
                        USER_DATA[ctx.from].telefono = USER_DATA[ctx.from].cotizacion.telefono;
                        USER_DATA[ctx.from].codigo_postal = USER_DATA[ctx.from].cotizacion.codigo_postal;
                        USER_DATA[ctx.from].fecha_nacimiento = USER_DATA[ctx.from].cotizacion.fecha_nacimiento;
                        USER_DATA[ctx.from].correo = USER_DATA[ctx.from].cotizacion.correo;
                        USER_DATA[ctx.from].tarjeta_credito = USER_DATA[ctx.from].cotizacion.tarjeta_credito;
                        USER_DATA[ctx.from].genero = USER_DATA[ctx.from].cotizacion.genero;
                        USER_DATA[ctx.from].marca = USER_DATA[ctx.from].cotizacion.marca;
                        USER_DATA[ctx.from].modelo = USER_DATA[ctx.from].cotizacion.modelo;
                        USER_DATA[ctx.from].submarca = USER_DATA[ctx.from].cotizacion.submarca;
                        return gotoFlow(flowCotizacionAseguradoras);
                    case 'get_seguimiento_cotizacion':
                        USER_DATA[ctx.from].seguimiento = JSON.parse(myState3.asis.arguments);
                        USER_DATA[ctx.from].folio = USER_DATA[ctx.from].seguimiento.numero_folio;
                        console.log('numero de folio', USER_DATA[ctx.from].folio);
                        return gotoFlow(flowSeguimiento);
                    case 'get_carga_comprobante':
                        return gotoFlow(flowComprobante);
                    case 'get_consulta_poliza':
                        USER_DATA[ctx.from].consulta = JSON.parse(myState3.asis.arguments);
                        USER_DATA[ctx.from].consulta_poliza = USER_DATA[ctx.from].consulta.poliza;
                        USER_DATA[ctx.from].nombre = USER_DATA[ctx.from].consulta.nombre_y_apellidos;
                        USER_DATA[ctx.from].telefono = USER_DATA[ctx.from].consulta.telefono;
                        return gotoFlow(flowConsultaPoliza);
                    case 'get_solicitud_ejecutivo':
                        USER_DATA[ctx.from].ejecutivo = JSON.parse(myState3.asis.arguments);
                        USER_DATA[ctx.from].nombre = USER_DATA[ctx.from].ejecutivo.nombre_y_apellidos;
                        USER_DATA[ctx.from].correo = USER_DATA[ctx.from].ejecutivo.correo;
                        return gotoFlow(flowEjecutivo);
                    case 'get_configuracion_aseguradoras':
                        return gotoFlow(flowConfiguracion);
                }
            }

            // Conversaciones
            if (myState3.asis === '' && !Object.hasOwn(myState3.asis, 'name')) {
                await state.update({add: await messages(USER_DATA[ctx.from].id, ctx.body)});
                await state.update({asis: await runAssis(USER_DATA[ctx.from].id)});
                USER_DATA[ctx.from].body = state.getMyState();
                if (USER_DATA[ctx.from].body.asis === '') return fallBack('Lo siento no he logrado comprender lo que dices, puedes repetirlo');
                console.log('ejecucion del Asistente', USER_DATA[ctx.from].body.asis);
                return fallBack(USER_DATA[ctx.from].body.asis);
            }
            return fallBack(myState3.asis);
        } catch (error) {
            await deleteThreads(USER_DATA[ctx.from].id);
            console.log('Se produjo un error en el flujo de conversacion');
            console.log(error);
        }
    }, [flowStatus, flowSeguimiento, flowComprobante, flowConsultaPoliza, flowPreguntasFiltro, flowCotizacionAseguradoras, flowEjecutivo, flowConfiguracion]);

module.exports = {
    flowPrincipal
};