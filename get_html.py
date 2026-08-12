import urllib.request
import re
html = urllib.request.urlopen('https://jubokantha.org/').read().decode('utf-8')
matches = re.findall(r'<img[^>]+WhatsApp_Image[^>]*>', html)
for m in matches:
    print(m)
