"""Article and project illustrations for the site, in the reference design's style.

Style rules: 800x450 cream panel with no outline of its own (the site draws the border,
rounded corners and offset shadow around it, so an outline here would show twice), the two hills and
the sun behind every scene, flat fills only, 3px ink outlines on props, Karla caps for labels,
Fraunces italic for speech bubbles. The shepherd and sheep are the reference homepage SVG's own
shapes, reused, never redrawn. One idea per scene, taken from the article itself.

Usage: add a scene to SCENES keyed "<collection>/<slug>", then run
    python3 site/tools/illustrations.py
Output goes to site/illustrations/<slug>.svg, which the article's front matter names in
`illustration:`. Colors are fixed (not theme variables) because the site loads these as <img>.
"""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "illustrations")
os.makedirs(OUT, exist_ok=True)

INK = "#1D2420"
CREAM = "#FBF8F1"
HILL1 = "#DCE3D2"
HILL2 = "#C4D1BA"
SUN = "#E8D6B8"
OCHRE = "#9A5B1E"
OCHRE_L = "#E0A965"
GREEN = "#3F5A3C"
RED = "#B23A2E"
PAPER = "#F3EEE3"

# Reference shepherd, feet at roughly (392, 520) in its own coordinates.
SHEPHERD = f"""
<path d="M470 520 V252 a24 24 0 0 0 -48 0 v8" stroke="#6B4423" stroke-width="7" stroke-linecap="round" fill="none"/>
<rect x="372" y="452" width="14" height="62" rx="6" fill="#6E4A33" stroke="{INK}" stroke-width="2.5"/>
<rect x="398" y="452" width="14" height="62" rx="6" fill="#6E4A33" stroke="{INK}" stroke-width="2.5"/>
<ellipse cx="378" cy="516" rx="15" ry="6" fill="#3B2A1E"/><ellipse cx="408" cy="516" rx="15" ry="6" fill="#3B2A1E"/>
<path d="M352 332 Q390 318 428 332 L446 464 Q390 476 334 464 Z" fill="{GREEN}" stroke="{INK}" stroke-width="3"/>
<path d="M354 334 L380 326 L442 442 L430 462 Z" fill="{RED}" stroke="{INK}" stroke-width="2.5"/>
<path d="M370 350 L388 343 M388 382 L407 374 M406 414 L425 406" stroke="#7A1F18" stroke-width="3"/>
<rect x="340" y="400" width="100" height="10" rx="4" fill="#C08A3E" stroke="{INK}" stroke-width="2.5"/>
<rect x="381" y="312" width="16" height="16" fill="#7A4A2E"/>
<circle cx="389" cy="286" r="34" fill="#7A4A2E" stroke="{INK}" stroke-width="3"/>
<circle cx="422" cy="291" r="6" fill="#7A4A2E" stroke="{INK}" stroke-width="2.5"/>
<path d="M356 282 Q356 248 389 248 Q423 248 423 282 Q413 262 389 262 Q365 262 356 282 Z" fill="#1D1A17"/>
<ellipse cx="377" cy="289" rx="6" ry="7" fill="#fff" stroke="{INK}" stroke-width="2.5"/>
<ellipse cx="399" cy="289" rx="6" ry="7" fill="#fff" stroke="{INK}" stroke-width="2.5"/>
<circle cx="374" cy="286" r="3" fill="{INK}"/><circle cx="396" cy="286" r="3" fill="{INK}"/>
<path d="M368 277 Q376 271 384 275 M392 271 Q400 264 408 270" stroke="{INK}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
<path d="M381 306 Q390 311 398 304" stroke="{INK}" stroke-width="3" stroke-linecap="round" fill="none"/>
<path d="M358 340 L343 374 L374 326" stroke="{GREEN}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<circle cx="378" cy="323" r="9" fill="#7A4A2E" stroke="{INK}" stroke-width="2.5"/>
<path d="M424 342 L446 374 L464 362" stroke="{GREEN}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<circle cx="469" cy="360" r="9" fill="#7A4A2E" stroke="{INK}" stroke-width="2.5"/>
"""


def sheep_body(wool="#fff", face="#2A2A2A"):
    # Reference sheep, feet at roughly (171, 520), facing left.
    return f"""
<g stroke="{INK}" stroke-width="3">
<line x1="150" y1="498" x2="150" y2="520" stroke-width="5" stroke-linecap="round"/>
<line x1="192" y1="498" x2="192" y2="520" stroke-width="5" stroke-linecap="round"/>
<circle cx="152" cy="476" r="20" fill="{wool}"/><circle cx="176" cy="464" r="22" fill="{wool}"/><circle cx="200" cy="476" r="20" fill="{wool}"/>
<circle cx="164" cy="492" r="17" fill="{wool}"/><circle cx="190" cy="492" r="17" fill="{wool}"/>
<ellipse cx="128" cy="480" rx="13" ry="15" fill="{face}"/>
<ellipse cx="118" cy="470" rx="7" ry="4" fill="{face}" transform="rotate(-25 118 470)"/>
</g>
<circle cx="124" cy="478" r="2.5" fill="#fff"/>
"""


def shepherd(x, y, s=1.0, flip=False):
    """Place the shepherd with his feet at (x, y)."""
    sx = -s if flip else s
    return f'<g transform="translate({x} {y}) scale({sx} {s}) translate(-392 -520)">{SHEPHERD}</g>'


def sheep(x, y, s=1.0, flip=False, wool="#fff", face="#2A2A2A", tag=None):
    sx = -s if flip else s
    t = ""
    mirror = ' transform="scale(-1 1)"' if flip else ""
    if tag:
        t = (f'<g transform="translate(176 452)"><rect x="-18" y="-14" width="36" height="22" rx="5" '
             f'fill="{OCHRE_L}" stroke="{INK}" stroke-width="2.5"/>'
             f'<text x="0" y="3" text-anchor="middle" font-family="Karla, Helvetica, Arial, sans-serif" '
             f'font-weight="700" font-size="13" fill="{INK}"'
             f'{mirror}>{tag}</text></g>')
    return f'<g transform="translate({x} {y}) scale({sx} {s}) translate(-171 -520)">{sheep_body(wool, face)}{t}</g>'


def bubble(x, y, w, h, text, size=20, tail="left"):
    tx = x + 24 if tail == "left" else x + w - 24
    return (f'<g><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2}" fill="#fff" stroke="{INK}" stroke-width="3"/>'
            f'<path d="M{tx-10} {y+h-2} L{tx-4 if tail=="left" else tx+4} {y+h+18} L{tx+10} {y+h-2}" fill="#fff" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
            f'<rect x="{tx-12}" y="{y+h-6}" width="24" height="6" fill="#fff"/>'
            f'<text x="{x+w/2}" y="{y+h/2+size*0.35}" text-anchor="middle" font-family="Fraunces, Georgia, serif" '
            f'font-style="italic" font-size="{size}" fill="{INK}">{text}</text></g>')


def label(x, y, text, size=14, fill=INK, anchor="middle", weight=700):
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="Karla, Helvetica, Arial, sans-serif" '
            f'font-weight="{weight}" font-size="{size}" fill="{fill}" letter-spacing="1">{text}</text>')


def frame(body, title, desc):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img" aria-labelledby="t d">
<title id="t">{title}</title>
<desc id="d">{desc}</desc>
<rect width="800" height="450" fill="{CREAM}"/>
<g>
<circle cx="700" cy="80" r="34" fill="{SUN}"/>
<path d="M0 300 C160 250 300 280 420 250 C540 220 660 240 800 210 V450 H0 Z" fill="{HILL1}"/>
<path d="M0 370 C180 335 330 365 470 340 C600 318 700 330 800 318 V450 H0 Z" fill="{HILL2}"/>
{body}
</g>
</svg>
"""


SCENES = {}

# knowing-vs-explaining: recognizing a diagram is not the same as drawing it yourself.
SCENES["philosophy/knowing-vs-explaining"] = (
    "Recognizing is not explaining",
    "The shepherd stands at an easel. A finished diagram is pinned on the left; the right half, where he has to draw it himself, is blank except for a question mark. A sheep watches.",
    f"""
<g transform="translate(250 90)">
<line x1="30" y1="250" x2="70" y2="40" stroke="#6B4423" stroke-width="6" stroke-linecap="round"/>
<line x1="270" y1="250" x2="230" y2="40" stroke="#6B4423" stroke-width="6" stroke-linecap="round"/>
<rect x="0" y="20" width="300" height="215" rx="8" fill="#fff" stroke="{INK}" stroke-width="3"/>
<line x1="150" y1="30" x2="150" y2="200" stroke="{INK}" stroke-width="2" stroke-dasharray="4 6"/>
<g stroke="{INK}" stroke-width="2.5" fill="{OCHRE_L}">
<circle cx="75" cy="60" r="14"/><circle cx="40" cy="130" r="14"/><circle cx="110" cy="130" r="14"/><circle cx="75" cy="170" r="10" fill="{HILL2}"/>
</g>
<path d="M68 72 L46 118 M82 72 L104 118 M46 142 L70 162 M104 142 L80 162" stroke="{INK}" stroke-width="2.5"/>
{label(75, 224, "SEEN IT", 12, OCHRE)}
<text x="225" y="130" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="72" fill="{OCHRE}">?</text>
{label(225, 224, "DRAW IT", 12, OCHRE)}
</g>
{shepherd(640, 420, 0.62, flip=True)}
{sheep(150, 425, 0.72, flip=True)}
{bubble(40, 200, 150, 50, "Why though?", 18)}
""",
)

# claim-versus-argument: a persuasive book on one side of a scale, the reasoning on the other.
SCENES["philosophy/claim-versus-argument"] = (
    "Weighing a claim against its argument",
    "An open book sits on one pan of a balance scale labelled claim; a small stack of numbered steps sits on the other, labelled argument. The shepherd studies the scale, hand on chin.",
    f"""
