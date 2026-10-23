#!/usr/bin/env python3
"""
Glyph patches for the two display fonts that can't set Yoruba.

Jersey 10 (pixel headings) and Gochi Hand (handwriting) have no Ẹ ẹ Ọ ọ Ṣ ṣ or
₦, and Gochi Hand has no combining accents either. This builds a tiny font per
family from that family's own glyphs: the dot-below letters, ₦, the combining
grave / acute / dot below, and tone-marked ẹ̀ ẹ́ ọ̀ ọ́ (upper and lower case) as
ccmp ligatures, since those have no precomposed code point. layout.tsx loads
each patch first in its font stack with a unicode-range, so it only downloads
on pages that use one of these characters.

Usage:   python3 scripts/glyph-patches.py <Jersey10-Regular.ttf> <GochiHand-Regular.ttf>
Sources: github.com/google/fonts, ofl/jersey10 and ofl/gochihand (both OFL).
Needs:   pip install fonttools brotli
"""

import math
import sys
from pathlib import Path

from fontTools import subset
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

OUT = Path(__file__).resolve().parent.parent / "src" / "fonts"

DOT_BELOW = {"Edotbelow": ("E", 0x1EB8), "edotbelow": ("e", 0x1EB9),
             "Odotbelow": ("O", 0x1ECC), "odotbelow": ("o", 0x1ECD),
             "Sdotbelow": ("S", 0x1E62), "sdotbelow": ("s", 0x1E63)}
# Dot-below vowel + tone mark → (ligature name, precomposed toned vowel to start from)
TONED = {("Edotbelow", "grave"): "È", ("Edotbelow", "acute"): "É",
         ("edotbelow", "grave"): "è", ("edotbelow", "acute"): "é",
         ("Odotbelow", "grave"): "Ò", ("Odotbelow", "acute"): "Ó",
         ("odotbelow", "grave"): "ò", ("odotbelow", "acute"): "ó"}
UNICODES = [cp for _, cp in DOT_BELOW.values()] + [0x20A6, 0x0300, 0x0301, 0x0323]


class Patch:
    def __init__(self, path):
        self.font = TTFont(path)
        self.gs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.glyphs = {}  # name → (glyph, advance)
        self.unicodes = {}  # code point → name

    def g(self, ch):
        return self.cmap[ord(ch)]

    def advance(self, name):
        return self.font["hmtx"][name][0]

    def bounds(self, name):
        pen = BoundsPen(self.gs)
        self.gs[name].draw(pen)
        return pen.bounds

    def draw(self, pen, name, dx=0, dy=0, sx=1, sy=1):
        rec = DecomposingRecordingPen(self.gs)
        self.gs[name].draw(rec)
        rec.replay(TransformPen(pen, (sx, 0, 0, sy, dx, dy)))

    @staticmethod
    def rect(pen, x0, y0, x1, y1):
        pen.moveTo((x0, y0))
        pen.lineTo((x0, y1))
        pen.lineTo((x1, y1))
        pen.lineTo((x1, y0))
        pen.closePath()

    def add(self, name, advance, build, cp=None):
        pen = TTGlyphPen(None)
        build(pen)
        self.glyphs[name] = (pen.glyph(), advance)
        if cp is not None:
            self.unicodes[cp] = name

    def build(self, dot, mark, naira):
        """dot(pen, base, ox): draw a dot below `base` drawn at x offset ox.
        mark(pen, accent): draw a combining accent after a lowercase letter.
        naira(pen): draw ₦."""
        for name, (base, cp) in DOT_BELOW.items():
            b = self.g(base)
            self.add(name, self.advance(b), lambda p, b=b: (self.draw(p, b), dot(p, b, 0)), cp)
        for (base, accent), toned in TONED.items():
            b, t = self.g(DOT_BELOW[base][0]), self.g(toned)
            self.add(f"{base}{accent}", self.advance(t), lambda p, b=b, t=t: (self.draw(p, t), dot(p, b, 0)))
        o = self.g("o")
        self.add("dotbelowcomb", 0, lambda p: dot(p, o, -self.advance(o)), 0x0323)
        for accent, cp in (("grave", 0x0300), ("acute", 0x0301)):
            if cp not in self.cmap:
                self.add(f"{accent}comb", 0, lambda p, a=accent: mark(p, a), cp)
        self.add("naira", naira(None), naira, 0x20A6)

    def save(self, out, family):
        font = self.font
        glyf, hmtx = font["glyf"], font["hmtx"]
        for name, (glyph, advance) in self.glyphs.items():
            glyf[name] = glyph
            glyph.recalcBounds(glyf)
            hmtx[name] = (advance, glyph.xMin if glyph.numberOfContours else 0)
        font.setGlyphOrder(glyf.glyphOrder)
        for table in font["cmap"].tables:
            if table.isUnicode():
                table.cmap.update(self.unicodes)

        comb = {cp: name for cp, name in self.unicodes.items()}
        comb.update({cp: self.cmap[cp] for cp in (0x0300, 0x0301) if cp in self.cmap})
        rules = "\n".join(
            f"  sub {base} {comb[0x0300 if accent == 'grave' else 0x0301]} by {base}{accent};"
            for base, accent in TONED
        )
        for tag in ("GSUB", "GPOS", "GDEF", "kern"):
            if tag in font:
                del font[tag]
        addOpenTypeFeaturesFromString(
            font,
            f"languagesystem DFLT dflt;\nlanguagesystem latn dflt;\nfeature ccmp {{\n{rules}\n}} ccmp;\n",
        )

        # A modified OFL font can't keep its Reserved Font Name.
        names = font["name"]
        ps = family.replace(" ", "") + "-Regular"
        for nid in (1, 3, 4, 6, 16, 17, 21, 22, 25):
            names.removeNames(nameID=nid)
        for nid, value in ((1, family), (2, "Regular"), (3, ps), (4, family), (6, ps)):
            names.setName(value, nid, 3, 1, 0x409)

        options = subset.Options()
        options.flavor = "woff2"
        options.layout_features = ["ccmp"]
        options.hinting = False
        options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
        options.notdef_outline = True
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=UNICODES)
        subsetter.subset(font)
        font.flavor = "woff2"
        font.save(out)
        print(f"{out.name}: {len(font.getGlyphOrder())} glyphs, {out.stat().st_size} bytes")


