import { ProductLine, Invoice } from './types'
import logoBase64 from './logoBase64'
export const initialProductLine: ProductLine = {
  description: '',
  quantity: '1',
  rate: '0.00',
}

export const initialInvoice: Invoice = {
  logo: logoBase64,
  logoWidth: 150,
  title: 'INVOICE',
  companyName: '',
  name: '',
  companyAddress: '',
  companyAddress2: '',
  companyCountry: 'Zambia',
  billTo: 'Bill To:',
  clientName: '',
  clientAddress: '',
  clientAddress2: '',
  clientCountry: 'Zambia',
  invoiceTitleLabel: 'Invoice#',
  invoiceTitle: '',
  invoiceDateLabel: 'Invoice Date',
  invoiceDate: '',
  invoiceDueDateLabel: 'Due Date',
  invoiceDueDate: '',
  productLineDescription: 'Item Description',
  productLineQuantity: 'Qty',
  productLineQuantityRate: 'Rate',
  productLineQuantityAmount: 'Amount',
  productLines: [
    {
      description: 'Brochure Design',
      quantity: '2',
      rate: '100.00',
    },
    { ...initialProductLine },
    { ...initialProductLine },
  ],
  subTotalLabel: 'Sub Total',
  taxLabel: 'VAT (16%)',
  totalLabel: 'TOTAL',
  currency: 'K',
  notesLabel: 'Notes',
  notes: 'It was great doing business with you.',
  termLabel: 'Terms & Conditions',
  term: 'Please make the payment by the due date.',
}

export const initialQuotation: Invoice = {
  ...initialInvoice,
  title: 'QUOTATION',
  invoiceTitleLabel: 'Quotation#',
  invoiceDateLabel: 'Quotation Date',
  invoiceDueDateLabel: 'Valid Until',
  billTo: 'Prepared For:',
  notes: 'Thank you for considering our services.',
  term: 'This quotation is valid for 30 days from the date issued.',
}

export const initialReceipt: Invoice = {
  ...initialInvoice,
  title: 'RECEIPT',
  invoiceTitleLabel: 'Receipt#',
  invoiceDateLabel: 'Receipt Date',
  invoiceDueDateLabel: '',
  billTo: 'Received From:',
  totalLabel: 'TOTAL RECEIVED',
  notes: 'Payment received. Thank you for your business.',
  termLabel: '',
  term: '',
}
