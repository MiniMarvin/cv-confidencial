from pdfparse import __version__
from pdfparse.getPdfText import parse_pages

def test_version():
    assert __version__ == '0.1.0'

def test_parse_pdf():
    parse_pages('assets/cv.pdf', 'output/cv.pdf')