<g transform="translate(150 70)">
<rect x="175" y="290" width="70" height="16" rx="4" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="203" y="80" width="14" height="212" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<g transform="rotate(-7 210 90)">
<rect x="30" y="84" width="360" height="12" rx="6" fill="{OCHRE}" stroke="{INK}" stroke-width="3"/>
<path d="M60 96 L30 170 M60 96 L90 170 M360 96 L330 170 M360 96 L390 170" stroke="{INK}" stroke-width="2"/>
<path d="M20 170 H100 Q100 190 60 190 Q20 190 20 170 Z" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>
<path d="M320 170 H400 Q400 190 360 190 Q320 190 320 170 Z" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>
<path d="M22 168 Q41 128 60 150 Q79 128 98 168 Z" fill="#fff" stroke="{INK}" stroke-width="3"/>
<path d="M60 150 V168 M32 152 Q42 140 54 150 M66 150 Q78 140 88 152" stroke="{INK}" stroke-width="2" fill="none"/>
<g stroke="{INK}" stroke-width="2.5">
<rect x="336" y="156" width="48" height="12" rx="2" fill="{OCHRE_L}"/>
<rect x="342" y="144" width="36" height="12" rx="2" fill="{HILL2}"/>
<rect x="348" y="132" width="24" height="12" rx="2" fill="#fff"/>
</g>
{label(60, 216, "CLAIM", 13, OCHRE)}
{label(360, 216, "ARGUMENT", 13, OCHRE)}
</g>
<circle cx="210" cy="82" r="10" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
</g>
{shepherd(700, 430, 0.6)}
""",
)

# what-becomes-true-when-both-stay: two different sheep, both kept, neither chosen over the other.
SCENES["philosophy/what-becomes-true-when-both-stay"] = (
    "Both stay",
    "A white sheep and a dark sheep stand side by side inside the same small fold. The shepherd rests his crook over the gate between them rather than choosing one. A curtain hangs at the left edge of the scene.",
    f"""
<path d="M0 0 H70 Q60 120 78 240 Q60 330 70 450 H0 Z" fill="{RED}" stroke="{INK}" stroke-width="3"/>
<path d="M22 0 Q14 200 26 450 M46 0 Q38 200 50 450" stroke="#7A1F18" stroke-width="3" fill="none"/>
<g stroke="{INK}" stroke-width="3" fill="#C08A3E">
<rect x="150" y="300" width="12" height="110" rx="3"/><rect x="330" y="300" width="12" height="110" rx="3"/><rect x="510" y="300" width="12" height="110" rx="3"/>
<rect x="140" y="320" width="392" height="12" rx="4"/><rect x="140" y="365" width="392" height="12" rx="4"/>
</g>
{sheep(260, 360, 0.85, flip=True)}
{sheep(440, 360, 0.85, wool="#4A4540", face="#1D1A17")}
{shepherd(660, 425, 0.62, flip=True)}
{bubble(200, 90, 300, 58, "What if both are true?", 21)}
""",
)

# a-gap-worth-testing: a gap in the path; the shepherd measures it instead of guessing.
SCENES["journal/a-gap-worth-testing"] = (
    "Measuring the gap",
    "A path breaks off at a gap. The shepherd lays his staff across it to measure how wide it is. A sheep waits on the near side. Three small signs label possible causes: knowledge, retrieval, practice.",
    f"""
<path d="M0 380 H300 L310 450 H0 Z" fill="#C8B38E" stroke="{INK}" stroke-width="3"/>
<path d="M430 380 H800 V450 H420 Z" fill="#C8B38E" stroke="{INK}" stroke-width="3"/>
<path d="M300 380 L310 450 H420 L430 380" fill="{INK}" opacity=".85"/>
<line x1="270" y1="372" x2="470" y2="372" stroke="#6B4423" stroke-width="7" stroke-linecap="round"/>
<g stroke="{INK}" stroke-width="2"><line x1="310" y1="364" x2="310" y2="380"/><line x1="340" y1="366" x2="340" y2="378"/><line x1="370" y1="364" x2="370" y2="380"/><line x1="400" y1="366" x2="400" y2="378"/><line x1="430" y1="364" x2="430" y2="380"/></g>
{shepherd(200, 385, 0.6)}
{sheep(90, 385, 0.62, flip=True)}
<g transform="translate(470 110)">
{''.join(f'<g transform="translate(0 {i*62})"><rect x="0" y="0" width="190" height="44" rx="22" fill="#fff" stroke="{INK}" stroke-width="3"/>{label(95, 28, t, 15)}</g>' for i, t in enumerate(["KNOWLEDGE?", "RETRIEVAL?", "PRACTICE?"]))}
</g>
""",
)

# the-test-result: the answer was complete; the doubt arrived after it.
SCENES["journal/the-test-result"] = (
    "The answer held up",
    "A clipboard shows three ticked lines: problem, mechanism, tradeoff. A sheep stands beside it looking pleased. Above the shepherd, a thought bubble asks whether he lost them, and it is crossed out.",
    f"""
<g transform="translate(120 110)">
<rect x="0" y="0" width="230" height="280" rx="12" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="18" y="30" width="194" height="232" rx="6" fill="#fff" stroke="{INK}" stroke-width="3"/>
<rect x="80" y="-12" width="70" height="28" rx="8" fill="#8A8F89" stroke="{INK}" stroke-width="3"/>
{''.join(f'<g transform="translate(36 {70+i*62})"><rect x="0" y="-18" width="26" height="26" rx="5" fill="{HILL2}" stroke="{INK}" stroke-width="2.5"/><path d="M5 -5 L11 2 L22 -12" stroke="{GREEN}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>{label(42, 0, t, 15, INK, "start")}</g>' for i, t in enumerate(["PROBLEM", "MECHANISM", "TRADEOFF"]))}
</g>
{sheep(440, 420, 0.7, flip=True)}
{shepherd(640, 420, 0.62, flip=True)}
<g>
{bubble(470, 70, 230, 56, "Did I lose them?", 20, tail="right")}
<line x1="480" y1="126" x2="690" y2="70" stroke="{RED}" stroke-width="5" stroke-linecap="round"/>
</g>
""",
)

# settlement-engine: every settlement gets exactly one state, counted through the gate once.
SCENES["projects/settlement-engine"] = (
    "Counted once",
    "Sheep pass one at a time through a narrow gate into a ledger pen. Each carries a coin tag. The shepherd keeps a ledger book open with states listed: pending, confirmed, failed, unknown, reversed.",
    f"""
<g stroke="{INK}" stroke-width="3" fill="#C08A3E">
<rect x="330" y="250" width="14" height="170" rx="3"/><rect x="420" y="250" width="14" height="170" rx="3"/>
<rect x="330" y="244" width="104" height="12" rx="4"/>
</g>
{label(382, 236, "EXACTLY ONCE", 13, OCHRE)}
{sheep(250, 420, 0.62, tag="$", flip=True)}
{sheep(520, 420, 0.62, tag="$", flip=True)}
<g transform="translate(560 90)">
<rect x="0" y="0" width="200" height="200" rx="10" fill="#fff" stroke="{INK}" stroke-width="3"/>
<rect x="0" y="0" width="200" height="40" rx="10" fill="{GREEN}" stroke="{INK}" stroke-width="3"/>
{label(100, 26, "LEDGER", 15, CREAM)}
{''.join(f'<g transform="translate(20 {70+i*28})"><circle cx="0" cy="-5" r="6" fill="{c}" stroke="{INK}" stroke-width="2"/>{label(16, 0, t, 13, INK, "start")}</g>' for i, (t, c) in enumerate([("PENDING", "#fff"), ("CONFIRMED", HILL2), ("FAILED", RED), ("UNKNOWN", OCHRE_L), ("REVERSED", "#8A8F89")]))}
</g>
{shepherd(110, 425, 0.6)}
""",
)

# routine-machine: a fixed week board, the flock moving through it one column at a time.
SCENES["projects/routine-machine"] = (
    "A week on the board",
    "A board with columns for the days of the week, each holding small task cards. A line of sheep walks along the bottom of the board in order. The shepherd points at today's column.",
    f"""
<g transform="translate(60 60)">
<rect x="0" y="0" width="520" height="250" rx="12" fill="#fff" stroke="{INK}" stroke-width="3"/>
{''.join(f'<g transform="translate({14+i*72} 14)"><rect x="0" y="0" width="64" height="222" rx="8" fill="{OCHRE_L if i == 2 else PAPER}" stroke="{INK}" stroke-width="2.5"/>{label(32, 24, d, 13)}' + ''.join(f'<rect x="8" y="{38+j*40}" width="48" height="30" rx="5" fill="{["#fff", HILL2, "#fff"][j % 3]}" stroke="{INK}" stroke-width="2"/>' for j in range(3 if i < 5 else 2)) + '</g>' for i, d in enumerate(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]))}
</g>
{sheep(150, 420, 0.5, flip=True)}{sheep(250, 420, 0.5, flip=True)}{sheep(350, 420, 0.5, flip=True)}
{shepherd(680, 425, 0.62, flip=True)}
<path d="M600 330 Q450 360 252 302" stroke="{INK}" stroke-width="2.5" stroke-dasharray="3 8" fill="none" stroke-linecap="round"/>
""",
)

# umwayi: the journal at the center, four threads running out to the rest.
SCENES["projects/umwayi"] = (
    "The journal at the center",
    "An open journal sits in the middle of the field. Four paths run out from it to four small signposts: philosophy, tech, people, projects. The shepherd stands beside the journal.",
    f"""
