import fs from 'fs';
const wkt = `POLYGON ((77.46 12.83, 77.78 12.83, 77.78 13.14, 77.46 13.14, 77.46 12.83))`;
const token = '0722df78fa8c1f0d464610f9b21e4b29a093ef9b';
const params = new URLSearchParams({
    polygon: wkt,
    year: '2018_19',
    option: 'json',
    token: token,
});

const bhuvanUrl = `https://bhuvan-app1.nrsc.gov.in/api/lulc250k/curl_lulc250k.php?${params.toString()}`;

async function testProxies() {
    const proxies = [
        // 1. Thingproxy
        `https://thingproxy.freeboard.io/fetch/${bhuvanUrl}`,
        // 2. allorigins (JSONP style but getContents)
        `https://api.allorigins.win/get?url=${encodeURIComponent(bhuvanUrl)}`,
        // 3. corsproxy.github.io
        `https://crossorigin.me/${bhuvanUrl}`
    ];

    for (const p of proxies) {
        try {
            console.log('Testing', p.split('/')[2]);
            const res = await fetch(p, {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Origin': 'https://dheerajpapani.github.io'
                }
            });
            if (!res.ok) {
                console.log(`  Failed HTTP ${res.status}`);
                continue;
            }
            const data = await res.text();
            console.log(`  Success! Length: ${data.length}`);

            // If it's allorigins, extract contents
            let content = data;
            if (p.includes('allorigins')) {
                const json = JSON.parse(data);
                content = json.contents;
            }

            const stripped = content.replace(/<[^>]*>/g, '').trim();
            const jsonStart = stripped.indexOf('[');
            if (jsonStart !== -1) {
                console.log(`  JSON found and extracted!`);
                return; // We have a winner
            } else {
                console.log(`  No JSON inside.`);
            }
        } catch (e) {
            console.log(`  Error: ${e.message}`);
        }
    }
}

testProxies();
