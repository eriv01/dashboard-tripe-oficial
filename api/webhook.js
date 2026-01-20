<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inteligência TRIPE - Dashboard Ultra v8.9 (FULL ANALYTICS)</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root { --primary: #ef4444; --bg: #0a0a0a; --card: #141414; --text: #ffffff; --muted: #9ca3af; --border: #262626; --success: #22c55e; --gold: #fbbf24; --blue: #3b82f6; }
        body { font-family: 'Inter', sans-serif; background: var(--bg ); color: var(--text); margin: 0; padding: 20px; overflow-x: hidden; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid var(--border); padding-bottom: 20px; }
        .header h1 { font-weight: 900; font-size: 28px; letter-spacing: -1px; display: flex; align-items: center; gap: 10px; }
        .btn-reset { background: rgba(239, 68, 68, 0.1); color: var(--primary); border: 1px solid var(--primary); padding: 10px 20px; border-radius: 8px; font-size: 12px; font-weight: 900; cursor: pointer; transition: all 0.2s; }
        .btn-reset:hover { background: var(--primary); color: white; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .stat-card { background: var(--card); border: 1px solid var(--border); padding: 20px; border-radius: 20px; }
        .stat-label { color: var(--muted); font-size: 10px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; display: block; }
        .stat-value { font-size: 28px; font-weight: 900; display: block; }
        
        .main-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-bottom: 20px; }
        .card { background: var(--card); border: 1px solid var(--border); padding: 25px; border-radius: 24px; margin-bottom: 20px; }
        .card-title { font-size: 14px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; color: var(--primary); }
        
        /* Performance de Variantes Visual */
        .variant-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .variant-group { background: #0f0f0f; border: 1px solid var(--border); border-radius: 16px; padding: 20px; }
        .variant-group-title { font-size: 12px; font-weight: 900; color: var(--muted); text-transform: uppercase; margin-bottom: 15px; border-bottom: 1px solid var(--border); padding-bottom: 10px; display: flex; justify-content: space-between; }
        .variant-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; padding: 10px; border-radius: 8px; transition: all 0.3s; border: 1px solid transparent; }
        .variant-row.winner { border-color: var(--success); background: rgba(34, 197, 94, 0.05); }
        .variant-info { display: flex; justify-content: space-between; align-items: center; }
        .variant-name { font-weight: 700; font-size: 13px; }
        .variant-stats { font-size: 10px; color: var(--muted); }
        .variant-rate { font-weight: 900; font-size: 14px; color: var(--text); }
        .variant-row.winner .variant-rate { color: var(--success); }
        .progress-bg { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--primary); border-radius: 3px; transition: width 1s ease; }
        .variant-row.winner .progress-fill { background: var(--success); }

        /* Histórico em Sanfona */
        .history-item { border: 1px solid var(--border); border-radius: 12px; margin-bottom: 15px; overflow: hidden; }
        .history-header { background: #1a1a1a; padding: 18px; cursor: pointer; display: flex; justify-content: space-between; font-weight: 900; font-size: 14px; transition: background 0.2s; border-left: 4px solid var(--primary); }
        .history-header:hover { background: #262626; }
        .history-content { padding: 25px; display: none; background: #0f0f0f; border-top: 1px solid var(--border); }
        .history-sub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 20px; }
        .history-mini-card { background: var(--card); padding: 15px; border-radius: 12px; border: 1px solid var(--border); }
        .history-mini-label { font-size: 10px; color: var(--muted); text-transform: uppercase; margin-bottom: 10px; font-weight: 900; }

        /* Monitor de Usuários */
        .activity-list { display: flex; flex-direction: column; gap: 10px; max-height: 500px; overflow-y: auto; }
        .activity-item { background: #0f0f0f; border: 1px solid var(--border); border-radius: 12px; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
        .activity-item.online { border-left: 4px solid var(--success); }
        .activity-item.paid { border-color: var(--success); background: rgba(34, 197, 94, 0.05); }
        .user-tag { font-weight: 900; font-size: 12px; display: flex; align-items: center; gap: 8px; }
        .user-num { background: var(--primary); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        .status-badge { font-size: 9px; font-weight: 900; padding: 3px 6px; border-radius: 4px; text-transform: uppercase; }
        .badge-paid { background: var(--success); color: black; }
        .badge-pending { background: var(--gold); color: black; }
        
        .live-tag { background: var(--success); color: black; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 900; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 TRIPE <span style="color: var(--primary)">ULTRA v8.9</span></h1>
            <div style="display: flex; gap: 15px; align-items: center;">
                <div class="live-tag">WIAPY CONNECTED</div>
                <button class="btn-reset" id="reset-btn">🔄 RESET TOTAL</button>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card"><span class="stat-label">Visitas</span><span class="stat-value" id="total-visits">0</span></div>
            <div class="stat-card"><span class="stat-label">Pagas (Wiapy)</span><span class="stat-value" id="total-paid" style="color: var(--success)">0</span></div>
            <div class="stat-card"><span class="stat-label">Geradas</span><span class="stat-value" id="total-pending" style="color: var(--gold)">0</span></div>
            <div class="stat-card"><span class="stat-label">ROI Real</span><span class="stat-value" id="roi-rate">0.0%</span></div>
            <div class="stat-card"><span class="stat-label">Online</span><span class="stat-value" id="online-now" style="color: var(--gold)">0</span></div>
        </div>

        <div class="main-grid">
            <div class="card">
                <div class="card-title">📈 Fluxo de Acessos (24h)</div>
                <canvas id="hourChart" height="180"></canvas>
            </div>
            <div class="card">
                <div class="card-title">📊 Funil de Fuga (Drop-off)</div>
                <canvas id="funnelChart" height="200"></canvas>
            </div>
        </div>

        <div class="card">
            <div class="card-title">🧪 Performance de Variantes (Conversão Real)</div>
            <div class="variant-grid" id="variant-display">
                <div class="variant-group">
                    <div class="variant-group-title"><span>Ângulos de Saudação</span> <span id="saudacao-total">0 testes</span></div>
                    <div id="group-saudacao"></div>
                </div>
                <div class="variant-group">
                    <div class="variant-group-title"><span>Ângulos de Resultado</span> <span id="resultado-total">0 testes</span></div>
                    <div id="group-resultado"></div>
                </div>
                <div class="variant-group">
                    <div class="variant-group-title"><span>Ângulos de CTA</span> <span id="cta-total">0 testes</span></div>
                    <div id="group-cta"></div>
                </div>
            </div>
        </div>

        <div class="main-grid">
            <div class="card">
                <div class="card-title">📂 Histórico Inteligente (7 Dias)</div>
                <div id="history-list"></div>
            </div>
            <div class="card">
                <div class="card-title">🔴 Monitor de Usuários em Tempo Real</div>
                <div class="activity-list" id="activity-list"></div>
            </div>
        </div>
    </div>

    <script type="module">
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
        import { getDatabase, ref, onValue, remove, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

        const firebaseConfig = {
            apiKey: "AIzaSyCDYmSVU2xVVuLw0vu3svKI7n4hvdxjW0w",
            authDomain: "projeto-tripe-oficial.firebaseapp.com",
            databaseURL: "https://projeto-tripe-oficial-default-rtdb.firebaseio.com",
            projectId: "projeto-tripe-oficial",
            storageBucket: "projeto-tripe-oficial.firebasestorage.app",
            messagingSenderId: "274742031259",
            appId: "1:274742031259:web:18dc5c086fe3d58b56673e"
        };

        const app = initializeApp(firebaseConfig );
        const db = getDatabase(app);

        let hourChart, funnelChart;

        function initCharts() {
            const ctxH = document.getElementById('hourChart').getContext('2d');
            hourChart = new Chart(ctxH, {
                type: 'line',
                data: { labels: Array.from({length: 24}, (_, i) => i+'h'), datasets: [{ label: 'Visitas', data: new Array(24).fill(0), borderColor: '#ef4444', tension: 0.4, fill: true, backgroundColor: 'rgba(239, 68, 68, 0.1)' }] },
                options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#262626' } }, x: { grid: { display: false } } } }
            });

            const ctxF = document.getElementById('funnelChart').getContext('2d');
            funnelChart = new Chart(ctxF, {
                type: 'bar',
                data: { 
                    labels: ['Início', 'P1', 'P7', 'Fotos', 'Res', 'Chk'], 
                    datasets: [{ data: new Array(6).fill(0), backgroundColor: '#ef4444', borderRadius: 5 }] 
                },
                options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#262626' } } } }
            });
        }

        onValue(ref(db, 'sessions'), (snapshot) => {
            const data = snapshot.val() || {};
            const sessions = Object.values(data).sort((a,b) => b.lastUpdate - a.lastUpdate);
            const now = Date.now();
            
            // Stats
            const paid = sessions.filter(s => s.saleStatus === 'paid').length;
            const pending = sessions.filter(s => s.saleStatus === 'pending').length;
            document.getElementById('total-visits').innerText = sessions.length;
            document.getElementById('total-paid').innerText = paid;
            document.getElementById('total-pending').innerText = pending;
            document.getElementById('roi-rate').innerText = sessions.length > 0 ? ((paid/sessions.length)*100).toFixed(1)+'%' : '0.0%';
            document.getElementById('online-now').innerText = sessions.filter(s => now - s.lastUpdate < 60000).length;

            // Hour Chart
            const hours = new Array(24).fill(0);
            sessions.forEach(s => { const h = new Date(s.enteredAt).getHours(); hours[h]++; });
            hourChart.data.datasets[0].data = hours;
            hourChart.update();

            // Funnel Chart
            const funnelData = new Array(6).fill(0);
            sessions.forEach(s => {
                funnelData[0]++; // Início
                if (s.currentStep >= 7 || s.currentStep === 'processing' || s.currentStep === 'result' || s.status === 'checkout_clicked') funnelData[1]++;
                if (s.currentStep === 'processing' || s.currentStep === 'result' || s.status === 'checkout_clicked') funnelData[2]++;
                if (s.currentStep === 'result' || s.status === 'checkout_clicked') funnelData[3]++;
                if (s.status === 'checkout_clicked') funnelData[4]++;
                if (s.saleStatus === 'paid') funnelData[5]++;
            });
            funnelChart.data.datasets[0].data = funnelData;
            funnelChart.update();

            // Monitor de Usuários
            const activityList = document.getElementById('activity-list');
            activityList.innerHTML = sessions.slice(0, 20).map((s, idx) => {
                const isOnline = now - s.lastUpdate < 60000;
                const statusBadge = s.saleStatus === 'paid' ? '<span class="status-badge badge-paid">PAGO</span>' :
                                   s.saleStatus === 'pending' ? '<span class="status-badge badge-pending">GERADO</span>' :
                                   s.status === 'checkout_clicked' ? '<span class="status-badge" style="background:#262626">CHECKOUT</span>' :
                                   '<span class="status-badge" style="color:var(--muted)">NAVEGANDO</span>';
                
                return `
                    <div class="activity-item ${isOnline ? 'online' : ''} ${s.saleStatus === 'paid' ? 'paid' : ''}">
                        <div class="user-tag">
                            <span class="user-num">#${sessions.length - idx}</span>
                            <span>${new Date(s.lastUpdate).toLocaleTimeString()}</span>
                            ${statusBadge}
                        </div>
                        <div style="font-size:10px; color:var(--muted); display:flex; justify-content:space-between;">
                            <span>Ângulos: S${(s.variantIdx||0)+1} R${(s.variantIdx||0)+1} C${(s.variantIdx||0)+1}</span>
                            <span>Etapa: ${s.currentStep}</span>
                        </div>
                    </div>
                `;
            }).join('');

            // Histórico 7 Dias
            updateHistory(sessions);
            // Variantes
            updateVariants(sessions);
        });

        function updateHistory(sessions) {
            const historyList = document.getElementById('history-list');
            const historyData = {};
            sessions.forEach(s => {
                const date = new Date(s.enteredAt).toLocaleDateString();
                if(!historyData[date]) historyData[date] = { visits: 0, paid: 0, hours: new Array(24).fill(0) };
                historyData[date].visits++;
                if(s.saleStatus === 'paid') historyData[date].paid++;
                const h = new Date(s.enteredAt).getHours();
                historyData[date].hours[h]++;
            });

            historyList.innerHTML = Object.keys(historyData).sort((a,b) => new Date(b) - new Date(a)).slice(0, 7).map((date, idx) => {
                const d = historyData[date];
                const rate = ((d.paid/d.visits)*100).toFixed(1);
                return `
                <div class="history-item">
                    <div class="history-header" onclick="const c = this.nextElementSibling; c.style.display = c.style.display === 'block' ? 'none' : 'block'; if(c.style.display === 'block') renderHistoryChart('${date}', ${JSON.stringify(d.hours)}, ${idx})">
                        <span>📅 ${date}</span>
                        <span>${d.visits} Visitas | ${d.paid} Vendas | ${rate}% ROI ▾</span>
                    </div>
                    <div class="history-content">
                        <div class="history-sub-grid">
                            <div class="history-mini-card">
                                <div class="history-mini-label">Fluxo por Hora</div>
                                <canvas id="historyChart-${idx}" height="120"></canvas>
                            </div>
                            <div class="history-mini-card">
                                <div class="history-mini-label">Resumo do Dia</div>
                                <div style="font-size: 24px; font-weight: 900; color: var(--success); margin-top:20px;">${rate}% ROI</div>
                                <div style="font-size: 12px; color: var(--muted)">${d.paid} vendas confirmadas</div>
                            </div>
                        </div>
                    </div>
                </div>
            `}).join('');
        }

        window.renderHistoryChart = (date, hourData, idx) => {
            const ctx = document.getElementById(`historyChart-${idx}`).getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: { labels: Array.from({length: 24}, (_, i) => i+'h'), datasets: [{ data: hourData, backgroundColor: '#ef4444' }] },
                options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }
            });
        };

        function updateVariants(sessions) {
            const types = ['saudacao', 'resultado', 'cta'];
            types.forEach(type => {
                const groupDiv = document.getElementById(`group-${type}`);
                let totalTests = 0;
                let bestInGroup = { idx: -1, rate: -1 };
                let variants = [];
                for(let i=0; i<5; i++) {
                    const variantSessions = sessions.filter(s => s.variantIdx === i);
                    const tests = variantSessions.length;
                    const paid = variantSessions.filter(s => s.saleStatus === 'paid').length;
                    const pending = variantSessions.filter(s => s.saleStatus === 'pending').length;
                    const rate = tests > 0 ? (paid/tests*100) : 0;
                    totalTests += tests;
                    if (rate > bestInGroup.rate && tests > 0) bestInGroup = { idx: i, rate: rate };
                    variants.push({ idx: i, tests, paid, pending, rate });
                }
                document.getElementById(`${type}-total`).innerText = `${totalTests} testes`;
                groupDiv.innerHTML = variants.map(v => `
                    <div class="variant-row ${v.idx === bestInGroup.idx ? 'winner' : ''}">
                        <div class="variant-info">
                            <span class="variant-name">Ângulo ${v.idx + 1} ${v.idx === bestInGroup.idx ? '🏆' : ''}</span>
                            <span class="variant-stats">${v.tests} T | ${v.paid} P | ${v.pending} G</span>
                            <span class="variant-rate">${v.rate.toFixed(1)}%</span>
                        </div>
                        <div class="progress-bg"><div class="progress-fill" style="width: ${v.rate}%"></div></div>
                    </div>
                `).join('');
            });
        }

        document.getElementById('reset-btn').onclick = () => {
            if(confirm('⚠️ RESET TOTAL: Apagar todos os dados?')) {
                remove(ref(db, 'sessions'));
                remove(ref(db, 'optimization'));
                location.reload();
            }
        };

        initCharts();
    </script>
</body>
</html>
