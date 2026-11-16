"""
Sri Lanka Vehicle Transfer Forms Filler (MTA 6A, 6B, MTA 8)
Command Line Utility & Batch Generator
Supports Sri numbers (e.g. 5 Sri 2525), long name overflow guard, open papers, and exact witness baseline positioning.
"""

import sys
import os
import json
import re
import fitz  # PyMuPDF

TEMPLATE_PATH = "6A_6B_MAT8.pdf"

def parse_vehicle_number(raw):
    if not raw:
        return {'part1': '', 'part2': '', 'part3': '', 'full': '', 'mta8': ''}
    s = raw.strip().upper()
    s = re.sub(r'\s+', ' ', s)

    # 1. Sri numbers: e.g. "5 Sri 2525", "19 Sri 1234"
    m = re.match(r'^(\d{1,3})\s*[-/ ]?\s*(SRI|ශ්‍රී)\s*[-/ ]?\s*(\d{1,4})$', s)
    if m:
        p1, p2, p3 = m.group(1), 'SRI', m.group(3)
        return {
            'part1': p1,
            'part2': p2,
            'part3': p3,
            'full': f"{p1} SRI {p3}",
            'mta8': f"{p1:<2}{p2:^4}{p3:>4}"[:10]
        }

    # 2. Modern: e.g. "WP CAA-2525"
    m = re.match(r'^([A-Z]{2})\s*[-/ ]?\s*([A-Z]{2,3})\s*[-/ ]?\s*(\d{4})$', s)
    if m:
        p1, p2, p3 = m.group(1), m.group(2), m.group(3)
        return {
            'part1': p1,
            'part2': p2,
            'part3': p3,
            'full': f"{p1} {p2}-{p3}",
            'mta8': f"{p1} {p2} {p3}"[:10]
        }

    # 3. Dash: e.g. "64-1234"
    m = re.match(r'^(\d{1,3})\s*[-/ ]\s*(\d{4})$', s)
    if m:
        p1, p2, p3 = m.group(1), '-', m.group(2)
        return {
            'part1': p1,
            'part2': p2,
            'part3': p3,
            'full': f"{p1}-{p3}",
            'mta8': f"{p1} - {p3}"[:10]
        }

    parts = re.split(r'[\s-]+', s)
    if len(parts) >= 3:
        return {'part1': parts[0][:3], 'part2': parts[1][:3], 'part3': parts[2][:4], 'full': s, 'mta8': s[:10]}
    elif len(parts) == 2:
        return {'part1': parts[0][:3], 'part2': '', 'part3': parts[1][:4], 'full': s, 'mta8': s[:10]}
    return {'part1': s[:3], 'part2': s[3:6], 'part3': s[6:10], 'full': s, 'mta8': s[:10]}

def split_text_into_rows(text, max_row1, max_row2):
    text = (text or "").strip()
    if not text:
        return "", ""
    if len(text) <= max_row1:
        return text, ""
    words = text.split(" ")
    r1, r2 = "", ""
    for i, w in enumerate(words):
        cand = f"{r1} {w}" if r1 else w
        if len(cand) <= max_row1:
            r1 = cand
        else:
            r2 = " ".join(words[i:])
            break
    if not r1 and len(text) > max_row1:
        r1 = text[:max_row1]
        r2 = text[max_row1:].strip()
    return r1, r2

def split_text_into_3_rows(text, max1, max2, max3):
    text = (text or "").strip()
    if not text:
        return "", "", ""
    words = text.split(" ")
    r1, r2, r3 = "", "", ""
    idx = 0
    for idx, w in enumerate(words):
        cand = f"{r1} {w}" if r1 else w
        if len(cand) <= max1:
            r1 = cand
        else:
            break
    else:
        return r1, "", ""
    
    words2 = words[idx:]
    idx2 = 0
    for idx2, w in enumerate(words2):
        cand = f"{r2} {w}" if r2 else w
        if len(cand) <= max2:
            r2 = cand
        else:
            break
    else:
        return r1, r2, ""
    
    r3 = " ".join(words2[idx2:])
    return r1, r2, r3

