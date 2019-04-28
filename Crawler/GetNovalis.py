from bs4 import BeautifulSoup
import urllib3

http = urllib3.PoolManager()

baseUrl = 'https://gutenberg.spiegel.de/buch/gedichte-9082/'
textfile = ""

for i in range(1, 58):
    response = http.request('GET', (baseUrl + str(i)))
    soup = BeautifulSoup(response.data, features="html5lib")

    for poem in soup.find_all("p", class_="vers"):
        for verse in poem.contents:
            if str(verse) != '<br/>':
                textfile += str(verse).strip(' ').replace("<i>", '')\
                                                .replace("</i>", '')\
                                                .replace("\n", '')
            else:
                textfile += "\n"
        textfile += "\n%"
    textfile += "$"

print(textfile)