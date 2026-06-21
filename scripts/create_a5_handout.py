import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


OUTPUT = "output/pdf/computing-technology-stage-5-a5-handout.pdf"

PAGE_W, PAGE_H = A5
MARGIN = 11 * mm
GOLD = colors.HexColor("#c4932f")
GOLD_DARK = colors.HexColor("#8a6112")
INK = colors.HexColor("#181713")
MUTED = colors.HexColor("#5f5a50")
PAPER = colors.HexColor("#fffdf8")
SOFT = colors.HexColor("#fff4d3")
LINE = colors.HexColor("#ead8a6")
IMAGE_PATH = "tmp/pdfs/handout-tech.png"


def wrap_text(text, font_name, font_size, max_width):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        trial = f"{line} {word}".strip()
        if stringWidth(trial, font_name, font_size) <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def draw_wrapped(c, text, x, y, width, font_name="Helvetica", font_size=8.8, leading=11, color=MUTED):
    c.setFont(font_name, font_size)
    c.setFillColor(color)
    for line in wrap_text(text, font_name, font_size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def round_rect(c, x, y, w, h, radius=6, fill=colors.white, stroke=LINE, line_width=0.8):
    c.setLineWidth(line_width)
    c.setStrokeColor(stroke)
    c.setFillColor(fill)
    c.roundRect(x, y, w, h, radius, stroke=1, fill=1)


def pill(c, text, x, y, font_size=7.1):
    pad_x = 5
    h = 12
    w = stringWidth(text, "Helvetica-Bold", font_size) + pad_x * 2
    c.setFillColor(colors.HexColor("#fff7dc"))
    c.setStrokeColor(colors.HexColor("#ead8a6"))
    c.setLineWidth(0.6)
    c.roundRect(x, y, w, h, 6.5, stroke=1, fill=1)
    c.setFillColor(GOLD_DARK)
    c.setFont("Helvetica-Bold", font_size)
    c.drawString(x + pad_x, y + 3.6, text)
    return w


def draw_unit(c, title, body, chips, x, y, w, h, number):
    round_rect(c, x, y, w, h, radius=7, fill=colors.white)
    c.setFillColor(SOFT)
    c.roundRect(x + 7, y + h - 24, 19, 17, 5, stroke=0, fill=1)
    c.setFillColor(GOLD_DARK)
    c.setFont("Helvetica-Bold", 7.4)
    c.drawCentredString(x + 16.5, y + h - 18.7, f"0{number}")

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(x + 31, y + h - 18.5, title)
    draw_wrapped(c, body, x + 9, y + h - 37, w - 18, font_size=6.8, leading=7.8)

    chip_x = x + 9
    chip_y = y + 6
    for chip in chips:
        chip_w = stringWidth(chip, "Helvetica-Bold", 6.7) + 10
        if chip_x + chip_w > x + w - 8:
            chip_x = x + 9
            chip_y -= 15
        pill(c, chip, chip_x, chip_y, font_size=6.7)
        chip_x += chip_w + 4


def ensure_visual_image():
    if os.path.exists(IMAGE_PATH):
        return IMAGE_PATH

    try:
        from PIL import Image, ImageDraw, ImageFont

        os.makedirs(os.path.dirname(IMAGE_PATH), exist_ok=True)
        img = Image.new("RGB", (900, 430), "#fff8e4")
        draw = ImageDraw.Draw(img)

        for y in range(430):
            shade = int(248 - y * 0.08)
            draw.line((0, y, 900, y), fill=(255, max(235, shade), 184))

        draw.ellipse((565, -70, 1020, 385), fill=(255, 226, 141))
        draw.ellipse((660, 95, 990, 425), fill=(255, 249, 232))
        draw.rounded_rectangle((45, 55, 525, 350), radius=28, fill="#ffffff", outline="#e3c36f", width=4)
        draw.rounded_rectangle((82, 95, 488, 135), radius=14, fill="#fff0bd")
        for i, color in enumerate(["#c4932f", "#e4bd5d", "#f7d87f"]):
            draw.ellipse((105 + i * 34, 108, 121 + i * 34, 124), fill=color)
        draw.rounded_rectangle((83, 165, 315, 315), radius=18, fill="#f2e5bf")
        draw.rounded_rectangle((335, 165, 465, 315), radius=18, fill="#fff6dc")
        draw.rounded_rectangle((585, 95, 830, 340), radius=28, fill="#20180b")

        font = ImageFont.load_default()
        code = ["build.website()", "game.update()", "robot.sense()"]
        for i, line in enumerate(code):
            draw.text((620, 135 + i * 45), line, fill="#ffd86f" if i == 0 else "#fff2c7", font=font)

        draw.rounded_rectangle((74, 255, 292, 305), radius=18, fill="#c4932f")
        draw.text((118, 272), "CREATE", fill="#20180b", font=font)
        img.save(IMAGE_PATH)
        return IMAGE_PATH
    except Exception:
        return None


def draw_tech_visual(c, x, y, w, h):
    round_rect(c, x, y, w, h, radius=10, fill=colors.HexColor("#fff9e8"), stroke=LINE)
    c.setFillColor(colors.HexColor("#fff1c4"))
    c.circle(x + w - 38, y + h - 23, 48, stroke=0, fill=1)

    c.setFillColor(colors.white)
    c.setStrokeColor(colors.HexColor("#ead8a6"))
    c.setLineWidth(0.8)
    image_x = x + 13
    image_y = y + 13
    image_w = w * 0.54
    image_h = h - 62
    c.roundRect(image_x, image_y, image_w, image_h, 7, stroke=1, fill=1)

    image_path = ensure_visual_image()
    if image_path:
        c.drawImage(
            ImageReader(image_path),
            image_x + 4,
            image_y + 4,
            width=image_w - 8,
            height=image_h - 8,
            preserveAspectRatio=True,
            anchor="c",
        )
    else:
        c.setFillColor(colors.HexColor("#20180b"))
        c.roundRect(image_x + 4, image_y + 4, image_w - 8, image_h - 8, 6, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#fff4d3"))
        c.roundRect(image_x + 13, image_y + image_h - 26, image_w - 26, 11, 4, stroke=0, fill=1)
        c.setFillColor(GOLD)
        for i in range(3):
            c.circle(image_x + 20 + i * 9, image_y + image_h - 20, 2.2, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#ffffff"))
        c.roundRect(image_x + 14, image_y + 12, image_w * 0.48, image_h - 45, 5, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#ffe8a3"))
        c.roundRect(image_x + image_w * 0.58, image_y + 12, image_w * 0.27, image_h - 45, 5, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#c4932f"))
        c.setFont("Helvetica-Bold", 7)
        c.drawString(image_x + 18, image_y + 20, "UI")
        c.setFillColor(colors.HexColor("#20180b"))
        c.drawString(image_x + image_w * 0.62, image_y + 20, "APP")

    code_x = x + w * 0.62
    code_y = y + 15
    code_w = w * 0.29
    code_h = h - 58
    c.setFillColor(colors.HexColor("#20180b"))
    c.roundRect(code_x, code_y, code_w, code_h, 7, stroke=0, fill=1)
    code_lines = ["build.website()", "game.update()", "robot.sense()"]
    c.setFont("Courier-Bold", 6.3)
    for i, line in enumerate(code_lines):
        c.setFillColor(GOLD if i == 0 else colors.HexColor("#fff0bc"))
        c.drawString(code_x + 8, code_y + code_h - 13 - i * 10, line)

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x + 13, y + h - 17, "Make technology you can show.")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawString(x + 13, y + h - 28, "Websites. Games. Apps. Smart systems.")


def main():
    c = canvas.Canvas(OUTPUT, pagesize=A5)
    c.setTitle("Computing Technology Stage 5 A5 Handout")

    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Decorative tech grid and gold accents.
    c.setStrokeColor(colors.HexColor("#f1e6c6"))
    c.setLineWidth(0.35)
    for x in range(0, int(PAGE_W), 28):
        c.line(x, 0, x, PAGE_H)
    for y in range(0, int(PAGE_H), 28):
        c.line(0, y, PAGE_W, y)
    c.setFillColor(colors.HexColor("#fff3cf"))
    c.circle(PAGE_W - 30 * mm, PAGE_H - 23 * mm, 43 * mm, stroke=0, fill=1)
    c.setFillColor(colors.HexColor("#fff9ea"))
    c.circle(PAGE_W - 6 * mm, PAGE_H - 65 * mm, 48 * mm, stroke=0, fill=1)

    x0 = MARGIN
    y = PAGE_H - MARGIN

    c.setFillColor(GOLD_DARK)
    c.setFont("Helvetica-Bold", 7.8)
    c.drawString(x0, y, "YEAR 9 AND YEAR 10 ELECTIVE")

    y -= 18
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 23.5)
    c.drawString(x0, y, "Computing")
    y -= 23
    c.drawString(x0, y, "Technology")
    y -= 23
    c.drawString(x0, y, "Stage 5")

    y -= 18
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(x0, y, "Design. Code. Build. Create.")
    y -= 14
    y = draw_wrapped(
        c,
        "Build websites, games, apps, robots and digital systems while learning the skills behind the technology you use every day.",
        x0,
        y,
        PAGE_W - 2 * MARGIN,
        font_size=8.8,
        leading=11,
        color=MUTED,
    )

    # Feature strip.
    strip_y = y - 8
    round_rect(c, x0, strip_y - 37, PAGE_W - 2 * MARGIN, 40, radius=8, fill=colors.white)
    c.setFillColor(GOLD_DARK)
    c.setFont("Helvetica-Bold", 7.6)
    c.drawString(x0 + 9, strip_y - 9, "WHY CHOOSE IT?")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9.1)
    c.drawString(x0 + 9, strip_y - 22, "Creative projects, future skills, real technology.")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawString(x0 + 9, strip_y - 31, "A strong fit if you like making things, solving problems or exploring how tech works.")

    # Unit cards.
    grid_top = strip_y - 57
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(x0, grid_top + 7, "What you will explore")
    card_gap = 7
    card_w = (PAGE_W - 2 * MARGIN - card_gap) / 2
    card_h = 72
    units = [
        ("Web Development", "Plan, design, style and publish interactive websites.", ["HTML", "CSS", "JavaScript"], 1),
        ("Game Development", "Create playable experiences with mechanics, scoring and testing.", ["Sprites", "Levels", "Logic"], 2),
        ("Mechatronics", "Connect hardware and software to make smart systems.", ["Sensors", "Motors", "Circuits"], 3),
        ("Python and Apps", "Use programming logic to solve problems and design app ideas.", ["Python", "Loops", "Debugging"], 4),
    ]
    for i, (title, body, chips, number) in enumerate(units):
        row = i // 2
        col = i % 2
        x = x0 + col * (card_w + card_gap)
        yy = grid_top - row * (card_h + card_gap) - card_h
        draw_unit(c, title, body, chips, x, yy, card_w, card_h, number)

    visual_y = MARGIN + 30
    draw_tech_visual(c, x0, visual_y, PAGE_W - 2 * MARGIN, 102)

    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 8.1)
    c.drawRightString(PAGE_W - MARGIN, MARGIN + 1, "Choose Computing Technology")

    c.showPage()
    c.save()


if __name__ == "__main__":
    main()