def draw_grid_text_safe(page, text, xs, y0, y1, fontname="helv", max_font=10.5, max_x=588.0):
    if not text or not xs or len(xs) < 2:
        return
    num_cells = len(xs) - 1
    cell_w = xs[1] - xs[0]
    total_len = len(text)

    if total_len <= num_cells:
        pitch = cell_w
        font_size = max_font
        baseline = y1 - (y1 - y0 - font_size) / 2 - 1.2
        for i, ch in enumerate(text):
            cx = (xs[i] + xs[i + 1]) / 2
            tw = fitz.get_text_length(ch, fontname=fontname, fontsize=font_size)
            page.insert_text(fitz.Point(cx - tw / 2, baseline), ch, fontname=fontname, fontsize=font_size, color=(0, 0, 0))
    else:
        # Overflow outside boxes, safely condensed to stay within max_x
        avail_width = max_x - xs[0]
        pitch = min(cell_w, avail_width / total_len)
        font_size = min(max_font, pitch * 0.95)
        baseline = y1 - (y1 - y0 - font_size) / 2 - 1.2
        for i, ch in enumerate(text):
            cx = xs[0] + (i + 0.5) * pitch
            tw = fitz.get_text_length(ch, fontname=fontname, fontsize=font_size)
            page.insert_text(fitz.Point(cx - tw / 2, baseline), ch, fontname=fontname, fontsize=font_size, color=(0, 0, 0))

def draw_vehicle_mta6(page, parsed_veh, set1_xs, set2_xs, set3_xs, y0, y1):
    if not parsed_veh or not parsed_veh.get('part3'):
        return
    h = y1 - y0
    font_size = 10.5
    baseline = y1 - (h - font_size) / 2 - 1.2

    def draw_sub(text, xs):
        if not text or not xs:
            return
        num_cells = len(xs) - 1
        clean = text.strip()
        if len(clean) == 1 and num_cells == 3:
            indices = [1]
        elif len(clean) == 2 and num_cells == 3:
            indices = [0, 1]
        else:
            indices = list(range(min(len(clean), num_cells)))
        for i, idx in enumerate(indices):
            ch = clean[i]
            cx = (xs[idx] + xs[idx + 1]) / 2
            tw = fitz.get_text_length(ch, fontname="helv", fontsize=font_size)
            page.insert_text(fitz.Point(cx - tw / 2, baseline), ch, fontname="helv", fontsize=font_size, color=(0, 0, 0))

    draw_sub(parsed_veh['part1'], set1_xs)
    draw_sub(parsed_veh['part2'], set2_xs)
    draw_sub(parsed_veh['part3'], set3_xs)

def draw_plain_text_safe(page, text, x, y, max_x=None, fontname="helv", fontsize=9.5):
    if not text:
        return
    clean = text.strip()
    if max_x and max_x > x:
        tw = fitz.get_text_length(clean, fontname=fontname, fontsize=fontsize)
        if tw > (max_x - x):
            fontsize = max(7.0, fontsize * ((max_x - x) / tw))
    page.insert_text(fitz.Point(x, y), clean, fontname=fontname, fontsize=fontsize, color=(0, 0, 0))