def jersey(path):
    """Pixel font on a 75-unit grid with 2-pixel strokes: draw on the grid."""
    p = Patch(path)
    u = 75

    def dot(pen, base, ox):
        x0, y0, x1, _ = p.bounds(base)
        x = x0 + math.floor(((x1 - x0) / u - 2) / 2) * u  # centred, snapped left
        top = min(y0, 0) - u  # one pixel of air under the letter
        p.rect(pen, ox + x, top - 2 * u, ox + x + 2 * u, top)

    def naira(pen):
        n = p.g("N")
        if pen is not None:
            x0, y0, x1, y1 = p.bounds(n)
            p.draw(pen, n, dx=u)
            for y in (y0 + 3 * u, y0 + 6 * u):  # one-pixel bars, a pixel past each stem
                p.rect(pen, x0, y, x1 + 2 * u, y + u)
        return p.advance(n) + 2 * u

    p.build(dot, None, naira)
    p.save(OUT / "pixel-patch.woff2", "Pixel Patch")


def gochi(path):
    """Handwriting: reuse the font's own period, accents and hyphen strokes."""
    p = Patch(path)
    period, hyphen = p.g("."), p.g("-")
    px0, py0, px1, py1 = p.bounds(period)

    def dot(pen, base, ox):
        x0, y0, x1, _ = p.bounds(base)
        top = min(y0, 0) - 90
        p.draw(pen, period, dx=ox + (x0 + x1) / 2 - (px0 + px1) / 2, dy=top - py1)

    def mark(pen, accent):
        # Where è / é place the accent over e, relative to the end of the e.
        e, toned = p.g("e"), p.g("è" if accent == "grave" else "é")
        comp = next(c for c in p.font["glyf"][toned].components if c.glyphName != e)
        p.draw(pen, comp.glyphName, dx=comp.x - p.advance(e), dy=comp.y)

    def naira(pen):
        n = p.g("N")
        if pen is not None:
            x0, y0, x1, y1 = p.bounds(n)
            hx0, hy0, hx1, hy1 = p.bounds(hyphen)
            p.draw(pen, n)
            sx, sy = (x1 - x0 + 160) / (hx1 - hx0), 90 / (hy1 - hy0)
            for t in (0.36, 0.66):
                yc = y0 + (y1 - y0) * t
                p.draw(pen, hyphen, dx=x0 - 80 - hx0 * sx, dy=yc - (hy0 + hy1) / 2 * sy, sx=sx, sy=sy)
        return p.advance(n)

    p.build(dot, mark, naira)
    p.save(OUT / "hand-patch.woff2", "Hand Patch")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    jersey(sys.argv[1])
    gochi(sys.argv[2])
