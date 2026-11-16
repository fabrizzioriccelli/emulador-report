"""
Põe um deck gerado (pptxgenjs) dentro do modelo oficial Santander 2026 (Template_SANTANTANDER26_HZ_PT_.pptx):
cada página nova nasce de uma página-base do próprio modelo (o tema, as fontes embutidas e os elementos da
página-base: chama, número da página, painéis Lisboa, fotos da capa), recebe os textos trocados e, por cima, as
formas da página gerada (textos, cartões, capturas reais). Links entre páginas e anotações do apresentador seguem.
As páginas de exemplo do modelo saem do arquivo final (e as fotos que só elas usavam).

Uso: python3 no-modelo.py <gerado.pptx> <gerado.modelo.json> <modelo.pptx> <saida.pptx>
O .json tem uma entrada por página gerada: {"base": n, "manter": [nomes], "textos": {nome: [linhas]}, "cores": {nome: "RRGGBB"},
"num": true, "semChama": false, "videos": [{"arquivo", "capa", "x", "y", "w", "h"} (em pontos)]}.
A chama pequena do modelo fica sempre por cima das formas da página-base (nenhum painel do modelo a cobre).
"""
import copy, io, json, sys
from lxml import etree
from pptx import Presentation
from pptx.opc.constants import RELATIONSHIP_TYPE as RT
from pptx.oxml.ns import qn

GERADO, SPEC, MODELO, SAIDA = sys.argv[1:5]
gen = Presentation(GERADO)
prs = Presentation(MODELO)
spec = json.load(open(SPEC, encoding="utf-8"))
assert len(spec) == len(gen.slides), "spec %d x páginas %d" % (len(spec), len(gen.slides))
tpl = list(prs.slides)
originais = [s for s in prs.slides._sldIdLst]
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
ATTRS = (qn("r:embed"), qn("r:link"), qn("r:id"))
pendentes = []  # (elemento, atributo, parte do slide de destino no deck gerado, parte do novo slide)


def nome(el):
    c = el.find(".//" + qn("p:cNvPr"))
    return c.get("name") if c is not None else None


def religar(el, src, dst, mesmo_pacote):
    """copia as relações usadas pelo elemento (imagens, links) da parte de origem para a de destino"""
    for no in el.iter():
        for at in ATTRS:
            rid = no.get(at)
            if not rid or rid not in src.rels:
                continue
            rel = src.rels[rid]
            if rel.is_external:
                no.set(at, dst.relate_to(rel.target_ref, rel.reltype, is_external=True))
            elif rel.reltype == RT.SLIDE:
                pendentes.append((no, at, rel.target_part, dst))
            elif mesmo_pacote:
                no.set(at, dst.relate_to(rel.target_part, rel.reltype))
            elif rel.reltype == RT.IMAGE:
                _, novo = dst.get_or_add_image_part(io.BytesIO(rel.target_part.blob))
                no.set(at, novo)
            else:
                raise SystemExit("relação não suportada: %s" % rel.reltype)


def trocar_texto(el, linhas):
    body = el.find(".//" + qn("p:txBody"))
    ps = body.findall(qn("a:p"))
    modelo = next((p for p in ps if p.find(qn("a:r")) is not None), ps[0])
    pPr = modelo.find(qn("a:pPr")); rPr = modelo.find(qn("a:r") + "/" + qn("a:rPr"))
    for p in ps:
        body.remove(p)
    for linha in linhas:
        p = etree.SubElement(body, qn("a:p"))
        if pPr is not None:
            p.append(copy.deepcopy(pPr))
        r = etree.SubElement(p, qn("a:r"))
        if rPr is not None:
            r.append(copy.deepcopy(rPr))
        etree.SubElement(r, qn("a:t")).text = linha


def pintar(el, cor):
    """troca a cor do texto (ex.: o número preto da abertura vira branco)"""
    for rPr in el.iter(qn("a:rPr")):
        for f in rPr.findall(qn("a:solidFill")):
            rPr.remove(f)
        sf = etree.Element(qn("a:solidFill")); etree.SubElement(sf, qn("a:srgbClr"), val=cor)
        rPr.insert(0, sf)


