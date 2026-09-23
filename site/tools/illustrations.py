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



if __name__ == "__main__":
    for key, (title, desc, body) in SCENES.items():
        name = key.split("/")[1] + ".svg"
        with open(os.path.join(OUT, name), "w") as f:
            f.write(frame(body, title, desc))
        print(name)