const admin = require('firebase-admin');

if (!admin.apps.length) {
  // O ../ faz o código sair da pasta api e achar a chave na pasta principal
  const serviceAccount = require("../serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://projeto-tripe-oficial-default-rtdb.firebaseio.com"
  } );
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método não permitido');
  }

  try {
    const data = req.body;
    const sessionId = data.external_id;
    const statusWiapy = data.status; 
    const valor = data.value;

    if (!sessionId) {
      return res.status(200).send("OK, mas sem ID");
    }

    // Mapeamento para o seu Dashboard v9.0 Compatível
    let novoStatus = 'checkout_clicked';
    if (statusWiapy === 'approved') novoStatus = 'paid';
    if (statusWiapy === 'pending') novoStatus = 'waiting_payment';

    const sessionRef = db.ref(`sessions/${sessionId}`);
    await sessionRef.update({
      status: novoStatus,
      payment_status: statusWiapy,
      amount: valor,
      last_webhook_update: Date.now()
    });

    return res.status(200).send('Sucesso');
  } catch (error) {
    return res.status(500).send("Erro interno");
  }
}
