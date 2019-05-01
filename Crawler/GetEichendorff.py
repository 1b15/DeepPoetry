from bs4 import BeautifulSoup
from bs4 import element
import urllib3
import re

http = urllib3.PoolManager()

baseUrl = 'https://gutenberg.spiegel.de/buch/gedichte-9611/'
textfile = ""

for i in range(2, 218):
    response = http.request('GET', (baseUrl + str(i)))
    soup = BeautifulSoup(response.data, features="html5lib")

    for parentTag in soup.find_all("table", class_="poem"):
        for u in (x for x in parentTag.children if isinstance(x, element.Tag)):
            for v in (y for y in u.children if isinstance(y, element.Tag)):
                for w in (z for z in v.children if isinstance(z, element.Tag)):
                    for verse in w.children:
                        if re.sub('\d', '', str(verse).strip()) != '':
                            if str(verse).strip() != '<br/>':
                                if str(verse).strip().startswith('<p>'):
                                    if not textfile.endswith('\n'): textfile += '\n'
                                    textfile += '%'
                                    for line in re.split('<br/>', str(verse).replace('<p>', '').replace('</p>', '')):
                                        textfile += line.strip()+'\n'
                                else:
                                    textfile += str(verse).strip()
                            else:
                                if not textfile.endswith('\n'): textfile += '\n'

    if not textfile.endswith('\n'): textfile += '\n'
    textfile += '%$'

textfile = textfile.replace("<i>", '') \
                .replace("</i>", '') \
                .replace("»", '"') \
                .replace("«", '"')
print(textfile)
