import fitz

def parse_first_page(file_path):
    # READ IN PDF
    doc = fitz.open(file_path)

    for page in doc:
        # SEARCH
        text = "Here"
        text_instances = page.search_for(text)
        fonts = page.get_fonts()
        extracted_text = page.get_text()
        # print(extracted_text)
        col = fitz.utils.getColor("black")

        get_line_blocks(page)

        print(text_instances)

        # HIGHLIGHT
        # for inst in text_instances:
        #     print(inst)
        #     inst.y0 -= 8
        #     inst.y1 -= 8
        #     page.draw_rect(inst, color=col, fill=col, overlay=True)
        #     # highlight.update()
        # break
        lines = get_line_blocks(page)
        bound_texts(lines, page)


    # OUTPUT
    doc.save("output.pdf", garbage=4, deflate=True, clean=True)

def get_line_blocks(page):
    text = page.get_text()
    lines = text.split("\n")
    lines = [l for l in lines if l]
    return lines

def bound_texts(lines, page):
    for line in lines:
        text_instances = page.search_for(line)
        for instance in text_instances:
            anonymize_box(instance, page)

def anonymize_box(text_intance, page):
    diff = (text_intance.y1 - text_intance.y0)/2
    text_intance.y0 -= diff
    text_intance.y1 -= diff
    col = fitz.utils.getColor("black")
    page.draw_rect(text_intance, color=col, fill=col, overlay=True)