<g stroke="{INK}" stroke-width="2.5" stroke-dasharray="3 9" stroke-linecap="round" fill="none">
<path d="M400 250 Q260 170 140 120"/><path d="M400 250 Q540 170 660 120"/>
<path d="M400 250 Q250 300 130 360"/><path d="M400 250 Q560 310 670 370"/>
</g>
{''.join(f'<g transform="translate({x} {y})"><rect x="-4" y="0" width="8" height="46" fill="#6B4423"/><rect x="-66" y="-30" width="132" height="36" rx="18" fill="#fff" stroke="{INK}" stroke-width="3"/>{label(0, -6, t, 13)}</g>' for x, y, t in [(140, 120, "PHILOSOPHY"), (660, 120, "TECH"), (130, 350, "PEOPLE"), (670, 355, "PROJECTS")])}
<g transform="translate(400 250)">
<path d="M-90 -40 Q-45 -60 0 -40 Q45 -60 90 -40 V40 Q45 20 0 40 Q-45 20 -90 40 Z" fill="#fff" stroke="{INK}" stroke-width="3"/>
<path d="M0 -40 V40" stroke="{INK}" stroke-width="3"/>
<path d="M-72 -20 H-18 M-72 -4 H-22 M-72 12 H-30 M18 -20 H72 M22 -4 H72" stroke="{OCHRE}" stroke-width="3" stroke-linecap="round"/>
</g>
{label(400, 318, "JOURNAL", 14, OCHRE)}
{shepherd(400, 446, 0.4)}
""",
)

# personal-website: the site itself, framed as a window onto the field.
SCENES["projects/personal-website"] = (
    "The site, from the inside",
    "A browser window floats over the field. Inside it the shepherd leans on his crook beside a small sheep, the same scene as the homepage, drawn smaller. A thought bubble reads: in public.",
    f"""
<g transform="translate(160 50)">
<rect x="6" y="6" width="480" height="330" rx="14" fill="{INK}"/>
<rect x="0" y="0" width="480" height="330" rx="14" fill="#fff" stroke="{INK}" stroke-width="3"/>
<path d="M0 44 H480" stroke="{INK}" stroke-width="3"/>
<circle cx="24" cy="22" r="7" fill="{RED}" stroke="{INK}" stroke-width="2"/><circle cx="46" cy="22" r="7" fill="{OCHRE_L}" stroke="{INK}" stroke-width="2"/><circle cx="68" cy="22" r="7" fill="{HILL2}" stroke="{INK}" stroke-width="2"/>
<rect x="96" y="10" width="340" height="24" rx="12" fill="{PAPER}" stroke="{INK}" stroke-width="2"/>
{label(266, 27, "amwayi", 13, INK)}
<clipPath id="win"><rect x="2" y="46" width="476" height="282" rx="12"/></clipPath>
<g clip-path="url(#win)">
<rect x="0" y="44" width="480" height="290" fill="{CREAM}"/>
<path d="M0 230 C120 200 260 220 480 180 V330 H0 Z" fill="{HILL1}"/>
<path d="M0 280 C150 255 300 275 480 255 V330 H0 Z" fill="{HILL2}"/>
{shepherd(320, 310, 0.5)}
{sheep(170, 310, 0.5)}
{bubble(60, 80, 180, 48, "In public.", 20, tail="right")}
</g>
</g>
""",
)



# idempotency-keys: the reference article's own scene. #42 has settled; a second #42 is stopped.
RAISED = SHEPHERD.replace(
    'd="M424 342 L446 374 L464 362"', 'd="M424 342 L452 322 L462 290"').replace(
    '<circle cx="469" cy="360" r="9"', '<circle cx="463" cy="282" r="11"')
RAISED = RAISED.replace('<path d="M470 520 V252 a24 24 0 0 0 -48 0 v8" stroke="#6B4423" stroke-width="7" stroke-linecap="round" fill="none"/>', '')


def shepherd_raised(x, y, s=1.0, flip=False):
    sx = -s if flip else s
    staff = f'<path d="M318 520 V252 a24 24 0 0 1 48 0 v8" stroke="#6B4423" stroke-width="7" stroke-linecap="round" fill="none"/>'
    return f'<g transform="translate({x} {y}) scale({sx} {s}) translate(-392 -520)">{staff}{RAISED}</g>'


SCENES["tech/idempotency-keys"] = (
    "The same sheep, twice",
    "Inside the pen, a sheep tagged 42 has already settled. Outside the open gate, a second sheep tagged 42 asks: me again? The shepherd stands in the gateway and holds up his hand to stop it.",
    f"""
{sheep(650, 400, 0.72, tag="42")}
<g stroke="{INK}" stroke-width="3" fill="#C08A3E">
<rect x="520" y="250" width="12" height="160" rx="3"/><rect x="760" y="250" width="12" height="160" rx="3"/>
<rect x="520" y="280" width="252" height="12" rx="4"/><rect x="520" y="330" width="252" height="12" rx="4"/>
<rect x="520" y="370" width="252" height="12" rx="4"/>
<rect x="400" y="250" width="12" height="160" rx="3"/>
<rect x="340" y="280" width="72" height="12" rx="4"/><rect x="340" y="330" width="72" height="12" rx="4"/><rect x="340" y="370" width="72" height="12" rx="4"/><rect x="336" y="250" width="12" height="160" rx="3"/>
</g>
{label(646, 236, "SETTLED", 14, GREEN)}
{sheep(150, 425, 0.72, flip=True, tag="42")}
{bubble(40, 220, 170, 52, "Me again?", 20)}
{shepherd_raised(470, 425, 0.62, flip=True)}
""",
)


# journals/bugs-found-by-running-it: every test ticked, and a bug crawls out of the running machine.
SCENES["journals/bugs-found-by-running-it"] = (
    "Green tests, live bug",
    "A clipboard shows every test ticked. Beside it a running machine, marked running, has a small bug crawling out of it. The shepherd watches the machine, not the clipboard.",
    f"""
<g transform="translate(90 120)">
<rect x="0" y="0" width="170" height="220" rx="10" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="14" y="26" width="142" height="180" rx="5" fill="#fff" stroke="{INK}" stroke-width="3"/>
<rect x="55" y="-10" width="60" height="24" rx="7" fill="#8A8F89" stroke="{INK}" stroke-width="3"/>
{label(85, 52, "TESTS", 13, OCHRE)}
{''.join(f'<g transform="translate(34 {82+i*36})"><rect x="0" y="-16" width="22" height="22" rx="4" fill="{HILL2}" stroke="{INK}" stroke-width="2.5"/><path d="M4 -5 L9 1 L18 -11" stroke="{GREEN}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="32" y="-10" width="{70-i*8}" height="8" rx="4" fill="{PAPER}" stroke="{INK}" stroke-width="1.5"/></g>' for i in range(4))}
</g>
<g transform="translate(330 160)">
<rect x="0" y="0" width="200" height="170" rx="12" fill="{GREEN}" stroke="{INK}" stroke-width="3"/>
<rect x="20" y="20" width="160" height="60" rx="6" fill="{INK}"/>
{label(100, 57, "RUNNING", 16, OCHRE_L)}
<circle cx="55" cy="122" r="22" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/><circle cx="55" cy="122" r="7" fill="{INK}"/>
<circle cx="120" cy="122" r="16" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/><circle cx="120" cy="122" r="5" fill="{INK}"/>
<rect x="150" y="110" width="30" height="40" rx="4" fill="{INK}"/>
<g transform="translate(196 150) rotate(20)">
<ellipse cx="0" cy="0" rx="16" ry="12" fill="{RED}" stroke="{INK}" stroke-width="3"/>
<path d="M0 -12 V12" stroke="{INK}" stroke-width="2.5"/>
<circle cx="16" cy="-2" r="6" fill="{INK}"/>
<path d="M-8 10 L-14 20 M0 12 L0 22 M8 10 L14 20 M-8 -10 L-14 -20 M8 -10 L14 -20" stroke="{INK}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="-6" cy="-4" r="2.5" fill="{INK}"/><circle cx="6" cy="4" r="2.5" fill="{INK}"/>
</g>
</g>
{shepherd(680, 425, 0.62, flip=True)}
""",
)

# journals/felt-before-understood: already on the path; the book lies back where it began.
SCENES["journals/felt-before-understood"] = (
    "Already on the path",
    "A winding path runs across the field. The shepherd and two sheep are already well along it. Back where the path began, an open book lies on the grass.",
    f"""
<path d="M40 430 C140 380 200 360 300 350 C420 338 520 330 780 300" stroke="#C8B38E" stroke-width="44" fill="none" stroke-linecap="round"/>
<path d="M40 430 C140 380 200 360 300 350 C420 338 520 330 780 300" stroke="{INK}" stroke-width="2" stroke-dasharray="3 10" fill="none" stroke-linecap="round"/>
<g transform="translate(130 330)">
<path d="M-60 -20 Q-30 -36 0 -20 Q30 -36 60 -20 V20 Q30 6 0 20 Q-30 6 -60 20 Z" fill="#fff" stroke="{INK}" stroke-width="3"/>
<path d="M0 -20 V20" stroke="{INK}" stroke-width="3"/>
<path d="M-48 -8 H-12 M-48 4 H-16 M12 -8 H48 M12 4 H44" stroke="{OCHRE}" stroke-width="3" stroke-linecap="round"/>
</g>
{label(130, 296, "THE WORDS, LATER", 12, OCHRE)}
{sheep(470, 355, 0.5, flip=True)}
{sheep(545, 348, 0.5, flip=True)}
{shepherd(660, 340, 0.55, flip=True)}
""",
)

# journals/eleven-laws: Chesterton's fence, standing alone in the field.
SCENES["journals/eleven-laws"] = (
    "Why is this fence here?",
    "A short fence stands alone in the open field, going nowhere. A sign on it asks why it is here. The shepherd studies it, hand on chin, before touching it.",
    f"""
