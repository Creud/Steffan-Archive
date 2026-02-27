export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  const tokens = [
    { symbol: 'FARTCOIN', mint: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump' },
    { symbol: 'SKR',      mint: 'SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3' },
    { symbol: 'SOL',      mint: 'So11111111111111111111111111111111111111112' },
  ];

  try {
    const ids = tokens.map(t => t.mint).join(',');
    const url = `https://lite-api.jup.ag/price/v2?ids=${ids}`;
    const resp = await fetch(url);
    const json = await resp.json();

    const result = tokens.map(t => {
      const d = json.data?.[t.mint];
      return {
        symbol: t.symbol,
        mint: t.mint,
        price: d?.price ? parseFloat(d.price) : null,
      };
    });

    res.status(200).json({ ok: true, prices: result, updatedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
