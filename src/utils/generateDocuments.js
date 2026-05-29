function openDocument(html) {
  const win = window.open('', '_blank');
  if (win && win.document) {
    win.document.write(html);
    win.document.close();
  } else {
    // Fallback for browsers that block popups: download as HTML file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'careu-document.html';
    a.click();
    URL.revokeObjectURL(url);
  }
}

const baseStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', -apple-system, sans-serif; background: #F8FAFC; color: #0F172A; font-size: 14px; }
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap');
  .page { max-width: 760px; margin: 40px auto; background: white; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
  .header { background: #0F172A; padding: 28px 40px; display: flex; justify-content: space-between; align-items: center; }
  .logo { font-size: 22px; font-weight: 600; color: white; letter-spacing: -0.5px; }
  .logo span { color: #2563EB; }
  .doc-type { font-size: 12px; color: #94A3B8; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .body { padding: 40px; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 32px; }
  .meta-left h2 { font-size: 20px; font-weight: 600; color: #0F172A; margin-bottom: 4px; }
  .meta-left p { font-size: 13px; color: #64748B; }
  .badge { display: inline-block; background: #DCFCE7; color: #16A34A; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 11px; font-weight: 600; color: #64748B; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 16px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .field label { font-size: 11px; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 4px; }
  .field p { font-size: 14px; color: #0F172A; font-weight: 500; }
  .amounts { border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; }
  .amount-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #E2E8F0; }
  .amount-row:last-child { border-bottom: none; }
  .amount-row.green { background: #F0FDF4; }
  .amount-row.red { background: #FEF2F2; }
  .amount-label { font-size: 13px; color: #64748B; }
  .amount-value { font-size: 14px; font-weight: 600; color: #0F172A; }
  .amount-row.green .amount-value { color: #16A34A; }
  .amount-row.red .amount-value { color: #DC2626; }
  .footer { border-top: 1px solid #E2E8F0; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; }
  .footer p { font-size: 12px; color: #94A3B8; }
  .signature-box { border: 1px solid #E2E8F0; border-radius: 6px; height: 56px; width: 220px; display: flex; align-items: flex-end; padding: 6px 10px; }
  .signature-box span { font-size: 11px; color: #CBD5E1; }
  .print-btn { position: fixed; bottom: 24px; right: 24px; background: #2563EB; color: white; border: none; border-radius: 6px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .print-btn:hover { background: #1D4ED8; }
  @media print { .print-btn { display: none; } body { background: white; } .page { border: none; margin: 0; } }
`;

export function generateEncounterForm(order) {
  const { patient, payer, product, vendor, state, calc, orderNumber } = order;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  openDocument(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Encounter Form — ${orderNumber}</title><style>${baseStyles}</style></head><body>
    <div class="page">
      <div class="header">
        <div class="logo">Care<span>U</span></div>
        <div class="doc-type">Encounter Form</div>
      </div>
      <div class="body">
        <div class="meta">
          <div class="meta-left">
            <h2>Encounter Form</h2>
            <p>Order ${orderNumber} &nbsp;·&nbsp; ${date}</p>
          </div>
          <span class="badge">Ready</span>
        </div>

        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="grid">
            <div class="field"><label>Patient Name</label><p>${patient}</p></div>
            <div class="field"><label>State</label><p>${state}</p></div>
            <div class="field"><label>Insurance / Payer</label><p>${payer}</p></div>
            <div class="field"><label>Date of Service</label><p>${date}</p></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Product & Vendor</div>
          <div class="grid">
            <div class="field"><label>Product</label><p>${product}</p></div>
            <div class="field"><label>Vendor</label><p>${vendor}</p></div>
            <div class="field"><label>Order Number</label><p>${orderNumber}</p></div>
            <div class="field"><label>Diagnosis Category</label><p>—</p></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Billing Summary</div>
          <div class="amounts">
            <div class="amount-row"><span class="amount-label">Cost per unit</span><span class="amount-value">$${calc.costPerUnit.toFixed(2)}</span></div>
            <div class="amount-row"><span class="amount-label">Billable amount</span><span class="amount-value">$${calc.billable.toFixed(2)}</span></div>
            <div class="amount-row"><span class="amount-label">Insurance covers (80%)</span><span class="amount-value">$${calc.insuranceCovers.toFixed(2)}</span></div>
            <div class="amount-row green"><span class="amount-label">Margin</span><span class="amount-value">$${calc.margin.toFixed(2)}</span></div>
            <div class="amount-row red"><span class="amount-label">Patient responsibility</span><span class="amount-value">$${calc.patientOwes.toFixed(2)}</span></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Physician Signature</div>
          <div style="display:flex;gap:32px;align-items:flex-end;">
            <div>
              <div class="signature-box"><span>Signature</span></div>
              <p style="font-size:11px;color:#94A3B8;margin-top:4px;">Authorized provider</p>
            </div>
            <div>
              <div class="signature-box"><span>Date</span></div>
              <p style="font-size:11px;color:#94A3B8;margin-top:4px;">Date signed</p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>CareU Internal — ${orderNumber} — ${date}</p>
        <p>Confidential. For internal use only.</p>
      </div>
    </div>
    <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
  </body></html>`);
}

export function generatePatientInvoice(order) {
  const { patient, payer, product, vendor, state, calc, orderNumber } = order;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  openDocument(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Patient Invoice — ${orderNumber}</title><style>${baseStyles}
    .invoice-total { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
    .invoice-total-label { font-size: 14px; color: #2563EB; font-weight: 600; }
    .invoice-total-value { font-size: 28px; font-weight: 600; color: #2563EB; }
  </style></head><body>
    <div class="page">
      <div class="header">
        <div class="logo">Care<span>U</span></div>
        <div class="doc-type">Patient Invoice</div>
      </div>
      <div class="body">
        <div class="meta">
          <div class="meta-left">
            <h2>Invoice #${orderNumber}</h2>
            <p>Issued ${date} &nbsp;·&nbsp; Due ${dueDate}</p>
          </div>
          <span class="badge">Pending Payment</span>
        </div>

        <div class="section">
          <div class="section-title">Billed To</div>
          <div class="grid">
            <div class="field"><label>Patient Name</label><p>${patient}</p></div>
            <div class="field"><label>State</label><p>${state}</p></div>
            <div class="field"><label>Insurance</label><p>${payer}</p></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Service Detail</div>
          <div class="amounts">
            <div class="amount-row"><span class="amount-label">${product} — supplied by ${vendor}</span><span class="amount-value">$${calc.billable.toFixed(2)}</span></div>
            <div class="amount-row"><span class="amount-label">Insurance adjustment (${payer})</span><span class="amount-value" style="color:#16A34A">− $${calc.insuranceCovers.toFixed(2)}</span></div>
          </div>
          <div class="invoice-total">
            <span class="invoice-total-label">Amount Due from Patient</span>
            <span class="invoice-total-value">$${calc.patientOwes.toFixed(2)}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Payment Instructions</div>
          <div class="grid">
            <div class="field"><label>Payment Due</label><p>${dueDate}</p></div>
            <div class="field"><label>Order Reference</label><p>${orderNumber}</p></div>
          </div>
          <p style="margin-top:16px;font-size:13px;color:#64748B;line-height:1.6;">Please include your order number when submitting payment. For questions about this invoice, contact your CareU representative. Coverage assumes 80% from selected payer. Final amounts may vary based on deductible status.</p>
        </div>
      </div>
      <div class="footer">
        <p>CareU Internal — ${orderNumber} — ${date}</p>
        <p>Confidential. For internal use only.</p>
      </div>
    </div>
    <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
  </body></html>`);
}

export function generatePOD(order) {
  const { patient, payer, product, vendor, state, calc, orderNumber } = order;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  openDocument(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>POD — ${orderNumber}</title><style>${baseStyles}
    .checkbox-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #F1F5F9; }
    .checkbox-row:last-child { border-bottom: none; }
    .checkbox { width: 18px; height: 18px; border: 2px solid #E2E8F0; border-radius: 4px; flex-shrink: 0; }
    .checkbox-label { font-size: 13px; color: #0F172A; }
  </style></head><body>
    <div class="page">
      <div class="header">
        <div class="logo">Care<span>U</span></div>
        <div class="doc-type">Proof of Delivery</div>
      </div>
      <div class="body">
        <div class="meta">
          <div class="meta-left">
            <h2>Proof of Delivery</h2>
            <p>Order ${orderNumber} &nbsp;·&nbsp; ${date}</p>
          </div>
          <span class="badge">Ready</span>
        </div>

        <div class="section">
          <div class="section-title">Delivery Information</div>
          <div class="grid">
            <div class="field"><label>Patient Name</label><p>${patient}</p></div>
            <div class="field"><label>State</label><p>${state}</p></div>
            <div class="field"><label>Product</label><p>${product}</p></div>
            <div class="field"><label>Supplied by</label><p>${vendor}</p></div>
            <div class="field"><label>Payer</label><p>${payer}</p></div>
            <div class="field"><label>Delivery Date</label><p>${date}</p></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Delivery Checklist</div>
          <div class="checkbox-row"><div class="checkbox"></div><span class="checkbox-label">Item received in good condition</span></div>
          <div class="checkbox-row"><div class="checkbox"></div><span class="checkbox-label">Patient instructed on proper use</span></div>
          <div class="checkbox-row"><div class="checkbox"></div><span class="checkbox-label">Written instructions provided</span></div>
          <div class="checkbox-row"><div class="checkbox"></div><span class="checkbox-label">Patient questions addressed</span></div>
          <div class="checkbox-row"><div class="checkbox"></div><span class="checkbox-label">Serial/lot number recorded</span></div>
        </div>

        <div class="section">
          <div class="section-title">Billing Reference</div>
          <div class="amounts">
            <div class="amount-row"><span class="amount-label">Billable amount</span><span class="amount-value">$${calc.billable.toFixed(2)}</span></div>
            <div class="amount-row red"><span class="amount-label">Patient responsibility</span><span class="amount-value">$${calc.patientOwes.toFixed(2)}</span></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Patient Signature</div>
          <div style="display:flex;gap:32px;align-items:flex-end;">
            <div>
              <div class="signature-box"><span>Patient signature</span></div>
              <p style="font-size:11px;color:#94A3B8;margin-top:4px;">I confirm receipt of the above item(s)</p>
            </div>
            <div>
              <div class="signature-box"><span>Date</span></div>
              <p style="font-size:11px;color:#94A3B8;margin-top:4px;">Date received</p></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <p>CareU Internal — ${orderNumber} — ${date}</p>
        <p>Confidential. For internal use only.</p>
      </div>
    </div>
    <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
  </body></html>`);
}
