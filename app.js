/* ----------------------------------------------------
   VALORA - Institutional Private Equity Infrastructure
   Interactive Engine & Robinhood Chain Sim
---------------------------------------------------- */

// Global State
let isWalletConnected = false;
let activeAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
let activeProvider = 'Robinhood Wallet';

// Global Toast Function (Callable from anywhere)
window.showValoraToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Global Connect Wallet Trigger
window.connectValoraWallet = async function() {
  const walletModal = document.getElementById('wallet-modal');
  const accountModal = document.getElementById('account-modal');

  if (isWalletConnected) {
    if (accountModal) {
      accountModal.style.display = 'flex';
      accountModal.style.opacity = '1';
      accountModal.style.pointerEvents = 'auto';
      accountModal.classList.add('active');
    } else {
      window.showValoraToast(`Wallet Connected: ${activeAddress.substring(0, 6)}...${activeAddress.substring(38)}`, 'success');
    }
    return;
  }

  if (walletModal) {
    const list = document.getElementById('wallet-providers-list');
    const connecting = document.getElementById('wallet-connecting-state');
    if (list) list.style.display = 'flex';
    if (connecting) connecting.style.display = 'none';

    walletModal.style.display = 'flex';
    walletModal.style.opacity = '1';
    walletModal.style.pointerEvents = 'auto';
    walletModal.classList.add('active');
  } else {
    // Instant fallback if modal DOM missing
    isWalletConnected = true;
    const btnText = document.getElementById('wallet-text');
    if (btnText) btnText.innerText = '0x71C7...976F';
    window.showValoraToast('Connected to Robinhood Wallet (0x71C7...976F)', 'success');
  }
};

window.closeValoraModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    setTimeout(() => { modal.style.display = 'none'; }, 200);
  }
};