<g stroke="{INK}" stroke-width="3" fill="#C08A3E">
<rect x="220" y="270" width="12" height="130" rx="3"/><rect x="340" y="270" width="12" height="130" rx="3"/><rect x="460" y="270" width="12" height="130" rx="3"/>
<rect x="210" y="295" width="272" height="12" rx="4"/><rect x="210" y="345" width="272" height="12" rx="4"/>
</g>
<g transform="translate(286 200)">
<rect x="-4" y="40" width="8" height="60" fill="#6B4423"/>
<rect x="-96" y="0" width="192" height="46" rx="8" fill="#fff" stroke="{INK}" stroke-width="3"/>
{label(0, 29, "WHY IS THIS HERE?", 15)}
</g>
{shepherd(640, 425, 0.62, flip=True)}
{sheep(110, 425, 0.6)}
""",
)

# journals/a-dead-dependency: one signpost crossed out, the flock takes the other.
SCENES["journals/a-dead-dependency"] = (
    "The other way",
    "Two signposts stand at a fork in the path. The left one is grey, cracked and crossed out with a red X. The sheep head down the right path under a freshly painted sign.",
    f"""
<path d="M400 450 L400 360 L200 240" stroke="#C8B38E" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M400 360 L620 250" stroke="#C8B38E" stroke-width="40" fill="none" stroke-linecap="round"/>
<g transform="translate(250 150)">
<rect x="-4" y="30" width="8" height="90" fill="#8A8F89"/>
<path d="M-80 0 H70 L90 22 L70 44 H-80 Z" fill="#B8B6AE" stroke="{INK}" stroke-width="3"/>
<path d="M-40 6 L-30 22 L-44 36" stroke="{INK}" stroke-width="2" fill="none"/>
{label(-5, 29, "ARCHIVED", 14, "#5B615B")}
<path d="M-70 -6 L80 50 M80 -6 L-70 50" stroke="{RED}" stroke-width="6" stroke-linecap="round"/>
</g>
<g transform="translate(560 140)">
<rect x="-4" y="30" width="8" height="90" fill="#6B4423"/>
<path d="M-70 0 H80 L100 22 L80 44 H-70 Z" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
{label(10, 29, "THIS WAY", 14)}
</g>
{sheep(640, 330, 0.5, flip=True)}
{sheep(560, 380, 0.55, flip=True)}
{shepherd(150, 440, 0.55)}
""",
)

# journals/not-senecas-line: checking the author tag with a magnifying glass.
SCENES["journals/not-senecas-line"] = (
    "Who said it?",
    "A long scroll hangs open with a quote on it. Its author tag reads Seneca, followed by a question mark. The shepherd stands beside it; a large magnifying glass hovers over the tag.",
    f"""
<g transform="translate(160 70)">
<rect x="0" y="20" width="320" height="250" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>
<rect x="-14" y="6" width="348" height="26" rx="13" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="-14" y="258" width="348" height="26" rx="13" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<text x="160" y="90" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="22" fill="{INK}">"Peace does not come</text>
<text x="160" y="120" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="22" fill="{INK}">to the man who refuses</text>
<text x="160" y="150" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="22" fill="{INK}">to declare war..."</text>
<rect x="150" y="190" width="150" height="40" rx="8" fill="#fff" stroke="{INK}" stroke-width="3"/>
{label(225, 216, "SENECA?", 16, RED)}
<circle cx="225" cy="210" r="52" fill="#fff" fill-opacity=".25" stroke="{INK}" stroke-width="6"/>
<path d="M262 247 L310 295" stroke="#6B4423" stroke-width="14" stroke-linecap="round"/>
</g>
{shepherd(640, 425, 0.62, flip=True)}
""",
)

# journals/three-questions-cold: two answers filled in, the third still a question mark.
SCENES["journals/three-questions-cold"] = (
    "The third question",
    "A board holds three numbered boxes: problem, mechanism, and what breaks. The first two have lines of writing in them. The third holds only a large question mark. A sheep looks up at it.",
    f"""
<g transform="translate(70 70)">
<rect x="0" y="0" width="520" height="250" rx="12" fill="{INK}" stroke="{INK}" stroke-width="3"/>
<rect x="10" y="10" width="500" height="230" rx="8" fill="#2E3732"/>
{''.join(f'<g transform="translate({26+i*164} 30)"><rect x="0" y="0" width="148" height="190" rx="8" fill="none" stroke="{CREAM}" stroke-width="2.5" stroke-dasharray="6 6"/><circle cx="24" cy="24" r="14" fill="{OCHRE_L}" stroke="{CREAM}" stroke-width="2"/><text x="24" y="30" text-anchor="middle" font-family="Karla, Helvetica, Arial, sans-serif" font-weight="700" font-size="15" fill="{INK}">{i+1}</text>{label(74, 70, t, 12, CREAM)}' + (''.join(f'<rect x="20" y="{92+j*20}" width="{108-j*14}" height="6" rx="3" fill="{CREAM}" opacity=".8"/>' for j in range(4)) if i < 2 else f'<text x="74" y="160" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="70" fill="{OCHRE_L}">?</text>') + '</g>' for i, t in enumerate(["PROBLEM", "MECHANISM", "WHAT BREAKS"]))}
<rect x="230" y="250" width="12" height="100" fill="#6B4423"/><rect x="278" y="250" width="12" height="100" fill="#6B4423"/>
</g>
{sheep(470, 425, 0.62, flip=True)}
{shepherd(690, 425, 0.6, flip=True)}
""",
)

# journals/looking-not-reading: a phone-width screen held against a ruler.
SCENES["journals/looking-not-reading"] = (
    "Measured, not assumed",
    "A phone-sized screen stands in the field showing the shepherd and a sheep. A ruler runs along its top edge, marked 375 pixels. The shepherd stands beside it, looking.",
    f"""
<g transform="translate(240 60)">
<rect x="6" y="6" width="200" height="340" rx="26" fill="{INK}"/>
<rect x="0" y="0" width="200" height="340" rx="26" fill="{INK}" stroke="{INK}" stroke-width="3"/>
<rect x="12" y="30" width="176" height="290" rx="8" fill="{CREAM}"/>
<rect x="76" y="12" width="48" height="8" rx="4" fill="#4A5650"/>
<g>
<path d="M12 230 C70 210 130 222 188 205 V320 H12 Z" fill="{HILL1}"/>
<path d="M12 270 C80 255 140 265 188 255 V320 H12 Z" fill="{HILL2}"/>
{shepherd(130, 300, 0.36)}
{sheep(60, 300, 0.35)}
</g>
</g>
<g transform="translate(240 20)">
<rect x="0" y="0" width="200" height="26" rx="3" fill="{OCHRE_L}" stroke="{INK}" stroke-width="2.5"/>
{''.join(f'<line x1="{x}" y1="0" x2="{x}" y2="{12 if x % 50 == 0 else 7}" stroke="{INK}" stroke-width="2"/>' for x in range(10, 200, 10))}
{label(100, 21, "375PX", 11)}
</g>
{shepherd(620, 425, 0.62, flip=True)}
""",
)

# outbox-and-ledger: a locked outbox sending word to Kafka; a ledger where the
# balance and the entries beneath it don't add up.
SCENES["tech/outbox-and-ledger"] = (
    "Sent, and checked",
    "A locked outbox holds a sealed letter until it's confirmed sent to Kafka. Beside it, an open ledger shows a bold balance above a column of entries that don't add up to it, with a red mismatch mark between them. The shepherd studies the ledger.",
    f"""
<g transform="translate(70 160)">
<rect x="0" y="60" width="160" height="110" rx="10" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="0" y="60" width="160" height="24" rx="8" fill="#B0793A" stroke="{INK}" stroke-width="3"/>
<rect x="64" y="50" width="32" height="30" rx="6" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
<circle cx="80" cy="65" r="6" fill="{INK}"/>
<rect x="26" y="98" width="108" height="60" rx="4" fill="#fff" stroke="{INK}" stroke-width="2.5"/>
<circle cx="80" cy="128" r="13" fill="{RED}" stroke="{INK}" stroke-width="2"/>
{label(80, 195, "OUTBOX", 13, OCHRE)}
</g>
<path d="M250 250 Q320 220 385 232" stroke="{INK}" stroke-width="3" fill="none" stroke-dasharray="7 7"/>
<path d="M378 224 L398 232 L378 242 Z" fill="{INK}"/>
{label(320, 200, "KAFKA", 12)}
<g transform="translate(420 90)">
<rect x="0" y="0" width="290" height="270" rx="10" fill="#fff" stroke="{INK}" stroke-width="3"/>
<line x1="0" y1="70" x2="290" y2="70" stroke="{INK}" stroke-width="2.5"/>
{label(145, 46, "BALANCE 500", 17, OCHRE)}
<g stroke="{INK}" stroke-width="3" fill="{HILL2}">
<rect x="30" y="100" width="230" height="10" rx="4"/><rect x="30" y="130" width="230" height="10" rx="4"/>
<rect x="30" y="160" width="230" height="10" rx="4"/>
</g>
{label(145, 92, "ENTRIES", 12, INK)}
<circle cx="145" cy="220" r="24" fill="#fff" stroke="{RED}" stroke-width="4"/>
<text x="145" y="230" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="30" fill="{RED}">&#8800;</text>
</g>
{shepherd(660, 420, 0.6, flip=True)}
{sheep(150, 425, 0.68, flip=True)}
""",
)

# a-mind-that-lies-to-you-too: the shepherd faces a mirror whose reflection
# holds its own staff and points back, unprompted.
SCENES["philosophy/a-mind-that-lies-to-you-too"] = (
    "The reflection points back",
    "The shepherd stands before a standing mirror, one hand raised in question. The reflection inside holds its own staff and points a finger back out at him, instead of mirroring the pose. A sheep watches from the side.",
    f"""
