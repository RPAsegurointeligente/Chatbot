const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const {flowPrincipal} = require('./flows/flowPrincipal.js')
const {regenerarTokenDesk,refreshTokenDesk} = require('./APIs/zohoDesk.js')
const {regenerarTokenCRM, refreshTokenCRM} = require('./APIs/zohoCRM.js')
const {regenerarTokenMag,getTokenMAG} = require('./APIs/Autoservice.js')
const { regenerarToken } = require('./APIs/zohoCRM.js')

regenerarTokenMag();
getTokenMAG();

regenerarTokenDesk();
refreshTokenDesk();

regenerarTokenCRM();
refreshTokenCRM();

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
