export default async function handler(req, res) {
    // A Wiapy envia os dados via POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    // Pegamos o ID da sessão e o status da venda que a Wiapy enviou
    const { external_id, status } = req.body;

    if (!external_id) {
        return res.status(400).json({ error: 'external_id não encontrado' });
    }

    // URL do seu banco de dados Firebase
    const firebaseURL = `https://projeto-tripe-oficial-default-rtdb.firebaseio.com/sessions/${external_id}.json`;

    try {
        let saleStatus = 'abandon';
        // Mapeamos os status da Wiapy para o seu Dashboard
        if (status === 'approved' || status === 'paid' ) saleStatus = 'paid';
        if (status === 'pending' || status === 'waiting_payment') saleStatus = 'pending';

        // Enviamos a atualização para o Firebase
        await fetch(firebaseURL, {
            method: 'PATCH',
            body: JSON.stringify({ saleStatus: saleStatus }),
            headers: { 'Content-Type': 'application/json' }
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