<g transform="translate(400 55)">
<path d="M40 0 Q0 0 0 80 V300 Q0 380 40 380 H210 Q250 380 250 300 V80 Q250 0 210 0 Z" fill="#E7E0D2" stroke="{INK}" stroke-width="4"/>
<path d="M56 20 Q26 20 26 84 V296 Q26 360 56 360 H194 Q224 360 224 296 V84 Q224 20 194 20 Z" fill="#D9E6E8" stroke="{INK}" stroke-width="3"/>
{shepherd(125, 355, 0.5)}
<path d="M96 260 L58 230" stroke="{INK}" stroke-width="6" stroke-linecap="round"/>
<circle cx="52" cy="225" r="7" fill="{INK}"/>
</g>
{shepherd(190, 425, 0.62, flip=True)}
{sheep(660, 425, 0.68)}
{bubble(60, 40, 220, 54, "Why so sure?", 19)}
""",
)



# more-copies-is-not-a-better-life: a tall bar of wheat copies beside a short bar of free hours.
SCENES["philosophy/more-copies-is-not-a-better-life"] = (
    "More copies is not a better life",
    "The shepherd stands before a wooden sign with two bars. The left bar, labelled copies, is tall and topped with wheat. The right bar, labelled free hours, is short. A sheep looks up at the taller bar.",
    f"""
<g transform="translate(250 60)">
<rect x="40" y="290" width="14" height="76" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="266" y="290" width="14" height="76" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="0" y="0" width="320" height="300" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
<line x1="30" y1="250" x2="290" y2="250" stroke="{INK}" stroke-width="3"/>
<rect x="64" y="60" width="80" height="190" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
<rect x="186" y="190" width="80" height="60" fill="{HILL2}" stroke="{INK}" stroke-width="3"/>
<g stroke="{INK}" stroke-width="2.5" stroke-linecap="round" fill="none">
<path d="M84 60 V26 M104 60 V16 M124 60 V28"/>
<path d="M84 44 L76 36 M84 36 L92 28 M104 34 L96 26 M104 26 L112 18 M124 46 L116 38 M124 38 L132 30"/>
</g>
<g fill="{OCHRE_L}" stroke="{INK}" stroke-width="2">
<ellipse cx="84" cy="22" rx="5" ry="9"/><ellipse cx="104" cy="12" rx="5" ry="9"/><ellipse cx="124" cy="24" rx="5" ry="9"/>
<ellipse cx="73" cy="36" rx="4" ry="7" transform="rotate(-35 73 36)"/><ellipse cx="95" cy="26" rx="4" ry="7" transform="rotate(35 95 26)"/>
<ellipse cx="115" cy="16" rx="4" ry="7" transform="rotate(35 115 16)"/><ellipse cx="135" cy="28" rx="4" ry="7" transform="rotate(35 135 28)"/>
</g>
{label(104, 276, "COPIES", 13, OCHRE)}
{label(226, 276, "FREE HOURS", 13, OCHRE)}
</g>
{shepherd(640, 425, 0.62, flip=True)}
{sheep(160, 425, 0.72)}
{bubble(40, 70, 200, 54, "Which one counts?", 19)}
""",
)

# what-the-reconciler-cant-see: a lantern lights the sheep that carry a reference; the rest stand in the dark.
SCENES["tech/what-the-reconciler-cant-see"] = (
    "What the reconciler cannot see",
    "The shepherd holds a lantern whose light covers three sheep wearing REF tags. Two sheep stand just outside the light, tagged with question marks, and the shepherd does not see them.",
    f"""
<path d="M560 330 L215 255 L215 450 L560 450 Z" fill="#FFF3C9" opacity=".75"/>
<path d="M560 330 L215 255 L215 450 L560 450 Z" fill="none" stroke="{OCHRE_L}" stroke-width="2" stroke-dasharray="6 8"/>
<rect x="0" y="0" width="215" height="450" fill="{INK}" opacity=".18"/>
{sheep(290, 425, 0.62, flip=True, tag="REF")}
{sheep(395, 425, 0.62, flip=True, tag="REF")}
{sheep(500, 425, 0.62, flip=True, tag="REF")}
<g opacity=".8">
{sheep(60, 425, 0.62, flip=True, wool="#8E8A82", face="#4A4540", tag="?")}
{sheep(160, 425, 0.62, flip=True, wool="#8E8A82", face="#4A4540", tag="?")}
</g>
{shepherd(690, 425, 0.68, flip=True)}
<line x1="636" y1="316" x2="566" y2="338" stroke="#6B4423" stroke-width="5" stroke-linecap="round"/>
<rect x="540" y="326" width="26" height="34" rx="5" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
{bubble(300, 60, 240, 56, "Only what has a ref", 19)}
""",
)


# a-convenience-is-hard-to-give-back: a one-way sign, and callers stacked up on the far side.
SCENES["philosophy/a-convenience-is-hard-to-give-back"] = (
    "A convenience is hard to give back",
    "The shepherd stands at a one-way sign with an arrow. Past it, a stack of crates labelled callers stands beside a sheep. The shepherd asks if he can take the retry back.",
    f"""
<g transform="translate(330 70)">
<rect x="96" y="150" width="14" height="150" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="0" y="40" width="206" height="110" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
<path d="M28 95 H150 M150 95 L128 72 M150 95 L128 118" fill="none" stroke="{INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
{label(103, 140, "ONE WAY", 13, OCHRE)}
</g>
<g transform="translate(520 270)">
<rect x="0" y="80" width="120" height="76" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
<rect x="124" y="80" width="120" height="76" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
<rect x="62" y="4" width="120" height="76" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
{label(60, 124, "CALLERS", 12, INK)}
{label(184, 124, "CALLERS", 12, INK)}
{label(122, 48, "CALLERS", 12, INK)}
</g>
{shepherd(150, 425, 0.62)}
{sheep(455, 425, 0.62, flip=True)}
{bubble(40, 70, 230, 54, "Can we take the retry back?", 18)}
""",
)


# you-cannot-stop-what-arrives: a status board with three states; only the honest one is marked.
SCENES["philosophy/you-cannot-stop-what-arrives"] = (
    "You cannot stop what arrives",
    "A wooden status board lists three states: confirmed, failed and unknown. Only the unknown row is filled in and ticked. A sheep tagged with a question mark waits on the left, and the shepherd stands on the right.",
    f"""
<g transform="translate(250 70)">
<rect x="40" y="220" width="14" height="76" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="246" y="220" width="14" height="76" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="0" y="0" width="300" height="230" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
<rect x="24" y="22" width="252" height="54" rx="6" fill="none" stroke="{INK}" stroke-width="3"/>
<rect x="24" y="88" width="252" height="54" rx="6" fill="none" stroke="{INK}" stroke-width="3"/>
<rect x="24" y="154" width="252" height="54" rx="6" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
{label(150, 56, "CONFIRMED", 15, INK)}
{label(150, 122, "FAILED", 15, INK)}
{label(150, 188, "UNKNOWN", 15, INK)}
<path d="M236 180 L246 192 L264 168" fill="none" stroke="{INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</g>
{shepherd(650, 425, 0.62, flip=True)}
{sheep(150, 425, 0.72, tag="?")}
{bubble(30, 70, 200, 54, "Unknown, for now.", 19)}
""",
)


# stay-close-behind-the-code: the shepherd stops the work to check that two numbers agree.
SCENES["philosophy/stay-close-behind-the-code"] = (
    "Stay close behind the code",
    "A sheep tagged code waits at a gate. The shepherd holds up a hand beside a board that reads stored 120.00, ledger 120.00 and a tick. A speech bubble says check first.",
    f"""
<g transform="translate(470 70)">
<rect x="40" y="200" width="14" height="96" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="206" y="200" width="14" height="96" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="0" y="0" width="260" height="210" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
<rect x="20" y="20" width="220" height="48" rx="6" fill="none" stroke="{INK}" stroke-width="3"/>
<rect x="20" y="80" width="220" height="48" rx="6" fill="none" stroke="{INK}" stroke-width="3"/>
<rect x="20" y="140" width="220" height="48" rx="6" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
{label(130, 50, "STORED  120.00", 15, INK)}
{label(130, 110, "LEDGER  120.00", 15, INK)}
{label(104, 170, "MATCH", 15, INK)}
<path d="M178 166 L188 178 L206 154" fill="none" stroke="{INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</g>
{shepherd_raised(390, 425, 0.62, flip=True)}
{sheep(130, 425, 0.72, tag="CODE")}
{bubble(240, 150, 170, 54, "Check first.", 22, tail="right")}
""",
)


# my-first-agentic-system-is-a-folder: an agent reads the first file on the board before it works.
SCENES["tech/my-first-agentic-system-is-a-folder"] = (
    "My first agentic system is a folder",
    "A board lists three files: master context, sync log and backlog. The first is highlighted. A sheep tagged AI waits on the left and the shepherd on the right says read first.",
    f"""
