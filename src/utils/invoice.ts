import { Order } from '../data/orderData';
import { convertToIQD, formatIQD } from './currency';

// ESC/POS commands
const ESC = '\x1B';
const GS = '\x1D';
const INIT = ESC + '@';
const CUT = GS + 'V' + '\x00';
const CENTER = ESC + 'a' + '\x01';
const LEFT = ESC + 'a' + '\x00';
const RIGHT = ESC + 'a' + '\x02';
const BOLD_ON = ESC + 'E' + '\x01';
const BOLD_OFF = ESC + 'E' + '\x00';
const TEXT_NORMAL = ESC + '!' + '\x00';
const TEXT_DOUBLE = ESC + '!' + '\x10';
const FEED_LINE = '\x0A';

const generateThermalPrintData = (order: Order): string => {
  let printData = '';

  // Initialize printer
  printData += INIT;

  // Header
  printData += CENTER;
  printData += TEXT_DOUBLE;
  printData += BOLD_ON;
  printData += 'مطعمنا\n';
  printData += TEXT_NORMAL;
  printData += BOLD_OFF;
  printData += 'فاتورة ضريبية مبسطة\n';
  printData += order.id + '\n';
  printData += '-'.repeat(32) + '\n';

  // Customer Info
  printData += RIGHT;
  printData += BOLD_ON;
  printData += 'معلومات العميل:\n';
  printData += BOLD_OFF;
  printData += `الاسم: ${order.customerInfo.name}\n`;
  printData += `الهاتف: ${order.customerInfo.phone}\n`;
  printData += `العنوان: ${order.customerInfo.address}\n`;
  printData += '-'.repeat(32) + '\n';

  // Order Info
  printData += `التاريخ: ${new Intl.DateTimeFormat('ar-IQ').format(new Date(order.createdAt))}\n`;
  printData += `الوقت: ${new Intl.DateTimeFormat('ar-IQ', { timeStyle: 'short' }).format(new Date(order.createdAt))}\n`;
  printData += `الحالة: ${order.status}\n`;
  printData += '-'.repeat(32) + '\n';

  // Items
  printData += BOLD_ON;
  printData += 'المنتج          الكمية     السعر\n';
  printData += BOLD_OFF;
  order.items.forEach(item => {
    printData += `${item.name}\n`;
    if (item.options) {
      printData += `  ${Object.entries(item.options)
        .map(([key, value]) => `${key}: ${value}`).join('، ')}\n`;
    }
    printData += `${item.quantity}x    ${formatIQD(convertToIQD(item.price))} د.ع\n`;
    printData += `المجموع: ${formatIQD(convertToIQD(item.price * item.quantity))} د.ع\n`;
  });
  printData += '-'.repeat(32) + '\n';

  // Totals
  printData += RIGHT;
  printData += `المجموع الفرعي: ${formatIQD(convertToIQD(order.totalPrice))} د.ع\n`;
  printData += `رسوم التوصيل: ${formatIQD(order.deliveryFee)} د.ع\n`;
  printData += BOLD_ON;
  printData += `الإجمالي: ${formatIQD(convertToIQD(order.totalPrice) + order.deliveryFee)} د.ع\n`;
  printData += BOLD_OFF;
  printData += '-'.repeat(32) + '\n';

  // Footer
  printData += CENTER;
  printData += 'شكراً لاختياركم مطعمنا\n';
  printData += 'نتمنى لكم وجبة شهية\n';
  printData += `الرقم الضريبي: 123456789\n`;
  printData += FEED_LINE.repeat(3);
  printData += CUT;

  return printData;
};