def fill_forms(data, output_pdf="filled_transfer_forms.pdf", template_path=TEMPLATE_PATH):
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template PDF not found: {template_path}")

    doc = fitz.open(template_path)

    parsed_veh = parse_vehicle_number(data.get("vehicleNumber"))
    date_str = (data.get("transferDate") or "").strip()
    has_date = not data.get("isOpenPapers") and bool(date_str) and len(date_str.split("-")) == 3
    day, month, year = ("", "", "")
    if has_date:
        year, month, day = date_str.split("-")

    transf_name_1, transf_name_2 = split_text_into_rows((data.get("transferorName") or "").upper(), 35, 35)
    transf_addr_1, transf_addr_2 = split_text_into_rows((data.get("transferorAddress") or "").upper(), 35, 35)

    buyer_name_1, buyer_name_2 = split_text_into_rows((data.get("transfereeName") or "").upper(), 35, 35)
    buyer_addr_1, buyer_addr_2 = split_text_into_rows((data.get("transfereeAddress") or "").upper(), 35, 35)

    transf_nic = (data.get("transferorNic") or "").upper().strip()
    buyer_nic = (data.get("transfereeNic") or "").upper().strip()

    pages_mta6_cfg = [
        (0, 281.9, 300.3, 350.6, 407.8, 428.0, 480.1, 655.5, 819.2, 
         (415, 652, 445, 685, 425, 751), (425, 782, 445, 816, 425, 859, 90, 859), (200, 917, 35, 930, 375, 944, 340, 959)),
        (2, 285.5, 304.5, 354.8, 412.0, 432.2, 484.2, 649.6, 819.1,
         (415, 647, 445, 682, 425, 753), (425, 782, 445, 816, 425, 860, 90, 860), (200, 919, 35, 932, 375, 946, 340, 961)),
        (4, 274.8, 295.6, 345.9, 403.1, 424.5, 476.6, 642.1, 805.2,
         (415, 640, 445, 669, 425, 734), (425, 768, 445, 803, 425, 843, 90, 843), (200, 909, 35, 922, 375, 936, 340, 951)),
        (6, 292.3, 312.6, 362.0, 418.1, 437.8, 488.8, 660.9, 815.6,
         (415, 658, 440, 690, 420, 753), (415, 779, 440, 813, 420, 851, 90, 851), (200, 925, 35, 938, 375, 952, 340, 967))
    ]

    xs_35 = [48.6 + i * 15.12 for i in range(36)]
    nic_xs = [48.6 + i * 15.12 for i in range(13)]

    v_s1 = [381.31, 396.43, 411.55, 426.67]
    v_s2 = [441.82, 456.94, 472.06, 487.18]
    v_s3 = [502.30, 517.42, 532.54, 547.68, 562.80]

    for pno, dy, ny, ay, vy, by, bay, tny, bny, w1, w2, od in pages_mta6_cfg:
        if pno >= len(doc):
            continue
        p = doc[pno]

        if has_date:
            draw_grid_text_safe(p, day, [320.8, 336.0, 351.1], dy, dy + 13.3)
            draw_grid_text_safe(p, month, [426.7, 441.8, 456.9], dy, dy + 13.3)
            draw_grid_text_safe(p, year, [517.4, 532.5, 547.7, 562.8, 577.9], dy, dy + 13.3)

        draw_grid_text_safe(p, transf_name_1, xs_35, ny, ny + 18.6)
        draw_grid_text_safe(p, transf_name_2, xs_35, ny + 21.8, ny + 40.4)

        draw_grid_text_safe(p, transf_addr_1, xs_35, ay, ay + 18.6)
        draw_grid_text_safe(p, transf_addr_2, xs_35, ay + 21.8, ay + 40.4)

        draw_vehicle_mta6(p, parsed_veh, v_s1, v_s2, v_s3, vy, vy + 15.1)

        draw_grid_text_safe(p, buyer_name_1, xs_35, by, by + 18.6)
        draw_grid_text_safe(p, buyer_name_2, xs_35, by + 21.8, by + 40.4)

        draw_grid_text_safe(p, buyer_addr_1, xs_35, bay, bay + 18.6)
        draw_grid_text_safe(p, buyer_addr_2, xs_35, bay + 21.8, bay + 40.4)

        draw_grid_text_safe(p, transf_nic, nic_xs, tny, tny + 18.6)
        draw_grid_text_safe(p, buyer_nic, nic_xs, bny, bny + 18.6)

        if data.get("witness1Name"):
            draw_plain_text_safe(p, data["witness1Name"].upper(), w1[0], w1[1])
        if data.get("witness1Address"):
            draw_plain_text_safe(p, data["witness1Address"].upper(), w1[2], w1[3])
        if data.get("witness1Nic"):
            draw_plain_text_safe(p, data["witness1Nic"].upper(), w1[4], w1[5])

        if data.get("witness2Name"):
            draw_plain_text_safe(p, data["witness2Name"].upper(), w2[0], w2[1])
        if data.get("witness2Address"):
            draw_plain_text_safe(p, data["witness2Address"].upper(), w2[2], w2[3])
        if data.get("witness2Nic"):
            draw_plain_text_safe(p, data["witness2Nic"].upper(), w2[4], w2[5])
        if has_date:
            draw_plain_text_safe(p, date_str, w2[6], w2[7])

        if data.get("isOneDay") and parsed_veh.get("full"):
            draw_plain_text_safe(p, parsed_veh["full"], od[0], od[1])
            draw_plain_text_safe(p, parsed_veh["full"], od[2], od[3])
            draw_plain_text_safe(p, parsed_veh["full"], od[4], od[5])

            owner_date = (data.get("transferorName") or "").upper().strip()
            if has_date:
                owner_date = f"{owner_date}  |  {date_str}"
            draw_plain_text_safe(p, owner_date, od[6], od[7], max_x=575.0, fontsize=8.5)

    # Fill MTA 8 Pages: 8 (C) and 10 (C1)
    for pno, back_pno in [(8, 9), (10, 11)]:
        if pno >= len(doc):
            continue
        p = doc[pno]

        if pno == 8:
            # Page 9 exact grid
            v_xs = [434.4, 450.5, 466.5, 482.6, 498.7, 514.8, 530.9, 547.0, 563.0, 579.1, 592.8]
            t1_xs = [160.9, 177.0, 193.1, 209.2, 225.3, 241.4, 257.5, 273.5, 289.6, 305.7, 321.8, 337.9, 354.0, 370.0, 386.1, 402.2, 418.3, 434.4, 450.5, 466.5, 482.6, 498.7, 514.8, 530.9, 547.0, 563.0, 579.1, 592.8]
            t2_xs = [26.6, 42.7, 62.0, 78.1, 96.6, 112.7, 128.8, 144.9, 160.9, 177.0, 193.1, 209.2, 225.3, 241.4, 257.5, 273.5, 289.6, 305.7, 321.8, 337.9, 354.0, 370.0, 386.1, 402.2, 418.3, 434.4, 450.5, 466.5, 482.6, 498.7, 514.8, 530.9, 547.0, 563.0, 579.1, 592.8]
            bn1_xs = [62.0, 78.1, 96.6, 112.7, 128.8, 144.9, 160.9, 177.0, 193.1, 209.2, 225.3, 241.4, 257.5, 273.5, 289.6, 305.7, 321.8, 337.9, 354.0, 370.0, 386.1, 402.2, 418.3, 434.4, 450.5, 466.5, 482.6, 498.7, 514.8, 530.9, 547.0, 563.0, 579.1, 592.8]
            ba1_xs = [96.6, 112.7, 128.8, 144.9, 160.9, 177.0, 193.1, 209.2, 225.3, 241.4, 257.5, 273.5, 289.6, 305.7, 321.8, 337.9, 354.0, 370.0, 386.1, 402.2, 418.3, 434.4, 450.5, 466.5, 482.6, 498.7, 514.8, 530.9, 547.0, 563.0, 579.1, 592.8]
            nic_xs = [418.3, 434.4, 450.5, 466.5, 482.6, 498.7, 514.8, 530.9, 547.0, 563.0, 579.1, 592.8]
            post_xs = [177.0, 193.1, 209.2, 225.3, 241.4, 257.5]
            mob_xs = [434.4, 450.5, 466.5, 482.6, 498.7, 514.8, 530.9, 547.0, 563.0, 579.1, 592.8]
            ds_xs = [160.9, 177.0, 193.1, 209.2, 225.3, 241.4, 257.5, 273.5, 289.6, 305.7, 321.8, 337.9]
            dist_xs = [402.2, 418.3, 434.4, 450.5, 466.5, 482.6, 498.7, 514.8, 530.9, 547.0, 563.0, 579.1, 592.8]
            prov_xs = [96.6, 112.7, 128.8, 144.9, 160.9, 177.0, 193.1, 209.2, 225.3, 241.4, 257.5, 273.5, 289.6, 305.7, 321.8, 337.9]
            d_xs = [354.0, 370.0, 386.1]
            m_xs = [418.3, 434.4, 450.5]
            y_xs = [482.6, 498.7, 514.8, 530.9, 547.0]
            pref_xs = [337.9, 354.0, 370.0, 386.1, 402.2, 418.3, 434.4, 450.5, 466.5, 482.6, 498.7, 514.8, 530.9, 547.0, 563.0, 579.1]

            if parsed_veh.get("mta8"):
                draw_grid_text_safe(p, parsed_veh["mta8"], v_xs, 356.8, 378.5)

            m8_t1, m8_t2 = split_text_into_rows((data.get("transferorName") or "").upper(), 27, 35)
            draw_grid_text_safe(p, m8_t1, t1_xs, 393.0, 414.7)
            draw_grid_text_safe(p, m8_t2, t2_xs, 422.6, 444.3)

            m8_b1, m8_b2, m8_b3 = split_text_into_3_rows((data.get("transfereeName") or "").upper(), 33, 35, 35)
            draw_grid_text_safe(p, m8_b1, bn1_xs, 455.2, 476.9)
            draw_grid_text_safe(p, m8_b2, t2_xs, 481.2, 502.9)
            draw_grid_text_safe(p, m8_b3, t2_xs, 508.0, 529.7)

            m8_a1, m8_a2, m8_a3 = split_text_into_3_rows((data.get("transfereeAddress") or "").upper(), 31, 35, 35)
            draw_grid_text_safe(p, m8_a1, ba1_xs, 541.2, 562.9)
            draw_grid_text_safe(p, m8_a2, t2_xs, 568.0, 589.7)
            draw_grid_text_safe(p, m8_a3, t2_xs, 594.0, 615.7)

            draw_grid_text_safe(p, buyer_nic, nic_xs, 638.2, 659.2)
            draw_grid_text_safe(p, (data.get("transfereePostalCode") or "").strip(), post_xs, 670.0, 691.7)
            draw_grid_text_safe(p, (data.get("transfereeMobile") or "").replace(" ", ""), mob_xs, 670.0, 691.7)
            draw_grid_text_safe(p, (data.get("divisionalSecretariat") or "").upper().strip(), ds_xs, 719.9, 743.1)
            draw_grid_text_safe(p, (data.get("district") or "").upper().strip(), dist_xs, 719.9, 743.1)
            draw_grid_text_safe(p, (data.get("province") or "").upper().strip(), prov_xs, 748.1, 769.8)

            if has_date:
                draw_grid_text_safe(p, day, d_xs, 774.9, 796.6)
                draw_grid_text_safe(p, month, m_xs, 774.9, 796.6)
                draw_grid_text_safe(p, year, y_xs, 774.9, 796.6)

            draw_grid_text_safe(p, (data.get("preferredOffice") or "").upper().strip(), pref_xs, 830.7, 849.5)

        else:
            # Page 11 exact grid (Form C1)
            v_xs = [433.7, 449.7, 465.8, 481.9, 498.0, 514.1, 530.1, 546.2, 562.3, 578.4, 594.5]
            t1_xs = [160.2, 176.3, 192.4, 208.5, 224.6, 240.6, 256.7, 272.8, 288.9, 305.0, 321.0, 337.1, 353.2, 369.3, 385.4, 401.5, 417.5, 433.7, 449.7, 465.8, 481.9, 498.0, 514.1, 530.1, 546.2, 562.3, 578.4, 594.5]
            t2_xs = [26.6, 42.7, 62.0, 78.1, 95.9, 112.0, 128.1, 144.1, 160.2, 176.3, 192.4, 208.5, 224.6, 240.6, 256.7, 272.8, 288.9, 305.0, 321.0, 337.1, 353.2, 369.3, 385.4, 401.5, 417.5, 433.7, 449.7, 465.8, 481.9, 498.0, 514.1, 530.1, 546.2, 562.3, 578.4, 594.5]
            bn1_xs = [62.0, 78.1, 95.9, 112.0, 128.1, 144.1, 160.2, 176.3, 192.4, 208.5, 224.6, 240.6, 256.7, 272.8, 288.9, 305.0, 321.0, 337.1, 353.2, 369.3, 385.4, 401.5, 417.5, 433.7, 449.7, 465.8, 481.9, 498.0, 514.1, 530.1, 546.2, 562.3, 578.4, 594.5]
            ba1_xs = [95.9, 112.0, 128.1, 144.1, 160.2, 176.3, 192.4, 208.5, 224.6, 240.6, 256.7, 272.8, 288.9, 305.0, 321.0, 337.1, 353.2, 369.3, 385.4, 401.5, 417.5, 433.7, 449.7, 465.8, 481.9, 498.0, 514.1, 530.1, 546.2, 562.3, 578.4, 594.5]
            nic_xs = [417.5, 433.7, 449.7, 465.8, 481.9, 498.0, 514.1, 530.1, 546.2, 562.3, 578.4, 594.5]
            post_xs = [176.3, 192.4, 208.5, 224.6, 240.6, 256.7]
            mob_xs = [433.7, 449.7, 465.8, 481.9, 498.0, 514.1, 530.1, 546.2, 562.3, 578.4, 594.5]
            ds_xs = [160.2, 176.3, 192.4, 208.5, 224.6, 240.6, 256.7, 272.8, 288.9, 305.0, 321.0, 337.1]
            dist_xs = [401.5, 417.5, 433.7, 449.7, 465.8, 481.9, 498.0, 514.1, 530.1, 546.2, 562.3, 578.4, 594.5]
            prov_xs = [95.9, 112.0, 128.1, 144.1, 160.2, 176.3, 192.4, 208.5, 224.6, 240.6, 256.7, 272.8, 288.9, 305.0, 321.0, 337.1]
            d_xs = [353.2, 369.3, 385.4]
            m_xs = [417.5, 433.7, 449.7]
            y_xs = [481.9, 498.0, 514.1, 530.1, 546.2]
            pref_xs = [337.1, 353.2, 369.3, 385.4, 401.5, 417.5, 433.7, 449.7, 465.8, 481.9, 498.0, 514.1, 530.1, 546.2, 562.3, 578.4]

            if parsed_veh.get("mta8"):
                draw_grid_text_safe(p, parsed_veh["mta8"], v_xs, 337.9, 359.6)

            m8_t1, m8_t2 = split_text_into_rows((data.get("transferorName") or "").upper(), 27, 35)
            draw_grid_text_safe(p, m8_t1, t1_xs, 374.2, 395.9)
            draw_grid_text_safe(p, m8_t2, t2_xs, 403.8, 425.5)

            m8_b1, m8_b2, m8_b3 = split_text_into_3_rows((data.get("transfereeName") or "").upper(), 33, 35, 35)
            draw_grid_text_safe(p, m8_b1, bn1_xs, 436.3, 458.0)
            draw_grid_text_safe(p, m8_b2, t2_xs, 462.3, 484.1)
            draw_grid_text_safe(p, m8_b3, t2_xs, 489.1, 510.8)

            m8_a1, m8_a2, m8_a3 = split_text_into_3_rows((data.get("transfereeAddress") or "").upper(), 31, 35, 35)
            draw_grid_text_safe(p, m8_a1, ba1_xs, 522.3, 544.1)
            draw_grid_text_safe(p, m8_a2, t2_xs, 549.1, 570.8)
            draw_grid_text_safe(p, m8_a3, t2_xs, 575.2, 596.9)

            draw_grid_text_safe(p, buyer_nic, nic_xs, 619.3, 640.3)
            draw_grid_text_safe(p, (data.get("transfereePostalCode") or "").strip(), post_xs, 651.1, 672.8)
            draw_grid_text_safe(p, (data.get("transfereeMobile") or "").replace(" ", ""), mob_xs, 651.1, 672.8)
            draw_grid_text_safe(p, (data.get("divisionalSecretariat") or "").upper().strip(), ds_xs, 701.0, 724.2)
            draw_grid_text_safe(p, (data.get("district") or "").upper().strip(), dist_xs, 701.0, 724.2)
            draw_grid_text_safe(p, (data.get("province") or "").upper().strip(), prov_xs, 729.3, 751.0)

            if has_date:
                draw_grid_text_safe(p, day, d_xs, 756.0, 777.8)
                draw_grid_text_safe(p, month, m_xs, 756.0, 777.8)
                draw_grid_text_safe(p, year, y_xs, 756.0, 777.8)

            draw_grid_text_safe(p, (data.get("preferredOffice") or "").upper().strip(), pref_xs, 811.8, 826.4)

        if back_pno < len(doc) and has_date:
            draw_plain_text_safe(doc[back_pno], date_str, 105, 636)

    # Remove blank pages from complete template:
    # Page 2 (idx 1), Page 4 (idx 3), Page 13 (idx 12)
    # Remove in descending order to preserve indexes
    if len(doc) == 13:
        doc.delete_page(12)
        doc.delete_page(3)
        doc.delete_page(1)

    doc.save(output_pdf)
    print(f"Generated: {output_pdf}")
    return output_pdf