<g transform="translate(250 70)">
<rect x="40" y="220" width="14" height="76" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="246" y="220" width="14" height="76" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="0" y="0" width="300" height="230" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
<rect x="24" y="22" width="252" height="54" rx="6" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
<rect x="24" y="88" width="252" height="54" rx="6" fill="none" stroke="{INK}" stroke-width="3"/>
<rect x="24" y="154" width="252" height="54" rx="6" fill="none" stroke="{INK}" stroke-width="3"/>
{label(150, 56, "MASTER CONTEXT", 15, INK)}
{label(150, 122, "SYNC LOG", 15, INK)}
{label(150, 188, "BACKLOG", 15, INK)}
</g>
{shepherd_raised(650, 425, 0.62, flip=True)}
{sheep(150, 425, 0.72, tag="AI")}
{bubble(580, 90, 170, 54, "Read first.", 22, tail="right")}
""",
)



# a-folder-is-not-a-brain-until-you-measure-it: the board has core, archive and test rows; the test row is lit.
SCENES["tech/a-folder-is-not-a-brain-until-you-measure-it"] = (
    "A folder is not a brain until you measure it",
    "A board lists three rows: core, archive and test. The test row is highlighted. A sheep tagged AI waits on the left and the shepherd on the right says measure it.",
    f"""
<g transform="translate(250 70)">
<rect x="40" y="220" width="14" height="76" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="246" y="220" width="14" height="76" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="0" y="0" width="300" height="230" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
<rect x="24" y="22" width="252" height="54" rx="6" fill="none" stroke="{INK}" stroke-width="3"/>
<rect x="24" y="88" width="252" height="54" rx="6" fill="none" stroke="{INK}" stroke-width="3"/>
<rect x="24" y="154" width="252" height="54" rx="6" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
{label(150, 56, "CORE", 15, INK)}
{label(150, 122, "ARCHIVE", 15, INK)}
{label(150, 188, "TEST", 15, INK)}
</g>
{shepherd_raised(650, 425, 0.62, flip=True)}
{sheep(150, 425, 0.72, tag="AI")}
{bubble(560, 90, 190, 54, "Measure it.", 22, tail="right")}
""",
)

# come-with-a-question-not-a-verdict: a crossed-out verdict on the grass; the shepherd asks instead.
SCENES["philosophy/come-with-a-question-not-a-verdict"] = (
    "Ask before you judge",
    "A paper marked verdict lies crossed out on the grass. The shepherd asks a sheep what it saw instead.",
    f"""
<g transform="translate(70 300) rotate(-6)">
<rect x="0" y="0" width="150" height="96" rx="6" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
{label(75, 40, "VERDICT", 17, INK)}
<path d="M10 10 L140 86 M140 10 L10 86" stroke="{RED}" stroke-width="6"/>
</g>
{sheep(330, 425, 0.78)}
{shepherd(560, 425, 0.62, flip=True)}
{bubble(430, 80, 300, 58, "What did you see?", 22, tail="right")}
""",
)

# who-the-standards-serve: a standard on a tall post that stays out of reach.
SCENES["philosophy/who-the-standards-serve"] = (
    "A standard out of reach",
    "Three sheep walk toward a flag marked standard on a tall post. The post stays far ahead. The shepherd asks who it is for.",
    f"""
<rect x="660" y="90" width="12" height="260" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<path d="M672 96 H760 V140 H672 Z" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
{label(716, 125, "STANDARD", 12, INK)}
{sheep(200, 400, 0.6)}
{sheep(320, 400, 0.6)}
{sheep(440, 400, 0.6)}
{shepherd(90, 425, 0.62)}
{bubble(40, 70, 300, 58, "Who is this for?", 22, tail="left")}
""",
)

# appearance-versus-reality: a count board versus a sheep actually through the gate.
SCENES["philosophy/appearance-versus-reality"] = (
    "Counted, or solved",
    "A board shows a large commit count. Beside it a sheep passes through a gate marked solved. The shepherd points at the gate.",
    f"""
<g transform="translate(60 120)">
<rect x="20" y="170" width="14" height="70" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="166" y="170" width="14" height="70" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="0" y="0" width="200" height="180" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
{label(100, 50, "COMMITS", 15, INK)}
{label(100, 120, "128", 52, INK)}
</g>
<g stroke="{INK}" stroke-width="3" fill="#C08A3E">
<rect x="400" y="290" width="12" height="120" rx="3"/><rect x="520" y="290" width="12" height="120" rx="3"/>
<rect x="394" y="270" width="144" height="18" rx="4"/>
</g>
{label(466, 262, "SOLVED", 15, INK)}
{sheep(466, 420, 0.7)}
{shepherd(690, 425, 0.62, flip=True)}
{bubble(500, 70, 270, 58, "Count what got solved.", 20, tail="right")}
""",
)


# one-mind-or-many: a fence splits a flock; a few sheep stand at the gap; the shepherd asks.
SCENES["philosophy/one-mind-or-many"] = (
    "One flock or two",
    "A fence splits a flock into two groups. A few sheep stand at the gap. The shepherd asks whether the fence should stay.",
    f"""
<rect x="396" y="250" width="12" height="170" rx="3" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
<rect x="392" y="250" width="20" height="16" rx="3" fill="#C08A3E" stroke="{INK}" stroke-width="3"/>
{sheep(150, 410, 0.55)}
{sheep(270, 410, 0.55)}
{sheep(530, 410, 0.55, flip=True)}
{sheep(650, 410, 0.55, flip=True)}
{sheep(402, 440, 0.5)}
{shepherd(740, 425, 0.6, flip=True)}
{bubble(430, 70, 300, 58, "Should the fence stay?", 22, tail="right")}
""",
)


# a-flaky-test-showed-a-real-bug: a test that sometimes fails points at a gap between two logbook steps.
SCENES["tech/a-flaky-test-showed-a-real-bug"] = (
    "Sometimes red",
    "A clipboard shows a test that is sometimes red and sometimes green, with a small bug beside it. Next to it a logbook sits open with two lines, intent and record, and a gap between them where a sheep stands. The shepherd says it is not a test problem.",
    f"""
<g transform="translate(120 120)">
<rect x="0" y="0" width="190" height="200" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
{label(95, 42, "THE TEST", 15, INK)}
<path d="M30 80 l16 16 l30 -34" stroke="{GREEN}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30 140 l36 36 M66 140 l-36 36" stroke="{RED}" stroke-width="7" fill="none" stroke-linecap="round"/>
{label(125, 100, "green", 15, INK)}
{label(125, 164, "red", 15, INK)}
</g>
<ellipse cx="344" cy="300" rx="12" ry="8" fill="{INK}"/>
<path d="M334 296 l-10 -8 M334 302 l-12 2 M354 296 l10 -8 M354 302 l12 2" stroke="{INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
<g transform="translate(430 250)">
<rect x="0" y="0" width="250" height="150" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
<path d="M125 0 V150" stroke="{INK}" stroke-width="2.5"/>
{label(62, 36, "INTENT", 15, INK)}
{label(188, 36, "RECORD", 15, INK)}
<path d="M24 60 H100 M24 80 H100 M150 60 H226" stroke="{OCHRE}" stroke-width="4" stroke-linecap="round"/>
</g>
{sheep(372, 424, 0.5)}
{shepherd(740, 425, 0.6, flip=True)}
{bubble(430, 70, 330, 58, "Not a test problem.", 22, tail="right")}
""",
)

# building-a-landing-page-on-founding-dev: a browser window with the page, and a note of what was not checked.
SCENES["tech/building-a-landing-page-on-founding-dev"] = (
    "Look at it yourself",
    "A browser window shows a small hill scene with three gate lamps. Beside it a note card lists what was not checked: phone at night, tablet width. The shepherd says to look at it yourself.",
    f"""