// Main DOM Logic
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  let blockNumber = 14892104;
  let totalSettledUSD = 1248920400;
  let totalTxCount = 12842;

  const initialLedger = [
    { txHash: '0x3f6a89c1a3', type: 'Capital Call', fund: 'Valora Growth Fund III', amount: 5250000, status: 'Settled', block: 14892102, date: '1 min ago' },
    { txHash: '0x9b1c74d2e8', type: 'Distribution', fund: 'Robinhood VC Fund II', amount: 2100000, status: 'Settled', block: 14892098, date: '4 mins ago' },
    { txHash: '0x1a89f6c0d5', type: 'Management Fee', fund: 'Valora Growth Fund III', amount: 105000, status: 'Settled', block: 14892091, date: '8 mins ago' },
    { txHash: '0x7e2d90c1f4', type: 'Capital Call', fund: 'Global Buyout Partners V', amount: 8400000, status: 'Pending', block: 14892088, date: '12 mins ago' },
    { txHash: '0x4c2a78e1b9', type: 'Secondary Swap', fund: 'Apex Infrastructure Fund', amount: 1750000, status: 'Settled', block: 14892076, date: '18 mins ago' },
    { txHash: '0x8d90e2f1a5', type: 'Distribution', fund: 'Valora Growth Fund III', amount: 4100000, status: 'Escrowed', block: 14892065, date: '25 mins ago' }
  ];

  const complianceLogs = [
    { id: 'AUD-88091', entity: 'BlackRock PE Fund LP', zkhash: '0x9a8f...21c9', status: 'VERIFIED', jurisdiction: 'United States (SEC)', time: '2026-07-21 08:14:02' },
    { id: 'AUD-88092', entity: 'Temasek Capital Holdings', zkhash: '0x7b12...99e4', status: 'VERIFIED', jurisdiction: 'Singapore (MAS)', time: '2026-07-21 08:10:45' },
    { id: 'AUD-88093', entity: 'Allianz Global Private Assets', zkhash: '0x3c45...77a1', status: 'CLEARED', jurisdiction: 'Germany (BaFin)', time: '2026-07-21 08:02:11' },
    { id: 'AUD-88094', entity: 'Mubadala Investment Co.', zkhash: '0x1d99...66f2', status: 'ESCROW', jurisdiction: 'UAE (FSRA)', time: '2026-07-21 07:55:30' },
    { id: 'AUD-88095', entity: 'Sequoia Heritage Partners', zkhash: '0x6e88...33b0', status: 'VERIFIED', jurisdiction: 'United States (SEC)', time: '2026-07-21 07:42:19' }
  ];

  // Contract Copy Buttons
  const btnCopyCa = document.getElementById('btn-copy-ca');
  if (btnCopyCa) {
    btnCopyCa.addEventListener('click', () => {
      const caText = document.getElementById('ca-text').innerText;
      navigator.clipboard.writeText(caText);
      const copyTextSpan = document.getElementById('copy-text');
      if (copyTextSpan) copyTextSpan.innerText = 'Copied!';
      window.showValoraToast('Robinhood Chain CA copied to clipboard!');
      setTimeout(() => { if (copyTextSpan) copyTextSpan.innerText = 'Copy'; }, 2500);
    });
  }

  document.querySelectorAll('.btn-copy-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText('0xVAL0RA7796d10398A2f1b40019C8RobinhoodChain');
      window.showValoraToast('Robinhood Chain CA copied to clipboard!');
    });
  });

  // Modal Close Buttons
  const btnCloseWallet = document.getElementById('btn-close-wallet-modal');
  const btnCloseAccount = document.getElementById('btn-close-account-modal');
  if (btnCloseWallet) btnCloseWallet.addEventListener('click', () => window.closeValoraModal('wallet-modal'));
  if (btnCloseAccount) btnCloseAccount.addEventListener('click', () => window.closeValoraModal('account-modal'));

  ['wallet-modal', 'account-modal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeValoraModal(id);
      });
    }
  });

  // Handle Provider Option Buttons
  document.querySelectorAll('.wallet-provider-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const provider = btn.getAttribute('data-provider');
      const list = document.getElementById('wallet-providers-list');
      const connecting = document.getElementById('wallet-connecting-state');
      const textStatus = document.getElementById('connecting-status-text');

      if (list) list.style.display = 'none';
      if (connecting) connecting.style.display = 'flex';
      if (textStatus) textStatus.innerText = `Connecting to ${provider}...`;

      // Try Real Web3 Extension if available
      if ((provider === 'MetaMask' || provider === 'Coinbase Wallet') && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            window.closeValoraModal('wallet-modal');
            completeConnection(accounts[0], provider);
            return;
          }
        } catch (err) {
          console.warn('Web3 user cancelled', err);
        }
      }

      // Default Simulation Delay
      setTimeout(() => {
        window.closeValoraModal('wallet-modal');
        completeConnection('0x71C7656EC7ab88b098defB751B7401B5f6d8976F', provider);
      }, 700);
    });
  });

  function completeConnection(address, providerName) {
    isWalletConnected = true;
    activeAddress = address;
    activeProvider = providerName;

    const shortAddr = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    const textSpan = document.getElementById('wallet-text');
    if (textSpan) textSpan.innerText = shortAddr;

    const fullAddrEl = document.getElementById('account-full-addr');
    if (fullAddrEl) fullAddrEl.innerText = address;

    const btnWallet = document.getElementById('btn-connect-wallet');
    if (btnWallet) {
      btnWallet.classList.add('btn-glass');
      btnWallet.style.borderColor = '#00FF66';
    }

    window.showValoraToast(`Connected to ${providerName} (${shortAddr})`, 'success');
  }

  // Account Disconnect
  const btnDisconnect = document.getElementById('btn-disconnect-wallet');
  if (btnDisconnect) {
    btnDisconnect.addEventListener('click', () => {
      isWalletConnected = false;
      window.closeValoraModal('account-modal');

      const textSpan = document.getElementById('wallet-text');
      if (textSpan) textSpan.innerText = 'Connect Wallet';

      const btnWallet = document.getElementById('btn-connect-wallet');
      if (btnWallet) {
        btnWallet.classList.remove('btn-glass');
        btnWallet.style.borderColor = '';
      }

      window.showValoraToast('Wallet disconnected', 'info');
    });
  }

  // Copy Account Address in Modal
  const btnCopyAccAddr = document.getElementById('btn-copy-account-addr');
  if (btnCopyAccAddr) {
    btnCopyAccAddr.addEventListener('click', () => {
      navigator.clipboard.writeText(activeAddress);
      window.showValoraToast('Wallet address copied to clipboard!', 'success');
    });
  }

  // View on Explorer
  const btnExplorer = document.getElementById('btn-explorer');
  if (btnExplorer) {
    btnExplorer.addEventListener('click', () => {
      window.showValoraToast(`Viewing ${activeAddress.substring(0, 8)}... on Robinhood Explorer`, 'info');
    });
  }

  // Live Block Height Ticker
  const blockEl = document.getElementById('block-height');
  setInterval(() => {
    blockNumber += 1;
    if (blockEl) blockEl.innerText = `#${blockNumber.toLocaleString()}`;
  }, 3500);

  // Tab Switcher
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const contentEl = document.getElementById(targetTab);
      if (contentEl) contentEl.classList.add('active');
    });
  });

  // Feature Cards Click Navigation
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', () => {
      const dappSec = document.getElementById('dapp-section');
      if (dappSec) dappSec.scrollIntoView({ behavior: 'smooth' });
      const featType = card.getAttribute('data-feature');
      if (featType === 'pe-payments') switchTab('tab-payment');
      else if (featType === 'tokenized-asset') switchTab('tab-tokens');
      else if (featType === 'escrow') switchTab('tab-escrow');
      else if (featType === 'global-transfers') switchTab('tab-fx');
      else if (featType === 'compliance') switchTab('tab-compliance');
    });
  });

  function switchTab(tabId) {
    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (btn) btn.click();
  }

  // Chart.js Init
  if (window.Chart) {
    const ctxVol = document.getElementById('volumeChart');
    if (ctxVol) {
      const gradVol = ctxVol.getContext('2d').createLinearGradient(0, 0, 0, 200);
      gradVol.addColorStop(0, 'rgba(0, 255, 102, 0.45)');
      gradVol.addColorStop(1, 'rgba(0, 255, 102, 0.0)');

      new Chart(ctxVol, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Settlement Volume ($M)',
            data: [650, 720, 840, 910, 1050, 1180, 1248],
            borderColor: '#00FF66',
            borderWidth: 3,
            backgroundColor: gradVol,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#39FF14',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(0, 255, 102, 0.08)' }, ticks: { color: '#9CA3AF' } },
            y: { grid: { color: 'rgba(0, 255, 102, 0.08)' }, ticks: { color: '#9CA3AF' } }
          }
        }
      });
    }

    const ctxAlloc = document.getElementById('allocationChart');
    if (ctxAlloc) {
      new Chart(ctxAlloc, {
        type: 'doughnut',
        data: {
          labels: ['Capital Calls', 'LP Distributions', 'Management Fees', 'Secondary Swaps'],
          datasets: [{
            data: [42, 35, 13, 10],
            backgroundColor: ['#00FF66', '#39FF14', '#00E605', '#10B981'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#F3F4F6', font: { family: 'Plus Jakarta Sans', size: 11 } }
            }
          }
        }
      });
    }
  }

  // Render Ledger
  function renderLedger() {
    const tbody = document.getElementById('ledger-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    initialLedger.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code>${item.txHash}</code></td>
        <td><span class="badge badge-outline">${item.type}</span></td>
        <td><strong>${item.fund}</strong></td>
        <td>$${item.amount.toLocaleString()}</td>
        <td><span class="badge ${item.status === 'Settled' ? 'badge-success' : item.status === 'Pending' ? 'badge-warning' : 'badge-rh'}">${item.status}</span></td>
        <td>#${item.block}</td>
        <td class="text-muted text-xs">${item.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  renderLedger();

  const btnRefreshLedger = document.getElementById('btn-refresh-ledger');
  if (btnRefreshLedger) {
    btnRefreshLedger.addEventListener('click', () => {
      renderLedger();
      window.showValoraToast('Ledger synced with Robinhood Chain block state');
    });
  }

  // Payment Form Execution
  const payForm = document.getElementById('payment-form');
  if (payForm) {
    payForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const payType = document.getElementById('pay-type').value;
      const payFund = document.getElementById('pay-fund').value;
      const payAmount = parseFloat(document.getElementById('pay-amount').value);
      const recipient = document.getElementById('pay-recipient').value;
      const tokenAsset = document.getElementById('pay-token').value;

      const txHash = '0x' + Math.random().toString(16).substring(2, 12);
      const logs = document.getElementById('payment-terminal-logs');

      appendLog(logs, `[TX INIT] Creating ${payType} on Robinhood Chain...`, 'color-cyan');
      appendLog(logs, `[VALORA ESCROW] Validating ZK-KYC Whitelist for ${recipient.substring(0, 10)}...`, 'text-muted');

      setTimeout(() => {
        appendLog(logs, `[NETWORK] Broadcasting to Robinhood Chain Node...`, 'text-muted');
      }, 500);

      setTimeout(() => {
        appendLog(logs, `[CONFIRMED] Settlement Complete! TX Hash: ${txHash}`, 'color-green');
        appendLog(logs, `[FINALITY] Amount: $${payAmount.toLocaleString()} settled via ${tokenAsset}`, 'color-purple');

        initialLedger.unshift({
          txHash,
          type: payType,
          fund: payFund,
          amount: payAmount,
          status: 'Settled',
          block: blockNumber,
          date: 'Just now'
        });

        totalSettledUSD += payAmount;
        totalTxCount += 1;

        const volEl = document.getElementById('dash-val-volume');
        const txsEl = document.getElementById('dash-val-txs');
        if (volEl) volEl.innerText = `$${totalSettledUSD.toLocaleString()}`;
        if (txsEl) txsEl.innerText = totalTxCount.toLocaleString();

        const liveTxMeta = document.getElementById('live-tx-meta');
        if (liveTxMeta) liveTxMeta.innerText = `${payFund} • $${payAmount.toLocaleString()}`;

        renderLedger();
        window.showValoraToast(`Payment of $${payAmount.toLocaleString()} executed on Robinhood Chain!`, 'success');
      }, 1200);
    });
  }

  function appendLog(parent, text, colorClass = '') {
    if (!parent) return;
    const div = document.createElement('div');
    div.className = `log-line ${colorClass}`;
    div.innerText = text;
    parent.appendChild(div);
    parent.scrollTop = parent.scrollHeight;
  }

  // Token Mint Buttons
  document.querySelectorAll('.btn-mint-token').forEach(btn => {
    btn.addEventListener('click', () => {
      const token = btn.getAttribute('data-token');
      window.showValoraToast(`Initiating ERC-3643 share mint for ${token}...`, 'success');
    });
  });

  // Escrow Form
  const escrowForm = document.getElementById('escrow-form');
  if (escrowForm) {
    escrowForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('escrow-title').value;
      const amount = parseFloat(document.getElementById('escrow-amount').value);
      const condition = document.getElementById('escrow-condition').value;

      const list = document.getElementById('escrow-vault-list');
      if (list) {
        const vaultDiv = document.createElement('div');
        vaultDiv.className = 'vault-item';
        vaultDiv.innerHTML = `
          <div class="vault-item-header">
            <strong>${title}</strong>
            <span class="badge badge-warning">Locked in Escrow</span>
          </div>
          <div class="vault-item-details">
            <div>Amount: <strong>$${amount.toLocaleString()} USD</strong></div>
            <div>Condition: <span>${condition}</span></div>
            <div>Vault Contract: <code>0x${Math.random().toString(16).substring(2, 10)}</code></div>
          </div>
          <button class="btn btn-sm btn-success mt-2 btn-release-escrow">Release Funds</button>
        `;
        list.prepend(vaultDiv);
        bindEscrowRelease(vaultDiv.querySelector('.btn-release-escrow'));
      }

      window.showValoraToast(`Smart Escrow Vault deployed on Robinhood Chain!`, 'success');
    });
  }

  function bindEscrowRelease(btn) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const parent = btn.closest('.vault-item');
      const badge = parent.querySelector('.badge');
      if (badge) {
        badge.className = 'badge badge-success';
        badge.innerText = 'Released / Settled';
      }
      btn.remove();
      window.showValoraToast('Escrow funds released to LP recipient', 'success');
    });
  }

  document.querySelectorAll('.btn-release-escrow').forEach(btn => bindEscrowRelease(btn));

  // FX Engine
  const rates = { USD: 1, EUR: 0.9205, GBP: 0.7850, SGD: 1.3420, JPY: 155.40 };
  const fxAmountFrom = document.getElementById('fx-amount-from');
  const fxAmountTo = document.getElementById('fx-amount-to');
  const fxCurrFrom = document.getElementById('fx-curr-from');
  const fxCurrTo = document.getElementById('fx-curr-to');
  const fxRateDisplay = document.getElementById('fx-rate-display');
  const fxBtnSwap = document.getElementById('fx-btn-swap');
  const btnExecuteFx = document.getElementById('btn-execute-fx');

  function calculateFx() {
    if (!fxAmountFrom || !fxAmountTo || !fxCurrFrom || !fxCurrTo) return;
    const amount = parseFloat(fxAmountFrom.value) || 0;
    const cFrom = fxCurrFrom.value;
    const cTo = fxCurrTo.value;

    const rateInUSD = amount / rates[cFrom];
    const converted = rateInUSD * rates[cTo];

    fxAmountTo.value = converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const unitRate = (1 / rates[cFrom]) * rates[cTo];
    if (fxRateDisplay) {
      fxRateDisplay.innerText = `1 ${cFrom} = ${unitRate.toFixed(4)} ${cTo}`;
    }
  }

  if (fxAmountFrom) fxAmountFrom.addEventListener('input', calculateFx);
  if (fxCurrFrom) fxCurrFrom.addEventListener('change', calculateFx);
  if (fxCurrTo) fxCurrTo.addEventListener('change', calculateFx);

  if (fxBtnSwap) {
    fxBtnSwap.addEventListener('click', () => {
      const temp = fxCurrFrom.value;
      fxCurrFrom.value = fxCurrTo.value;
      fxCurrTo.value = temp;
      calculateFx();
    });
  }

  if (btnExecuteFx) {
    btnExecuteFx.addEventListener('click', () => {
      window.showValoraToast(`Global Cross-Border FX Settlement executed!`, 'success');
    });
  }

  calculateFx();

  // Compliance Table
  function renderCompliance(data) {
    const tbody = document.getElementById('compliance-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    data.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code>${log.id}</code></td>
        <td><strong>${log.entity}</strong></td>
        <td><code>${log.zkhash}</code></td>
        <td><span class="badge ${log.status === 'VERIFIED' ? 'badge-success' : 'badge-rh'}">${log.status}</span></td>
        <td>${log.jurisdiction}</td>
        <td class="text-muted text-xs">${log.time}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  renderCompliance(complianceLogs);

  const complianceSearch = document.getElementById('compliance-search');
  const complianceFilter = document.getElementById('compliance-filter');

  function filterCompliance() {
    const searchVal = complianceSearch ? complianceSearch.value.toLowerCase() : '';
    const filterVal = complianceFilter ? complianceFilter.value : 'ALL';

    const filtered = complianceLogs.filter(log => {
      const matchesSearch = log.entity.toLowerCase().includes(searchVal) ||
                            log.id.toLowerCase().includes(searchVal) ||
                            log.zkhash.toLowerCase().includes(searchVal);
      const matchesFilter = (filterVal === 'ALL') || (log.status === filterVal);
      return matchesSearch && matchesFilter;
    });

    renderCompliance(filtered);
  }

  if (complianceSearch) complianceSearch.addEventListener('input', filterCompliance);
  if (complianceFilter) complianceFilter.addEventListener('change', filterCompliance);

  const btnExportAudit = document.getElementById('btn-export-audit');
  if (btnExportAudit) {
    btnExportAudit.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(complianceLogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `valora_compliance_audit_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      window.showValoraToast('Compliance audit trail exported to JSON!', 'success');
    });
  }
});
