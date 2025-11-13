import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create /invoices folder
const invoiceDir = path.join(__dirname, "../invoices");
if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

export const generateInvoicePDF = async (order) => {
  try {
    const pdfPath = path.join(invoiceDir, `invoice_${order._id}.pdf`);
    const doc = new PDFDocument({ size: "A4", margin: 45 });

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Colors
    const primary = "#111111";
    const accent = "#D9D9D9";
    const soft = "#F7F7F7";

    // HEADER
    doc.fillColor(primary).fontSize(28).text("LABEL AADVI", { align: "center" });

    doc.fontSize(10)
      .fillColor("#666")
      .text("No.1, near Thangalakshmi Jewellery, Palladam, Tamil Nadu 641664", { align: "center" })
      .text("Phone: +91 8807427126", { align: "center" });

    doc.moveDown(1.5);

    // INVOICE BOX
    let boxY = doc.y;
    doc.roundedRect(40, boxY, 520, 70, 10).fill(soft).stroke(accent);

    doc.fillColor(primary).fontSize(22).text("INVOICE", 60, boxY + 15);

    doc.fontSize(12)
      .text(`Invoice No: INV-${order._id}`, 380, boxY + 15)
      .text(`Date: ${new Date().toLocaleDateString()}`, 380, boxY + 45);

    doc.moveDown(5);

    // BILLING BOX
    let customerBoxY = doc.y;
    doc.roundedRect(40, customerBoxY, 520, 90, 10).fill(soft).stroke(accent);

    // Left: BILL TO
    doc.fillColor(primary).fontSize(16)
      .text("BILL TO", 60, customerBoxY + 12);

    // Right: Customer details
    const rightX = 300;

    doc.fontSize(12)
      .text(`Name: ${order.user.firstName} ${order.user.lastName}`, rightX, customerBoxY + 25)
      .text(`Email: ${order.user.email}`, rightX, customerBoxY + 45);

    doc.moveDown(6);

    // ORDER DETAILS CARD
    let detailsBoxY = doc.y;

    doc.roundedRect(40, detailsBoxY, 520, 40, 10).fill(soft).stroke(accent);

    doc.fillColor(primary)
      .fontSize(16)
      .text("ORDER DETAILS", 60, detailsBoxY + 10);

    // Move below card
    doc.y = detailsBoxY + 60;

    // TABLE HEADER
    const tableY = doc.y;

    const col1 = 50,
      col2 = 260,
      col3 = 360,
      col4 = 450;

    doc.fontSize(12).fillColor(primary)
      .text("Product", col1, tableY)
      .text("Price", col2, tableY)
      .text("Qty", col3, tableY)
      .text("Total", col4, tableY);

    doc.moveTo(40, tableY + 18).lineTo(550, tableY + 18).stroke(accent);

    // TABLE ROWS
    let rowY = tableY + 25;

    order.orderItems.forEach((item) => {
  const productName = item.product?.name || "Unknown Product";

  const variant = item.product?.variants?.find(
    (v) => v.sku === item.variantSku
  );

  const price = item.price || variant?.price || 0;

  const qty = item.quantity || 1;
  const total = price * qty;

  doc.text(productName, col1, rowY);
  doc.text(`${price}`, col2, rowY);
  doc.text(String(qty), col3, rowY);
  doc.text(`${total}`, col4, rowY);

  rowY += 22;

  doc.strokeColor("#EEE")
    .moveTo(40, rowY)
    .lineTo(550, rowY)
    .stroke();
});

    doc.y = rowY + 30;

    // TOTAL BOX
    let totalBoxY = doc.y;

    doc.roundedRect(300, totalBoxY, 260, 80, 12)
      .fill("#F0F5FF")
      .stroke("#D6E4FF");

    doc.fillColor(primary).fontSize(10)
      .text("Grand Total", 320, totalBoxY + 15);

    doc.fontSize(22)
      .text(`Rs${order.total_amount}`, 320, totalBoxY + 45);

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => resolve(pdfPath));
      stream.on("error", reject);
    });

  } catch (err) {
    console.error("PDF Error:", err);
    throw err;
  }
};