def numero_da_pagina(el):
    """o '‹nº›' do modelo vira o campo de número da página (continua certo se as páginas mudarem de ordem)"""
    for r in el.iter(qn("a:r")):
        t = r.find(qn("a:t"))
        if t is not None and "nº" in (t.text or ""):
            f = etree.Element(qn("a:fld"), id="{B6F15528-21DE-4FAA-801E-634DDDAF4B2B}", type="slidenum")
            for filho in list(r):
                f.append(filho)
            f.find(qn("a:t")).text = "‹#›"
            r.getparent().replace(r, f)


novos = []
for i, (gs, sp) in enumerate(zip(gen.slides, spec)):
    base = tpl[sp["base"] - 1]
    ns = prs.slides.add_slide(base.slide_layout)
    arvore = ns.shapes._spTree
    for el in list(arvore)[2:]:
        arvore.remove(el)
    # fundo da página-base
    bg = base._element.cSld.find(qn("p:bg"))
    if bg is not None:
        ns._element.cSld.insert(0, copy.deepcopy(bg))
    manter = set(sp.get("manter", [])) | set(sp.get("textos", {}).keys())
    if not sp.get("semChama"):
        manter.add("Freeform 2")  # a chama pequena do modelo, no canto inferior esquerdo
    chama = None
    for el in list(base.shapes._spTree)[2:]:
        n = nome(el)
        if n == "TextBox 3" and sp.get("num", True):
            novo = copy.deepcopy(el); numero_da_pagina(novo)
        elif n in manter:
            novo = copy.deepcopy(el)
            if n in sp.get("textos", {}):
                trocar_texto(novo, sp["textos"][n])
            if n in sp.get("cores", {}):
                pintar(novo, sp["cores"][n])
            if n in sp.get("escala", {}):
                # reduz a forma do modelo (mesma proporção, a partir do canto de cima): abre espaço para a chama
                xf = novo.find(".//" + qn("a:xfrm")); ext = xf.find(qn("a:ext")); f = sp["escala"][n]
                ext.set("cx", str(int(int(ext.get("cx")) * f))); ext.set("cy", str(int(int(ext.get("cy")) * f)))
        else:
            continue
        religar(novo, base.part, ns.part, True)
        if n == "Freeform 2":
            chama = novo
            continue
        arvore.append(novo)
    if chama is not None:
        arvore.append(chama)
    # formas da página gerada, por cima
    for el in list(gs.shapes._spTree)[2:]:
        novo = copy.deepcopy(el)
        religar(novo, gs.part, ns.part, False)
        arvore.append(novo)
    # vídeos de verdade (tocam no PowerPoint; a capa fica no lugar no PDF)
    for v in sp.get("videos", []):
        E = 12700
        ns.shapes.add_movie(v["arquivo"], int(v["x"] * E), int(v["y"] * E), int(v["w"] * E), int(v["h"] * E), poster_frame_image=v["capa"], mime_type="video/mp4")
    # ids únicos na página
    for k, c in enumerate(arvore.iter(qn("p:cNvPr"))):
        c.set("id", str(k + 1))
    if gs.has_notes_slide:
        t = gs.notes_slide.notes_text_frame.text
        if t.strip():
            ns.notes_slide.notes_text_frame.text = t
    novos.append(ns)

# links entre páginas: da página do deck gerado para a página nova correspondente
mapa = {s.part.partname: novos[k].part for k, s in enumerate(gen.slides)}
for no, at, alvo, dst in pendentes:
    no.set(at, dst.relate_to(mapa[alvo.partname], RT.SLIDE))

# tira as páginas de exemplo do modelo
lista = prs.slides._sldIdLst
for sid in originais:
    rid = sid.get(qn("r:id"))
    lista.remove(sid)
    prs.part.drop_rel(rid)

cp = prs.core_properties
cp.title = gen.core_properties.title or ""
cp.author = gen.core_properties.author or ""
cp.subject = "" if "PptxGenJS" in (gen.core_properties.subject or "") else (gen.core_properties.subject or "")
cp.keywords = ""
cp.comments = ""
cp.last_modified_by = ""
prs.save(SAIDA)
print("%s: %d páginas no modelo" % (SAIDA, len(novos)))
