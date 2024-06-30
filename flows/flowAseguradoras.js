
const {addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')
const {ESTADO_ASEGURADORAS }= require('./flowPrincipal.js')




const flowConfiguracion = addKeyword('#################################').addAnswer('BIENVENIDO AL MENÙ DE CONFIGURACIÒN *ON/OFF* DE ASEGURADORAS ⚙️', null, async (ctx, {flowDynamic}) => {

    if(!['5215529188778', '5215614562120'].includes(ctx.from)) return await flowDynamic('Lo siento no tienes permiso, para ingresar a esta configuracion 🔒⚠️')

    await flowDynamic('Este es el estado actual de todas las aseguradoras :')
    await flowDynamic(`
        ${(ESTADO_ASEGURADORAS.AXA)?'1️⃣ AXA '+ '🟢' :'1️⃣ AXA '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.CHUBB)?'2️⃣ CHUBB '+ '🟢' :'2️⃣ CHUBB '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.ANA)?'3️⃣ ANA '+ '🟢' :'3️⃣ ANA '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.QUALITAS)?'4️⃣ QUALITAS '+ '🟢' :'4️⃣ QUALITAS '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.MAPFRE)?'5️⃣ MAPFRE '+ '🟢' :'5️⃣ MAPFRE '+ '⚪'}
        ${(ESTADO_ASEGURADORAS.GNP)?'6️⃣ GNP '+ '🟢' :'6️⃣ GNP '+ '⚪'}
    `)
   
}).addAnswer('\n\n*DESCRIPCION:*\nSELECCIONA EL NUMERO DE LA ASEGURADORA PARA CAMBIAR AL ESTADO CONTRARIO ACTUAL', {capture:true, delay: 1500}, async (ctx, {fallBack, flowDynamic}) => {
    
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

    await flowDynamic('Los nuevos estados son estos :')
    await flowDynamic(`
    ${(ESTADO_ASEGURADORAS.AXA)?'AXA '+ '🟢' :'AXA '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.CHUBB)?'CHUBB '+ '🟢' :'CHUBB '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.ANA)?'ANA '+ '🟢' :'ANA '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.QUALITAS)?'QUALITAS '+ '🟢' :'QUALITAS '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.MAPFRE)?'MAPFRE '+ '🟢' :'MAPFRE '+ '⚪'}
    ${(ESTADO_ASEGURADORAS.GNP)?'GNP '+ '🟢' :'GNP '+ '⚪'}
`)

    return await flowDynamic('Para regresar al menu principal escribe: *menu*')

})


module.exports = flowConfiguracion