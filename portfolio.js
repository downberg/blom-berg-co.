/*
 * Demo portfolio script for CryptoHub.
 *
 * This script populates a table with some predefined crypto holdings and
 * attempts to fetch live price data from CoinGecko to calculate the USD
 * value of each position. If the fetch fails (e.g. due to CORS or network
 * issues), fallback prices are used instead. The result is displayed in
 * the table body.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Define a few sample holdings. Each entry contains a CoinGecko id
  // (used for API requests), a display name and the amount held.
  const holdings = [
    { id: 'bitcoin', name: 'Bitcoin (BTC)', amount: 0.5 },
    { id: 'ethereum', name: 'Ethereum (ETH)', amount: 2 },
    { id: 'binancecoin', name: 'Binance Coin (BNB)', amount: 10 }
  ];

  // Fallback prices in case the API request fails
  const fallbackPrices = {
    bitcoin: 60000,
    ethereum: 2000,
    binancecoin: 300
  };

  const tbody = document.getElementById('portfolio-body');
  const errorEl = document.getElementById('portfolio-error');

  // Helper to render the table rows
  function renderRows(prices) {
    tbody.innerHTML = '';
    let total = 0;
    holdings.forEach((coin) => {
      const price = prices[coin.id]?.usd || fallbackPrices[coin.id] || 0;
      const value = price * coin.amount;
      total += value;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${coin.name}</td>
        <td>${coin.amount}</td>
        <td>$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td>$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      `;
      tbody.appendChild(row);
    });
    // Append total row
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
      <td colspan="3" style="font-weight:bold">Gesamtwert</td>
      <td style="font-weight:bold">$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    `;
    tbody.appendChild(totalRow);
  }

  // Try to fetch live prices from CoinGecko
  async function fetchPrices() {
    const ids = holdings.map((h) => h.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      renderRows(data);
    } catch (err) {
      console.warn('Preisabruf fehlgeschlagen, verwende Fallback-Werte:', err);
      errorEl.textContent = 'Live‑Preise konnten nicht geladen werden. Statische Werte werden verwendet.';
      renderRows({});
    }
  }

  fetchPrices();
});