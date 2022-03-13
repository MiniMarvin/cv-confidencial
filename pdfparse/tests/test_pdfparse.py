from pdfparse import __version__
from pdfparse.getPdfText import parse_first_page, get_line_blocks

def test_version():
    assert __version__ == '0.1.0'

def test_parse_pdf():
    parse_first_page('assets/cv.pdf')