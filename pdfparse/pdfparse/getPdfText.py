import fitz

def parse_pages(file_path, output_path):
    doc = fitz.open(file_path)

    for page in doc:
        lines = get_line_blocks(page)
        bound_texts(lines, page)
        # to avoid issues with multiple pages files let's focus on the first page only
        break

    doc.save(output_path, garbage=4, deflate=True, clean=True)

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