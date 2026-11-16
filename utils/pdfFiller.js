import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formGridCoordinates } from './formGridData.js';
import { parseVehicleNumber } from './vehicleParser.js';

/**
 * Split text across rows with intelligent word wrapping.
 */
export function splitTextIntoRows(text, maxColsRow1, maxColsRow2) {
  const clean = (text || '').trim();
  if (!clean) return { row1: '', row2: '' };

  if (clean.length <= maxColsRow1) {
    return { row1: clean, row2: '' };
  }

  const words = clean.split(' ');
  let r1 = '';
  let r2 = '';

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const candidate = r1 ? `${r1} ${w}` : w;
    if (candidate.length <= maxColsRow1) {
      r1 = candidate;
    } else {
      r2 = words.slice(i).join(' ');
      break;
    }
  }

  if (!r1 && clean.length > maxColsRow1) {
    r1 = clean.slice(0, maxColsRow1);
    r2 = clean.slice(maxColsRow1).trim();
  }

  return { row1: r1, row2: r2 };
}

/**
 * Draw characters inside grid boxes.
 * If longer than given boxes, it prints outside the boxes,
 * but safely stays within the page printable margin (maxX = 588 pt)!
 */
export function drawGridTextSafe(page, font, text, gridDef, options = {}) {
  if (!text || !gridDef || !gridDef.xs || gridDef.xs.length < 2) return;

  const { xs, y0, y1 } = gridDef;
  const numCells = xs.length - 1;
  const boxHeight = y1 - y0;
  const maxFont = options.fontSize || 10.5;
  const maxX = options.maxX || 588.0; // Safe printable right margin (page width is 612)
  const color = options.color || rgb(0.05, 0.05, 0.05);

  const pageHeight = page.getHeight();
  const cellW = xs.length > 1 ? (xs[1] - xs[0]) : 15.1;
  const totalLen = text.length;

  if (totalLen <= numCells) {
    // Standard box centering
    const baselineY = pageHeight - y1 + (boxHeight - maxFont) / 2 + 1.2;
    for (let i = 0; i < totalLen; i++) {
      const ch = text[i];
      const cx = (xs[i] + xs[i + 1]) / 2;
      const textWidth = font.widthOfTextAtSize(ch, maxFont);
      page.drawText(ch, {
        x: cx - textWidth / 2,
        y: baselineY,
        size: maxFont,
        font: font,
        color: color,
      });
    }
  } else {
    // Text exceeds boxes: print outside boxes, dynamically condensed to stay within maxX
    const availWidth = maxX - xs[0];
    const pitch = Math.min(cellW, availWidth / totalLen);
    const fontSize = Math.min(maxFont, pitch * 0.95);
    const baselineY = pageHeight - y1 + (boxHeight - fontSize) / 2 + 1.2;

    for (let i = 0; i < totalLen; i++) {
      const ch = text[i];
      const cx = xs[0] + (i + 0.5) * pitch;
      const textWidth = font.widthOfTextAtSize(ch, fontSize);
      page.drawText(ch, {
        x: cx - textWidth / 2,
        y: baselineY,
        size: fontSize,
        font: font,
        color: color,
      });
    }
  }
}

/**
 * Draw vehicle registration parts into specific sub-cell groups on MTA 6.
 * Correctly accommodates:
 * - 5 Sri 2525
 * - 19 Sri 1234
 * - WP CAA-2525
 * - 64-1234
 */
export function drawVehicleNumberMta6(page, font, parsedVeh, pageConfig) {
  if (!parsedVeh || !parsedVeh.part3) return;

  const { vehicle_set1, vehicle_set2, vehicle_set3 } = pageConfig;
  const pageHeight = page.getHeight();
  const fontSize = 10.5;

  function drawInSet(text, gridDef) {
    if (!text || !gridDef || !gridDef.xs) return;
    const { xs, y0, y1 } = gridDef;
    const numCells = xs.length - 1;
    const boxHeight = y1 - y0;
    const baselineY = pageHeight - y1 + (boxHeight - fontSize) / 2 + 1.2;
    const clean = text.trim();

    let indices = [];
    if (clean.length === 1 && numCells === 3) {
      indices = [1]; // Center single digit in cell 2 (e.g. "5" in 3 cells)
    } else if (clean.length === 2 && numCells === 3) {
      indices = [0, 1]; // e.g. "WP" or "19" in 3 cells
    } else {
      indices = Array.from({ length: Math.min(clean.length, numCells) }, (_, k) => k);
    }

    for (let i = 0; i < indices.length; i++) {
      const ch = clean[i];
      const cellIdx = indices[i];
      const cx = (xs[cellIdx] + xs[cellIdx + 1]) / 2;
      const tw = font.widthOfTextAtSize(ch, fontSize);
      page.drawText(ch, {
        x: cx - tw / 2,
        y: baselineY,
        size: fontSize,
        font: font,
        color: rgb(0.05, 0.05, 0.05),
      });
    }
  }

  // Draw Part 1 (Province or Sri prefix: e.g. "5" or "19" or "WP")
  drawInSet(parsedVeh.part1, vehicle_set1);

  // Draw Part 2 (Class letters or "SRI" or "-": e.g. "SRI" or "CAA" or "-")
  drawInSet(parsedVeh.part2, vehicle_set2);

  // Draw Part 3 (4 digits: e.g. "2525")
  drawInSet(parsedVeh.part3, vehicle_set3);
}

