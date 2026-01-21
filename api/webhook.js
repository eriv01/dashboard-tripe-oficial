import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Agora ele procura na mesma pasta, sem o ../
  import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://projeto-tripe-oficial-default-rtdb.firebaseio.com"
  } );
}

const db = admin.database();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Erro');

  try {
    const data = req.body;
    const sessionId = data.external_id;
    if (!sessionId) return res.status(200).send("Sem ID");

    let novoStatus = 'checkout_clicked';
    if (data.status === 'approved') novoStatus = 'paid';
    if (data.status === 'pending') novoStatus = 'waiting_payment';

    await db.ref(`sessions/${sessionId}`).update({
      status: novoStatus,
      payment_status: data.status,
      last_webhook_update: Date.now()
    });

    return res.status(200).send('Sucesso');
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