export const generateInvoiceHTML = (order: Order): string => {
  const totalInIQD = convertToIQD(order.totalPrice);
  const finalTotal = totalInIQD + order.deliveryFee;
  
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة #${order.id}</title>
      <style>
        @page {
          size: 80mm 80mm;
          margin: 0;
        }
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            width: 80mm;
          }
          .no-print {
            display: none;
          }
        }
        body {
          font-family: 'Noto Kufi Arabic', Arial, sans-serif;
          margin: 0;
          padding: 0;
          width: 80mm;
          background: white;
          font-size: 8pt;
        }
        .invoice {
          padding: 5mm;
        }
        .header {
          text-align: center;
          margin-bottom: 3mm;
          padding-bottom: 2mm;
          border-bottom: 1px dashed #000;
        }
        .logo {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 2mm;
        }
        .invoice-title {
          font-size: 9pt;
          margin-bottom: 1mm;
        }
        .invoice-number {
          font-size: 8pt;
        }
        .info-section {
          margin-bottom: 3mm;
          font-size: 8pt;
        }
        .info-section h3 {
          margin: 0 0 1mm 0;
          font-size: 9pt;
        }
        .info-section p {
          margin: 0 0 1mm 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 3mm;
          font-size: 8pt;
        }
        th, td {
          padding: 1mm;
          text-align: right;
          border-bottom: 1px dotted #ccc;
        }
        .item-options {
          font-size: 7pt;
          color: #666;
        }
        .totals {
          margin-top: 2mm;
          border-top: 1px dashed #000;
          padding-top: 2mm;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1mm;
          font-size: 8pt;
        }
        .total-row.grand-total {
          font-size: 10pt;
          font-weight: bold;
          margin-top: 2mm;
          padding-top: 2mm;
          border-top: 1px dashed #000;
        }
        .footer {
          text-align: center;
          margin-top: 3mm;
          padding-top: 2mm;
          border-top: 1px dashed #000;
          font-size: 7pt;
        }
        .print-buttons {
          position: fixed;
          top: 10px;
          left: 10px;
          display: flex;
          gap: 10px;
        }
        .print-button {
          padding: 8px 16px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .print-button:hover {
          background: #45a049;
        }
        .thermal-button {
          background: #2196F3;
        }
        .thermal-button:hover {
          background: #1976D2;
        }
      </style>
    </head>
    <body>
      <div class="print-buttons no-print">
        <button onclick="window.print()" class="print-button">طباعة عادية</button>
        <button onclick="printThermal()" class="print-button thermal-button">طباعة حرارية</button>
      </div>
      <div class="invoice">
        <div class="header">
          <div class="logo">مطعمنا</div>
          <div class="invoice-title">فاتورة ضريبية مبسطة</div>
          <div class="invoice-number">${order.id}</div>
        </div>
        
        <div class="info-section">
          <h3>معلومات العميل</h3>
          <p>الاسم: ${order.customerInfo.name}</p>
          <p>الهاتف: ${order.customerInfo.phone}</p>
          <p>العنوان: ${order.customerInfo.address}</p>
        </div>

        <div class="info-section">
          <p>التاريخ: ${new Intl.DateTimeFormat('ar-IQ').format(new Date(order.createdAt))}</p>
          <p>الوقت: ${new Intl.DateTimeFormat('ar-IQ', { timeStyle: 'short' }).format(new Date(order.createdAt))}</p>
          <p>الحالة: ${order.status}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>المجموع</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  ${item.name}
                  ${item.options ? `
                    <div class="item-options">
                      ${Object.entries(item.options)
                        .map(([key, value]) => `${key}: ${value}`).join('، ')}
                    </div>
                  ` : ''}
                </td>
                <td>${item.quantity}</td>
                <td>${formatIQD(convertToIQD(item.price * item.quantity))} د.ع</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>المجموع الفرعي:</span>
            <span>${formatIQD(totalInIQD)} د.ع</span>
          </div>
          <div class="total-row">
            <span>رسوم التوصيل:</span>
            <span>${formatIQD(order.deliveryFee)} د.ع</span>
          </div>
          <div class="total-row grand-total">
            <span>الإجمالي:</span>
            <span>${formatIQD(finalTotal)} د.ع</span>
          </div>
        </div>

        <div class="footer">
          <p>شكراً لاختياركم مطعمنا</p>
          <p>نتمنى لكم وجبة شهية</p>
          <p>الرقم الضريبي: 123456789</p>
        </div>
      </div>
      <script>
        async function printThermal() {
          try {
            // Request serial port access
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });

            const writer = port.writable.getWriter();
            const data = ${JSON.stringify(generateThermalPrintData(order))};
            
            // Convert string to Uint8Array
            const encoder = new TextEncoder();
            const bytes = encoder.encode(data);
            
            // Send data to printer
            await writer.write(bytes);
            writer.releaseLock();
            await port.close();
          } catch (error) {
            console.error('Error printing:', error);
            alert('حدث خطأ أثناء الطباعة. يرجى التأكد من توصيل الطابعة وإعادة المحاولة.');
          }
        }
      </script>
    </body>
    </html>
  `;
};

export const printInvoice = (order: Order) => {
  const invoiceWindow = window.open('', '_blank');
  if (invoiceWindow) {
    invoiceWindow.document.write(generateInvoiceHTML(order));
    invoiceWindow.document.close();
    invoiceWindow.focus();
  }
};