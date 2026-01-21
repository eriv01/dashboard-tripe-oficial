import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (!admin.apps.length) {
  // Forma garantida de ler o arquivo na Vercel
  const keyPath = path.join(process.cwd(), 'api', 'serviceAccountKey.json');
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  
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
    console.error(e);
    return res.status(500).send(e.message);
  }
}