<g transform="translate(110 110)">
<rect x="0" y="0" width="330" height="230" rx="10" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
<path d="M0 36 H330" stroke="{INK}" stroke-width="3"/>
<circle cx="20" cy="18" r="5" fill="{RED}"/><circle cx="38" cy="18" r="5" fill="{OCHRE_L}"/><circle cx="56" cy="18" r="5" fill="{GREEN}"/>
<path d="M12 200 Q110 120 200 170 Q270 140 318 190 V218 Q318 222 314 222 H16 Q12 222 12 218 Z" fill="{HILL2}" stroke="{INK}" stroke-width="2.5"/>
<circle cx="60" cy="100" r="9" fill="{GREEN}" stroke="{INK}" stroke-width="2.5"/>
<circle cx="165" cy="100" r="9" fill="{RED}" stroke="{INK}" stroke-width="2.5"/>
<circle cx="270" cy="100" r="9" fill="{OCHRE_L}" stroke="{INK}" stroke-width="2.5"/>
{label(60, 128, "Yes", 12, INK)}
{label(165, 128, "No", 12, INK)}
{label(270, 128, "Ask me first", 12, INK)}
</g>
<g transform="translate(480 150)">
<rect x="0" y="0" width="190" height="150" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
{label(95, 36, "NOT CHECKED", 15, INK)}
<path d="M24 62 H166 M24 92 H166" stroke="{OCHRE}" stroke-width="4" stroke-linecap="round"/>
{label(95, 82, "phone at night", 13, INK, "middle", 400)}
{label(95, 112, "tablet width", 13, INK, "middle", 400)}
</g>
{sheep(450, 440, 0.5)}
{shepherd(740, 425, 0.6, flip=True)}
{bubble(430, 50, 330, 58, "Look at it yourself.", 22, tail="right")}
""",
)


# the-ci-wait-halved: one long bar of waiting against three short bars side by side.
SCENES["tech/the-ci-wait-halved"] = (
    "Same tests, half the wait",
    "Two rows of bars. The top row is one long bar labelled one job, 25 minutes. The bottom row is three short bars side by side labelled three shards, about 10 minutes. The shepherd says same tests, half the wait.",
    f"""
{label(110, 128, "BEFORE", 15, INK, "start")}
<rect x="110" y="140" width="520" height="40" rx="8" fill="{RED}" stroke="{INK}" stroke-width="3"/>
{label(370, 166, "ONE JOB  25 MIN", 15, "#fff")}
{label(110, 238, "AFTER", 15, INK, "start")}
<rect x="110" y="250" width="208" height="40" rx="8" fill="{GREEN}" stroke="{INK}" stroke-width="3"/>
<rect x="110" y="298" width="208" height="40" rx="8" fill="{GREEN}" stroke="{INK}" stroke-width="3"/>
<rect x="110" y="346" width="208" height="40" rx="8" fill="{GREEN}" stroke="{INK}" stroke-width="3"/>
{label(214, 276, "SHARD 1", 14, "#fff")}
{label(214, 324, "SHARD 2", 14, "#fff")}
{label(214, 372, "SHARD 3", 14, "#fff")}
<path d="M318 270 H338 M318 318 H338 M318 366 H338" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>
<path d="M338 270 V366" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>
<g transform="translate(368 296)">
<rect x="0" y="0" width="230" height="46" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>
{label(115, 29, "ALL TESTS RAN?", 14, INK)}
</g>
<path d="M338 318 H368" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>
{sheep(640, 432, 0.5)}
{shepherd(740, 425, 0.6, flip=True)}
{bubble(430, 50, 330, 58, "Same tests. Half the wait.", 22, tail="right")}
""",
)


# ---- batch: articles on the parts of umwayi-os (Nov 13) ----
def _box(x, y, w, h, text, fill=PAPER, size=14, tc=INK, rx=8):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{INK}" stroke-width="3"/>'
            + label(x + w / 2, y + h / 2 + 5, text, size, tc))


def _arrow(x1, y1, x2, y2):
    return (f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{INK}" stroke-width="3" stroke-linecap="round" fill="none"/>'
            f'<circle cx="{x2}" cy="{y2}" r="4" fill="{INK}"/>')


# yes-no-or-ask-me-first: three doors, the sheep at the third.
SCENES["tech/yes-no-or-ask-me-first"] = (
    "Yes, No or Ask me first",
    "Three doors in a row. The left door is green and says yes, the middle door is red and says no, the right door is ochre and says ask me first. A sheep stands at the right door. The shepherd says if unsure, ask.",
    f"""
<g stroke="{INK}" stroke-width="3">
<rect x="90" y="150" width="140" height="210" rx="10" fill="{GREEN}"/>
<rect x="270" y="150" width="140" height="210" rx="10" fill="{RED}"/>
<rect x="450" y="150" width="140" height="210" rx="10" fill="{OCHRE_L}"/>
</g>
{label(160, 270, "YES", 24, "#fff")}
{label(340, 270, "NO", 24, "#fff")}
{label(520, 256, "ASK", 22, INK)}
{label(520, 284, "ME FIRST", 16, INK)}
{label(160, 392, "EXIT 0", 14)}
{label(340, 392, "EXIT 2", 14)}
{label(520, 392, "EXIT 3", 14)}
{sheep(520, 440, 0.45)}
{shepherd(740, 425, 0.6, flip=True)}
{bubble(440, 60, 320, 58, "If unsure, ask.", 22, tail="right")}
""",
)

# a-logbook-that-shows-when-it-was-edited: a chain of blocks, one cracked.
SCENES["tech/a-logbook-that-shows-when-it-was-edited"] = (
    "An edit breaks the chain",
    "A row of four linked blocks, each holding a fingerprint of the one before it. The third block is cracked and a sheep stands on it. The shepherd says an edit breaks the chain.",
    f"""
{label(110, 128, "LOGBOOK  ENTRIES", 15, INK, "start")}
{_box(100, 160, 120, 70, "ENTRY 1", PAPER)}
{_box(250, 160, 120, 70, "ENTRY 2", PAPER)}
{_box(400, 160, 120, 70, "ENTRY 3", OCHRE_L)}
{_box(550, 160, 120, 70, "ENTRY 4", PAPER)}
<path d="M220 195 H250 M370 195 H400 M520 195 H550" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
<path d="M395 195 l14 -22 l-6 20 l14 4 l-12 22" stroke="{RED}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
{label(160, 262, "HASH", 13)}
{label(310, 262, "HASH + 1", 13)}
{label(460, 262, "HASH + 2", 13)}
{label(610, 262, "HASH + 3", 13)}
{_box(250, 300, 270, 44, "VERIFY: BROKEN AT ENTRY 3", "#fff", 14, RED)}
{sheep(460, 160, 0.42)}
{shepherd(740, 425, 0.6, flip=True)}
{bubble(110, 370, 330, 58, "An edit breaks the chain.", 22, tail="left")}
""",
)

# reserve-before-you-spend: a day bar with the reservation, then the settled spend; unknown drawn full size.
SCENES["tech/reserve-before-you-spend"] = (
    "Reserve before you spend",
    "A bar for the day's limit. In the top row a block labelled reserved fills part of the bar before a run begins. In the second row a smaller block labelled spent replaces it. In the third row a block labelled unknown is drawn at full size. The shepherd says unknown counts as the worst case.",
    f"""
{label(110, 120, "DAY LIMIT", 14, INK, "start")}
<rect x="110" y="130" width="560" height="26" rx="6" fill="#fff" stroke="{INK}" stroke-width="3"/>
{label(110, 192, "BEFORE THE RUN: RESERVE THE CAP", 14, INK, "start")}
<rect x="110" y="202" width="560" height="34" rx="6" fill="#fff" stroke="{INK}" stroke-width="3"/>
<rect x="110" y="202" width="200" height="34" rx="6" fill="{OCHRE_L}" stroke="{INK}" stroke-width="3"/>
{label(210, 225, "RESERVED", 14)}
{label(110, 272, "AFTER THE RUN: SETTLE WHAT WAS USED", 14, INK, "start")}
<rect x="110" y="282" width="560" height="34" rx="6" fill="#fff" stroke="{INK}" stroke-width="3"/>
<rect x="110" y="282" width="90" height="34" rx="6" fill="{GREEN}" stroke="{INK}" stroke-width="3"/>
{label(155, 305, "SPENT", 14, "#fff")}
{label(110, 352, "IF NOBODY REPORTS: UNKNOWN", 14, INK, "start")}
<rect x="110" y="362" width="560" height="34" rx="6" fill="#fff" stroke="{INK}" stroke-width="3"/>
<rect x="110" y="362" width="200" height="34" rx="6" fill="{RED}" stroke="{INK}" stroke-width="3"/>
{label(210, 385, "WORST CASE", 14, "#fff")}
{sheep(690, 440, 0.45)}
{shepherd(765, 425, 0.55, flip=True)}
{bubble(440, 40, 330, 58, "Unknown is the worst case.", 22, tail="right")}
""",
)

# one-task-one-worktree: three task folders with branches, the owner's copy apart.
SCENES["tech/one-task-one-worktree"] = (
    "One task, one folder",
    "Three separate folders side by side, each with its own branch label and a sheep standing in it. A fourth folder drawn with a dashed line and labelled the owner's copy stands apart with no sheep. The shepherd says each task gets its own folder.",
    f"""
{_box(90, 170, 150, 130, "", PAPER)}
{_box(260, 170, 150, 130, "", PAPER)}
{_box(430, 170, 150, 130, "", PAPER)}
{label(165, 160, "TASK 1", 14)}{label(335, 160, "TASK 2", 14)}{label(505, 160, "TASK 3", 14)}
{label(165, 326, "BRANCH g-7-t-01", 12)}{label(335, 326, "BRANCH g-7-t-02", 12)}{label(505, 326, "BRANCH g-7-t-03", 12)}
{sheep(165, 296, 0.38)}{sheep(335, 296, 0.38)}{sheep(505, 296, 0.38)}
<rect x="610" y="170" width="150" height="130" rx="8" fill="none" stroke="{INK}" stroke-width="3" stroke-dasharray="9 7"/>
{label(685, 160, "OWNER'S COPY", 14)}
{label(685, 242, "NEVER TOUCHED", 12)}
{shepherd(745, 432, 0.45, flip=True)}
{bubble(120, 60, 360, 58, "Each task gets its own folder.", 22, tail="left")}
""",
)

# advice-goes-stale-unless-you-pin-it: a rule card pinned to a source line; the hash no longer matches.
SCENES["tech/advice-goes-stale-unless-you-pin-it"] = (
    "Pinned to its source",
    "A source page with one edited line and a rule card pinned to it by a hash tag. The tag no longer matches and a stop sign sits beside it. A sheep reads the card. The shepherd says if the source changes, stop and ask.",
    f"""
