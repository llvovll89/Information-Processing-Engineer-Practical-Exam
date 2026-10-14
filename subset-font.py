"""Build an offline WOFF2 subset from the characters used by this study guide.
Run after node build.js when adding new content; requires fonttools and brotli.
The original font and its license remain unchanged.
"""
from pathlib import Path
from fontTools import subset

root = Path(__file__).resolve().parent
text = ''.join(p.read_text(encoding='utf-8-sig') for pattern in ('*.html', '*.js', '*.css') for p in root.glob(pattern))
text += ''.join(chr(i) for i in range(32, 127))
options = subset.Options()
options.flavor = 'woff2'
options.layout_features = ['*']
font = subset.load_font(str(root / 'fonts/PretendardVariable.woff2'), options)
# The upstream license reserves the name Pretendard. Give the modified subset
# its own internal family/PostScript names while retaining copyright/license.
names = {1: 'Silgi Study Sans', 3: 'SilgiStudySans-20261014', 4: 'Silgi Study Sans Variable', 6: 'SilgiStudySans-Variable', 16: 'Silgi Study Sans', 25: 'SilgiStudySans'}
for record in font['name'].names:
    if record.nameID in names:
        record.string = names[record.nameID].encode(record.getEncoding(), errors='replace')
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
target = root / 'fonts/SilgiStudySans.woff2'
subset.save_font(font, str(target), options)
print(f'{len(set(text))} characters; subset {target.stat().st_size} bytes')
