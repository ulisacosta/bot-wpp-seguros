const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

require('dotenv').config()
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MongoAdapter = require('@bot-whatsapp/database/mongo')

/**
 * Declaramos las conexiones de Mongo
 */

const MONGO_DB_URI = process.env.MONGO_DB_URI
const MONGO_DB_NAME = process.env.MONGO_DB_NAME

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */


const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄'])

const flowCotizar = addKeyword(['cotizar','cotiza','cotización']).addAnswer(
    [
        '📄 Para que podamos cotizar su vehículo necesitamos:',
        'Foto de tarjeta verde',
        'Lugar en que se va a encontrar el vehículo más tiempo (ciudad,cod. postal)',
        'Año del vehículo',
        'Enviaremos las coberturas con sus respectivos precios en cuanto tengamos la cotización.',
        '\n Para hacer otra consulta ingrese *bot*',
    ],
)


const flowSeguros = addKeyword(['seguros', 'seguro']).addAnswer(
    [
        '🗂 podemos ofrecerte seguros de:',
        'Vehículos(Moto,Vehículos,etc)',
        'Accidentes personales',
        'Mala praxis',
        'Integral de comercio',
        'Combinado familiar (casa)',
        'Vida',
        '\n Para hacer otra consulta ingrese *bot*',
    ],
    null,
    null,
    [flowSecundario]
)

const flowSiniestro = addKeyword(['siniestro','siniestros','choque']).addAnswer(
    [
        '🚗 En caso de encontrarse en un siniestro debe pedir al tercero la siguiente documentación: ',
        'Seguro con el que cuenta, foto de la póliza',
        'Foto de tarjeta verde',
        'Foto del carnet',
        'Foto del dni',
        'Fotos de los daños y del momento del vehículo que se vean las patentes',
        'Numero de celular',
        'En cuanto cuente con los datos enviar por este medio o acercar a nuestra oficina.',
        '\n Para hacer otra consulta ingrese *bot*',
    ],
    null,
    null,
    [flowSecundario]
)


const flowPrincipal = addKeyword(['bot','hola'])
    .addAnswer('Bienvenido implementamos esta función para agilizar algunas consultas mientras no nos encontramos, escribe la palabra que aparece en *negrita*')
    .addAnswer(
        [
            '👉 *cotizar* para saber que datos necesitamos para cotizar su vehículo.',
            '👉 *seguros* para conocer con que seguros contamos.',
            '👉 *siniestro* para conocer que datos debe solicitar en caso de un siniestro.'
        ],
        null,
        null,
        [flowCotizar, flowSeguros, flowSiniestro]
        )
        
  


      /*   const flowBienvenida = addKeyword(EVENTS.WELCOME)
        .addAnswer('Hola!', null, async (ctx, { gotoFlow }) => {
         
            
            console.log('Consultando en la base de datos si existe el número registrado....' );
            
            let ifExist = false;
          
            const numero = ctx.from;
    console.log(adapterDB.getPrevByNumber(numero).from)
        
            if(adapterDB.getPrevByNumber(numero).from == numero){
              ifExist = true;
              // Realiza alguna acción si se encontraron documentos
            } else {
              ifExist = false;
              // Realiza alguna acción si no se encontraron documentos
            }
            
      
            if(ifExist) {
              // Si existe lo enviamos al flujo de registrados.
              gotoFlow(flujoUsuariosRegistrados);
            } else {
              // Si NO existe lo enviamos al flujo de NO registrados.
              gotoFlow(flowPrincipal);
            }
          } 
        ); */

        const main = async () => {
            const adapterDB = new MongoAdapter({
                dbUri: MONGO_DB_URI,
                dbName: MONGO_DB_NAME,
            })

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