if __name__ == "__main__":
    sample_data = {
        "vehicleNumber": "5 Sri 2525",
        "transferDate": "2026-11-16",
        "isOpenPapers": False,
        "isOneDay": True,
        "transferorName": "WARNAKULASOORIYA MAHAWADUGE KASUN CHAMARA FERNANDO GUNAWARDANA",
        "transferorAddress": "NO 45/2, TEMPLE ROAD, NAWALA, RAJAGIRIYA",
        "transferorNic": "198812345678",
        "transferorPhone": "0771234567",
        "transfereeName": "HETTIARACHCHIGE DONA ANURADHA PRIYADARSHANI WIJESEKARA",
        "transfereeAddress": "NO 112/A, GALLE ROAD, DEHIWALA",
        "transfereeNic": "199456789012",
        "transfereeMobile": "0719876543",
        "transfereePostalCode": "10350",
        "divisionalSecretariat": "DEHIWALA",
        "district": "COLOMBO",
        "province": "WESTERN",
        "preferredOffice": "NARAHENPITA",
        "witness1Name": "M. A. SARATH KUMARA",
        "witness1Address": "NO 12, SCHOOL LANE, NAWALA",
        "witness1Nic": "197511223344",
        "witness2Name": "K. NIMAL PERERA",
        "witness2Address": "NO 88, STATION ROAD, DEHIWALA",
        "witness2Nic": "198299887766"
    }
    fill_forms(sample_data, "Filled_Sri_Sample.pdf")
