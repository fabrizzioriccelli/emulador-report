"""
Leva para o PDF os links entre páginas das áreas clicáveis do .pptx (o LibreOffice só exporta os links externos
dessas formas). A página do PDF tem o mesmo tamanho da página do modelo (1440 x 810 pt), então a posição é a mesma.
Uso: python3 links-pdf.py <deck.pptx> <deck.pdf>
"""
import sys, pymupdf
from pptx import Presentation
from pptx.oxml.ns import qn
prs = Presentation(sys.argv[1]); pdf = pymupdf.open(sys.argv[2])
idx = {s.part.partname: i for i, s in enumerate(prs.slides)}
assert len(prs.slides) == len(pdf), "páginas diferentes"
EMU = 12700.0
n = 0
for i, s in enumerate(prs.slides):
    pg = pdf[i]
    for sh in s.shapes:
        h = sh._element.find(".//" + qn("p:cNvPr") + "/" + qn("a:hlinkClick"))
        if h is None or not h.get(qn("r:id")):
            continue
        rel = s.part.rels[h.get(qn("r:id"))]
        if rel.is_external:
            continue
        alvo = idx[rel.target_part.partname]
        r = pymupdf.Rect(sh.left / EMU, sh.top / EMU, (sh.left + sh.width) / EMU, (sh.top + sh.height) / EMU)
        pg.insert_link({"kind": pymupdf.LINK_GOTO, "from": r, "page": alvo, "to": pymupdf.Point(0, 0)})
        n += 1
pdf.saveIncr() if False else pdf.save(sys.argv[2] + ".tmp", garbage=3, deflate=True)
pdf.close()
import os; os.replace(sys.argv[2] + ".tmp", sys.argv[2])
print("links entre páginas no PDF:", n)
