"""Builds a themed copy of a module page: swaps its Google Fonts link for the site fonts and injects the theme bridge."""
import re, sys
src, common_path, css_path, dst = sys.argv[1:5]
h = open(src, encoding='utf-8').read()
h = re.sub(r'<link[^>]+fonts\.googleapis\.com/css2[^>]*>', '', h)
h = re.sub(r'<link rel="preconnect"[^>]+fonts\.(googleapis|gstatic)\.com"[^>]*>', '', h)
inject = open(common_path, encoding='utf-8').read() + '<style id="astra-theme">\n' + open(css_path, encoding='utf-8').read() + '</style>\n'
# after the page's own styles (some pages omit </head>), so the theme wins the cascade
i = h.find('</head>')
if i < 0:
    i = h.find('</style>', h.find('<style')) + len('</style>')
assert i > len('</style>')
open(dst, 'w', encoding='utf-8').write(h[:i] + inject + h[i:])
print(dst, len(h))
