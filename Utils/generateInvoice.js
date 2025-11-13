import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use Vercel-compatible or local directory
const invoiceDir = path.join(process.cwd(), "invoices");
if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

export const generateInvoicePDF = async (order) => {
  try {
    const pdfPath = path.join(invoiceDir, `invoice_${order._id}.pdf`);
    const doc = new PDFDocument({ size: "A4", margin: 45 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // ---------------- COLORS ----------------
    const primary = "#FFFFFF";
    const accent = "#D9D9D9";
    const soft = "#5a189a";
    const text = "#111111";

    // ---------------- HEADER ----------------
    doc.fillColor(soft).fontSize(28).text("LABEL AADVI", { align: "center" });

    doc.fontSize(10)
      .fillColor("#444")
      .text("No.1, near Thangalakshmi Jewellery, Palladam, Tamil Nadu 641664", {
        align: "center",
      })
      .text("Phone: +91 8807427126", { align: "center" });

    doc.moveDown(1.5);

    // ---------------- INVOICE BOX ----------------
    let boxY = doc.y;
    doc.roundedRect(40, boxY, 520, 70, 10).fill(soft).stroke(accent);

    doc.fillColor(primary).fontSize(22).text("INVOICE", 60, boxY + 30);

    doc.fontSize(12)
      .fillColor(primary)
      .text(`Invoice No: INV-${order._id}`, 380, boxY + 15)
      .text(`Date: ${new Date().toLocaleDateString()}`, 380, boxY + 45);

    doc.moveDown(5);

    // ---------------- BILL TO BOX ----------------
    let customerBoxY = doc.y;
    doc.roundedRect(40, customerBoxY, 520, 110, 10).fill(accent).stroke(accent);

    doc.fillColor(text).fontSize(16).text("BILL TO", 60, customerBoxY + 12);

    // Left: Name, Email, Phone
    doc.fontSize(12)
      .text(
        `Name: ${order.user?.firstName || ""} ${order.user?.lastName || ""}`,
        60,
        customerBoxY + 35
      )
      .text(`Email: ${order.user?.email || "N/A"}`, 60, customerBoxY + 55)
      .text(`Phone: ${order.address?.phone || "N/A"}`, 60, customerBoxY + 75);

    // Right: Address
    const rightX = 320;
    const addressText = `${order.address?.street || ""}, ${order.address?.city || ""}, ${order.address?.state || ""} - ${order.address?.pincode || ""}`;
    doc.text(`Address:`, rightX, customerBoxY + 35, { continued: false });
    doc.fontSize(11)
      .fillColor("#333")
      .text(addressText, rightX, customerBoxY + 55, {
        width: 220,
        align: "left",
      });

    doc.moveDown(6);

    // ---------------- ORDER DETAILS CARD ----------------
    let detailsBoxY = doc.y;
    doc.roundedRect(40, detailsBoxY, 520, 40, 10).fill(soft).stroke(accent);
    doc.fillColor(primary).fontSize(16).text("ORDER DETAILS", 60, detailsBoxY + 10);
    doc.y = detailsBoxY + 60;

    // ---------------- TABLE HEADER ----------------
    const tableY = doc.y;
    const col1 = 50,
      col2 = 260,
      col3 = 360,
      col4 = 450;

    doc.fontSize(12)
      .fillColor(text)
      .text("Product", col1, tableY)
      .text("Price", col2, tableY)
      .text("Qty", col3, tableY)
      .text("Total", col4, tableY);

    doc.moveTo(40, tableY + 18).lineTo(550, tableY + 18).stroke(accent);

    // ---------------- TABLE ROWS ----------------
    let rowY = tableY + 25;
    let subtotal = 0;

    order.orderItems.forEach((item) => {
      const productName = item.product?.name || "Unknown Product";
      const price = item.price || 0;
      const qty = item.quantity || 1;
      const total = price * qty;
      subtotal += total;

      doc.fillColor(text)
        .text(productName, col1, rowY)
        .text(`${price}`, col2, rowY)
        .text(String(qty), col3, rowY)
        .text(`${total}`, col4, rowY);

      rowY += 22;
      doc.strokeColor("#EEE").moveTo(40, rowY).lineTo(550, rowY).stroke();
    });

    doc.y = rowY + 30;

    // ---------------- TAX CALCULATIONS ----------------
    const cgst = subtotal * 0.02;
    const sgst = subtotal * 0.02;
    const grandTotal = subtotal + cgst + sgst;

    // ---------------- TOTAL BOX ----------------
    let totalBoxY = doc.y;
    doc.roundedRect(300, totalBoxY, 260, 120, 12)
      .fill("#F0F5FF")
      .stroke("#D6E4FF");

    doc.fillColor("#333")
      .fontSize(12)
      .text(`Subtotal: Rs ${subtotal.toFixed(2)}`, 320, totalBoxY + 15)
      .text(`CGST (2%): Rs ${cgst.toFixed(2)}`, 320, totalBoxY + 35)
      .text(`SGST (2%): Rs ${sgst.toFixed(2)}`, 320, totalBoxY + 55);

    doc.fontSize(14)
      .fillColor("#000")
      .text(`Grand Total: Rs ${grandTotal.toFixed(2)}`, 320, totalBoxY + 85);

    // ---------------- FOOTER ----------------
    doc.moveDown(6);
    doc.fontSize(10)
      .fillColor("#888")
      .text("Thank you for shopping with LABEL AADVI!", { align: "center" })
      .text("For support, contact: labelaadvi@gmail.com", { align: "center" });

    // End PDF
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