<rect x="110" y="120" width="250" height="270" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
{label(235, 150, "SOURCE", 14)}
<path d="M135 180 H335 M135 205 H335 M135 255 H335 M135 280 H300" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
<path d="M135 230 H335" stroke="{RED}" stroke-width="6" stroke-linecap="round"/>
{label(235, 360, "ONE LINE EDITED", 13, RED)}
<path d="M360 230 H430" stroke="{INK}" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>
{_box(430, 180, 170, 100, "", OCHRE_L)}
{label(515, 214, "RULE CARD", 14)}
{label(515, 240, "HASH  4acf14", 13)}
{label(515, 262, "SAYS: MATCH", 13)}
<g transform="translate(675 230)">
<polygon points="-26,-62 26,-62 62,-26 62,26 26,62 -26,62 -62,26 -62,-26" fill="{RED}" stroke="{INK}" stroke-width="4" transform="scale(0.8)"/>
{label(0, 6, "STOP", 18, "#fff")}
</g>
{label(635, 300, "HASH DIFFERS", 13)}
{sheep(500, 410, 0.45)}
{shepherd(750, 430, 0.5, flip=True)}
{bubble(120, 40, 440, 58, "Source changed. Stop and ask.", 22, tail="left")}
""",
)

# one-gate-three-tools: three tools into one gate.
SCENES["tech/one-gate-three-tools"] = (
    "One gate, three tools",
    "One gate in the centre with three paths leading to it from the left, labelled Claude Code, Kiro and OpenCode. Past the gate a single path continues. A sheep waits at the gate. The shepherd says same rules, every tool.",
    f"""
{_box(90, 130, 170, 50, "CLAUDE CODE")}
{_box(90, 215, 170, 50, "KIRO")}
{_box(90, 300, 170, 50, "OPENCODE")}
<path d="M260 155 L380 225 M260 240 H380 M260 325 L380 255" stroke="{INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
<g stroke="{INK}" stroke-width="4">
<rect x="380" y="150" width="22" height="200" rx="6" fill="{OCHRE_L}"/>
<rect x="440" y="150" width="22" height="200" rx="6" fill="{OCHRE_L}"/>
<path d="M380 175 H462 M380 325 H462" stroke-width="6"/>
</g>
{label(421, 135, "ONE GATE", 14)}
{label(421, 380, "umwayi check", 13)}
<path d="M462 240 H600" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>
{_box(590, 215, 165, 50, "ALLOW OR STOP", PAPER, 13)}
{sheep(350, 420, 0.4)}
{shepherd(750, 430, 0.5, flip=True)}
{bubble(120, 40, 360, 58, "Same rules. Every tool.", 22, tail="left")}
""",
)

# two-pull-requests-never-edit-the-same-line: two part files into one built file.
SCENES["tech/two-pull-requests-never-edit-the-same-line"] = (
    "Each task writes its own file",
    "Two small part files on the left, one from each task, flowing into a single wide file labelled built log on the right through a builder box. A sheep stands on each part file. The shepherd says each task writes its own file.",
    f"""
{_box(90, 140, 190, 56, "PART: TASK A", PAPER)}
{_box(90, 250, 190, 56, "PART: TASK B", OCHRE_L)}
{sheep(120, 140, 0.34)}{sheep(120, 250, 0.34)}
<path d="M280 168 L350 215 M280 278 L350 240" stroke="{INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
{_box(350, 190, 130, 70, "BUILD", "#fff")}
<path d="M480 225 H540" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>
<rect x="540" y="150" width="190" height="150" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>
{label(635, 178, "BUILT LOG", 14)}
<path d="M560 205 H710 M560 228 H710 M560 251 H710 M560 274 H680" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>
{label(415, 300, "CHECK: SAME BYTES", 12)}
{shepherd(750, 430, 0.5, flip=True)}
{bubble(120, 360, 420, 58, "Each task writes its own file.", 22, tail="left")}
""",
)

# a-record-that-checks-form-not-truth: three answers, one with evidence, form checked and truth not.
SCENES["tech/a-record-that-checks-form-not-truth"] = (
    "Form checked, truth not checked",
    "A table with three columns labelled applies, not applicable and deferred. One row has a file icon pointing at a real file. A note beside the table says form checked, truth not checked. The shepherd says I check the form.",
    f"""
<rect x="100" y="120" width="440" height="250" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>
<path d="M247 120 V370 M394 120 V370 M100 170 H540 M100 230 H540 M100 290 H540" stroke="{INK}" stroke-width="2.5"/>
{label(173, 152, "APPLIES", 13)}{label(320, 152, "NOT APPLICABLE", 12)}{label(467, 152, "DEFERRED", 13)}
<rect x="130" y="188" width="86" height="28" rx="5" fill="{GREEN}"/>
{label(173, 207, "FILE", 12, "#fff")}
<rect x="274" y="248" width="92" height="28" rx="5" fill="{OCHRE_L}"/>
{label(320, 267, "REASON", 12)}
<rect x="418" y="308" width="98" height="28" rx="5" fill="{RED}"/>
{label(467, 327, "TO DO", 12, "#fff")}
<g transform="translate(590 150)">
<rect x="0" y="0" width="150" height="90" rx="8" fill="#fff" stroke="{INK}" stroke-width="3"/>
{label(75, 34, "FORM: CHECKED", 12, GREEN)}
{label(75, 62, "TRUTH: NOT", 12, RED)}
</g>
{sheep(600, 400, 0.42)}
{shepherd(750, 430, 0.5, flip=True)}
{bubble(430, 40, 330, 58, "I check the form.", 22, tail="right")}
""",
)

# trust-you-can-take-back: a dial that moves only from ask toward yes, with the no mark locked.
SCENES["tech/trust-you-can-take-back"] = (
    "Up from ask, never from no",
    "A dial with three marks labelled ask, yes and no, with the pointer on ask. Beside it a list of gates with check marks and a lock on the no mark. A sheep sits at the base of the dial. The shepherd says only up from ask, never from no.",
    f"""
<path d="M120 330 A150 150 0 0 1 420 330" stroke="{INK}" stroke-width="5" fill="{PAPER}"/>
<path d="M270 330 L270 200" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>
<circle cx="270" cy="330" r="12" fill="{INK}"/>
{label(270, 160, "ASK", 16)}
{label(160, 270, "NO", 16, RED)}
{label(380, 270, "YES", 16, GREEN)}
<path d="M285 175 A110 110 0 0 1 355 235" stroke="{GREEN}" stroke-width="4" fill="none" stroke-dasharray="4 8" stroke-linecap="round"/>
<g transform="translate(130 296)"><rect x="-14" y="0" width="28" height="22" rx="4" fill="{RED}" stroke="{INK}" stroke-width="3"/><path d="M-8 0 V-8 a8 8 0 0 1 16 0 V0" stroke="{INK}" stroke-width="3" fill="none"/></g>
{_box(470, 120, 230, 40, "OPTED IN RULE ONLY", "#fff", 12)}
{_box(470, 165, 230, 40, "OWN RECORD, 13 GATES", "#fff", 12)}
{_box(470, 210, 230, 40, "NEVER: PAY, SEND, POST", "#fff", 12)}
{_box(470, 255, 230, 40, "OFF BY DEFAULT", "#fff", 12)}
{sheep(250, 430, 0.42)}
{shepherd(750, 430, 0.5, flip=True)}
{bubble(120, 50, 420, 58, "Up from ask. Never from no.", 22, tail="left")}
""",
)

# a-timer-and-a-web-page-use-the-same-gate: a clock and a browser into the same gate, then the logbook.
SCENES["tech/a-timer-and-a-web-page-use-the-same-gate"] = (
    "Every way in meets the same gate",
    "A clock and a browser window on the left, each with an arrow to the same gate. Past the gate a single arrow leads to a logbook. A sheep stands by the clock. The shepherd says every way in meets the same gate.",
    f"""
<g transform="translate(150 190)">
<circle cx="0" cy="0" r="44" fill="{PAPER}" stroke="{INK}" stroke-width="4"/>
<path d="M0 0 V-26 M0 0 L20 12" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>
</g>
{label(150, 262, "07:30 TIMER", 13)}
<g transform="translate(100 300)">
<rect x="0" y="0" width="130" height="80" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>
<path d="M0 22 H130" stroke="{INK}" stroke-width="3"/>
<circle cx="14" cy="11" r="3.5" fill="{RED}"/><circle cx="28" cy="11" r="3.5" fill="{OCHRE_L}"/><circle cx="42" cy="11" r="3.5" fill="{GREEN}"/>
{label(65, 56, "127.0.0.1", 13)}
</g>
{_arrow(205, 190, 330, 250)}
{_arrow(235, 340, 330, 280)}
<g stroke="{INK}" stroke-width="4">
<rect x="330" y="200" width="22" height="130" rx="6" fill="{OCHRE_L}"/>
<rect x="390" y="200" width="22" height="130" rx="6" fill="{OCHRE_L}"/>
</g>
{label(371, 186, "SAME GATE", 14)}
{_arrow(412, 265, 520, 265)}
<rect x="520" y="215" width="150" height="100" rx="8" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>
<path d="M595 262 V315" stroke="{INK}" stroke-width="2.5"/>
{label(595, 250, "LOGBOOK", 13)}
<path d="M535 275 H580 M610 275 H655 M535 295 H580" stroke="{OCHRE}" stroke-width="4" stroke-linecap="round"/>
{sheep(270, 140, 0.34)}
{shepherd(750, 430, 0.5, flip=True)}
{bubble(120, 50, 480, 58, "Every way in meets the same gate.", 22, tail="left")}
""",
)


if __name__ == "__main__":
    for key, (title, desc, body) in SCENES.items():
        name = key.split("/")[1] + ".svg"
        with open(os.path.join(OUT, name), "w") as f:
            f.write(frame(body, title, desc))
        print(name)