/**
 * Draw plain text at given coordinates with safety truncation/scaling to fit max_x.
 */
export function drawPlainText(page, font, text, pos, options = {}) {
  if (!text || !pos) return;
  const clean = text.trim();
  if (!clean) return;

  const pageHeight = page.getHeight();
  const y = pageHeight - pos.y;
  let fontSize = options.fontSize || 9.5;
  const color = options.color || rgb(0.05, 0.05, 0.05);

  // If a max_x is provided, ensure text doesn't overflow past it
  if (pos.max_x && pos.max_x > pos.x) {
    const availWidth = pos.max_x - pos.x;
    let tw = font.widthOfTextAtSize(clean, fontSize);
    if (tw > availWidth) {
      fontSize = Math.max(7.0, fontSize * (availWidth / tw));
    }
  }

  page.drawText(clean, {
    x: pos.x,
    y: y,
    size: fontSize,
    font: font,
    color: color,
  });
}

/**
 * Main form filler function for Next.js and client runtime
 */
export async function generateFilledVehicleTransferPDF(formData, options = {}) {
  const templatePdfUrl = options.pdfUrl || '/6A_6B_MAT8.pdf';

  let pdfBytes;
  if (options.pdfArrayBuffer) {
    pdfBytes = options.pdfArrayBuffer;
  } else {
    const res = await fetch(templatePdfUrl);
    if (!res.ok) {
      throw new Error(`Failed to load PDF template from ${templatePdfUrl}: ${res.statusText}`);
    }
    pdfBytes = await res.arrayBuffer();
  }

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();

  // Date parsing: OPTIONAL! (If blank, keep all date spaces completely blank)
  let hasDate = false;
  let dayStr = '';
  let monthStr = '';
  let yearStr = '';
  if (formData.transferDate && formData.transferDate.trim()) {
    const parts = formData.transferDate.trim().split('-');
    if (parts.length === 3) {
      yearStr = parts[0];
      monthStr = parts[1];
      dayStr = parts[2];
      hasDate = true;
    }
  }

  // Parse Vehicle Number
  const parsedVeh = parseVehicleNumber(formData.vehicleNumber);

  // Split and format names and addresses
  const transfNameRows = splitTextIntoRows(
    (formData.transferorName || '').toUpperCase(),
    35,
    35
  );

  const transfAddrRows = splitTextIntoRows(
    (formData.transferorAddress || '').toUpperCase(),
    35,
    35
  );

  const buyerNameRows = splitTextIntoRows(
    (formData.transfereeName || '').toUpperCase(),
    35,
    35
  );

  const buyerAddrRows = splitTextIntoRows(
    (formData.transfereeAddress || '').toUpperCase(),
    35,
    35
  );

  // Fill MTA 6 Pages: 0 (Form A), 2 (Form A1), 4 (Form B), 6 (Form B1)
  const mta6Pages = [
    { pageIdx: 0, cfg: formGridCoordinates.page_1 },
    { pageIdx: 2, cfg: formGridCoordinates.page_3 },
    { pageIdx: 4, cfg: formGridCoordinates.page_5 },
    { pageIdx: 6, cfg: formGridCoordinates.page_7 },
  ];

  for (const item of mta6Pages) {
    if (item.pageIdx >= pages.length) continue;
    const p = pages[item.pageIdx];
    const c = item.cfg;

    // Date: only if provided!
    if (hasDate) {
      drawGridTextSafe(p, font, dayStr, c.date_day);
      drawGridTextSafe(p, font, monthStr, c.date_month);
      drawGridTextSafe(p, font, yearStr, c.date_year);
    }

    // Transferor Name: Row 1 & Row 2 with safe overflow
    drawGridTextSafe(p, font, transfNameRows.row1, c.transferor_name_1);
    drawGridTextSafe(p, font, transfNameRows.row2, c.transferor_name_2);

    // Transferor Address
    drawGridTextSafe(p, font, transfAddrRows.row1, c.transferor_address_1);
    drawGridTextSafe(p, font, transfAddrRows.row2, c.transferor_address_2);

    // Vehicle Number: correctly routed into 3 sub-cells (supports 5 Sri 2525, WP CAA-2525, etc.)
    drawVehicleNumberMta6(p, font, parsedVeh, c);

    // Transferee Name
    drawGridTextSafe(p, font, buyerNameRows.row1, c.transferee_name_1);
    drawGridTextSafe(p, font, buyerNameRows.row2, c.transferee_name_2);

    // Transferee Address
    drawGridTextSafe(p, font, buyerAddrRows.row1, c.transferee_address_1);
    drawGridTextSafe(p, font, buyerAddrRows.row2, c.transferee_address_2);

    // NIC Numbers
    drawGridTextSafe(p, font, (formData.transferorNic || '').toUpperCase().trim(), c.transferor_nic);
    drawGridTextSafe(p, font, (formData.transfereeNic || '').toUpperCase().trim(), c.transferee_nic);

    // Witnesses: exact dotted lines
    if (formData.witness1Name) drawPlainText(p, font, formData.witness1Name.toUpperCase(), c.witness_1.name);
    if (formData.witness1Address) drawPlainText(p, font, formData.witness1Address.toUpperCase(), c.witness_1.address);
    if (formData.witness1Nic) drawPlainText(p, font, formData.witness1Nic.toUpperCase(), c.witness_1.nic);

    if (formData.witness2Name) drawPlainText(p, font, formData.witness2Name.toUpperCase(), c.witness_2.name);
    if (formData.witness2Address) drawPlainText(p, font, formData.witness2Address.toUpperCase(), c.witness_2.address);
    if (formData.witness2Nic) drawPlainText(p, font, formData.witness2Nic.toUpperCase(), c.witness_2.nic);
    if (hasDate) drawPlainText(p, font, formData.transferDate.trim(), c.witness_2.date);

    // One-Day Transfer Section: Fill all 3 language spaces + Name/Date safely!
    if (formData.isOneDay && parsedVeh.fullFormatted) {
      drawPlainText(p, font, parsedVeh.fullFormatted, c.one_day.sinhala_veh, { fontSize: 9.5 });
      drawPlainText(p, font, parsedVeh.fullFormatted, c.one_day.tamil_veh, { fontSize: 9.5 });
      drawPlainText(p, font, parsedVeh.fullFormatted, c.one_day.english_veh, { fontSize: 9.5 });

      let ownerDateStr = (formData.transferorName || '').toUpperCase().trim();
      if (hasDate) {
        ownerDateStr = `${ownerDateStr}  |  ${formData.transferDate.trim()}`;
      }
      drawPlainText(p, font, ownerDateStr, c.one_day.name_date, { fontSize: 8.5 });
    }

    // SIGNATURES ARE EXPLICITLY SKIPPED AND REMAIN BLANK!
  }

  // Fill MTA 8 Pages: 8 (Form C), 10 (Form C1) and Backs: 9 (Back of C), 11 (Back of C1)
  const mta8Pages = [
    { pageIdx: 8, cfg: formGridCoordinates.page_9, backIdx: 9, backCfg: formGridCoordinates.page_10 },
    { pageIdx: 10, cfg: formGridCoordinates.page_11, backIdx: 11, backCfg: formGridCoordinates.page_12 },
  ];

  for (const item of mta8Pages) {
    if (item.pageIdx >= pages.length) continue;
    const p = pages[item.pageIdx];
    const c = item.cfg;

    // Vehicle Number in MTA 8 (10 cells continuous)
    if (parsedVeh.mta8String) {
      drawGridTextSafe(p, font, parsedVeh.mta8String, c.vehicle_number);
    }

    // Transferor Name (Row 1: 26, Row 2: 34)
    const mta8TransfName = splitTextIntoRows(
      (formData.transferorName || '').toUpperCase(),
      26,
      34
    );
    drawGridTextSafe(p, font, mta8TransfName.row1, c.transferor_name_1);
    drawGridTextSafe(p, font, mta8TransfName.row2, c.transferor_name_2);

    // Transferor Address (Row 1: 33, Row 2: 35)
    const addr1 = splitTextIntoRows(
      (formData.transferorAddress || '').toUpperCase(),
      33,
      35
    );
    drawGridTextSafe(p, font, addr1.row1, c.transferor_address_1);
    drawGridTextSafe(p, font, addr1.row2, c.transferor_address_2);

    // Transferee Name (Row 1: 31, Row 2: 35)
    const mta8BuyerName = splitTextIntoRows(
      (formData.transfereeName || '').toUpperCase(),
      31,
      35
    );
    drawGridTextSafe(p, font, mta8BuyerName.row1, c.transferee_name_1);
    drawGridTextSafe(p, font, mta8BuyerName.row2, c.transferee_name_2);

    // Transferee Address
    drawGridTextSafe(p, font, buyerAddrRows.row1, c.transferee_address_1);

    // Transferee NIC
    drawGridTextSafe(p, font, (formData.transfereeNic || '').toUpperCase().trim(), c.transferee_nic);

    // Postal Code & Mobile
    drawGridTextSafe(p, font, (formData.transfereePostalCode || '').trim(), c.postal_code);
    drawGridTextSafe(p, font, (formData.transfereeMobile || '').replace(/\s+/g, ''), c.mobile_number);

    // Divisional Secretariat & District & Province
    drawGridTextSafe(p, font, (formData.divisionalSecretariat || '').toUpperCase().trim(), c.divisional_secretariat);
    drawGridTextSafe(p, font, (formData.district || '').toUpperCase().trim(), c.district);
    drawGridTextSafe(p, font, (formData.province || '').toUpperCase().trim(), c.province);

    // Date (only if provided!)
    if (hasDate) {
      drawGridTextSafe(p, font, dayStr, c.date_day);
      drawGridTextSafe(p, font, monthStr, c.date_month);
      drawGridTextSafe(p, font, yearStr, c.date_year);
    }

    // Preferred Office
    drawGridTextSafe(p, font, (formData.preferredOffice || '').toUpperCase().trim(), c.preferred_office);

    // Back page Date
    if (item.backIdx && item.backIdx < pages.length) {
      const backP = pages[item.backIdx];
      if (hasDate) {
        drawPlainText(backP, font, formData.transferDate.trim(), item.backCfg.date_transferee);
      }
      // Transferee signature is skipped and blank!
    }
  }

  // Handle selective page extraction if requested
  const targetSelection = options.pageSelection || 'all';
  if (targetSelection !== 'all') {
    let desiredPageIndices = [];
    if (targetSelection === 'mta6') {
      // Excludes blank pages 2 and 4 (indices 1 and 3)
      desiredPageIndices = [0, 2, 4, 5, 6, 7];
    } else if (targetSelection === 'mta6a') {
      desiredPageIndices = [0, 2];
    } else if (targetSelection === 'mta6b') {
      desiredPageIndices = [4, 5, 6, 7];
    } else if (targetSelection === 'mta8') {
      desiredPageIndices = [8, 9, 10, 11];
    } else if (Array.isArray(targetSelection)) {
      desiredPageIndices = targetSelection;
    }

    if (desiredPageIndices.length > 0) {
      const subsetDoc = await PDFDocument.create();
      const copied = await subsetDoc.copyPages(pdfDoc, desiredPageIndices.filter(idx => idx < pages.length));
      for (const cp of copied) {
        subsetDoc.addPage(cp);
      }
      return await subsetDoc.save();
    }
  }

  // Remove blank pages from complete document set:
  // In the original 13-page template:
  // - Page 2 (index 1) is completely blank
  // - Page 4 (index 3) is completely blank
  // - Page 13 (index 12) is completely blank
  // Removing them in descending order cleanly yields a 10-page document with zero blank papers.
  if (pdfDoc.getPageCount() === 13) {
    pdfDoc.removePage(12);
    pdfDoc.removePage(3);
    pdfDoc.removePage(1);
  }

  return await pdfDoc.save();
}

/**
 * Trigger direct device printing via an iframe
 */
export function printPdfBlobDirectly(pdfBlob) {
  const blobUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = blobUrl;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    try {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(blobUrl);
        }, 60000);
      }, 500);
    } catch (e) {
      console.error('Direct print fallback:', e);
      window.open(blobUrl, '_blank');
    }
  };
}

/**
 * Trigger direct download of the PDF file
 */
export function downloadPdfBlob(pdfBlob, filename = 'Sri_Lanka_Vehicle_Transfer_Forms.pdf') {
  const blobUrl = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
