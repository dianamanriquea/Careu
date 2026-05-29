export const products = [
  { id: 'P-1001', name: 'Compression Sleeve, Arm', sku: 'CS-ARM-20', category: 'Lymphedema', cost: 38.00, vendor: 'Medi USA' },
  { id: 'P-1002', name: 'Compression Bra Post-Surgical', sku: 'CB-PS-32', category: 'Breast Cancer', cost: 67.50, vendor: 'Jobst Medical' },
  { id: 'P-1003', name: 'Gradient Compression Stocking', sku: 'GCS-30-40', category: 'Lymphedema', cost: 44.00, vendor: 'Medi USA' },
  { id: 'P-1004', name: 'Post-Mastectomy Prosthesis', sku: 'PMP-SIL-B', category: 'Breast Cancer', cost: 210.00, vendor: 'Camp Sievert' },
];

export const feeSchedules = [
  { id: 'FS-01', payer: 'Medicare Part B', region: 'National', base: 85.00, multiplier: 1.0 },
  { id: 'FS-02', payer: 'Aetna Commercial', region: 'Northeast', base: 95.00, multiplier: 1.15 },
  { id: 'FS-03', payer: 'BCBS Federal', region: 'National', base: 90.00, multiplier: 1.10 },
  { id: 'FS-04', payer: 'United Healthcare', region: 'West', base: 88.00, multiplier: 1.12 },
];

export const vendors = [
  { id: 'V-201', name: 'Medi USA', email: 'orders@mediusa.com', status: 'Active' },
  { id: 'V-202', name: 'Jobst Medical', email: 'orders@jobst.com', status: 'Active' },
  { id: 'V-203', name: 'Camp Sievert', email: 'orders@campsievert.com', status: 'Active' },
];

export function calculate(product, feeSchedule) {
  const billable = product.cost * feeSchedule.multiplier;
  const margin = billable - product.cost;
  const insuranceCovers = billable * 0.80;
  const patientOwes = billable * 0.20;
  return { costPerUnit: product.cost, billable, margin, insuranceCovers, patientOwes };
}
