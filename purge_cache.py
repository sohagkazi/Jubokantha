import ftplib
import requests

ftp = ftplib.FTP('server214.web-hosting.com')
ftp.login('piectvoy', 'BsNNmUm3CIoa')
ftp.cwd('jubokantha.org')
with open('purge.php', 'wb') as f:
    f.write(b'<?php header("X-LiteSpeed-Purge: *"); echo "Purged"; ?>')
with open('purge.php', 'rb') as f:
    ftp.storbinary('STOR purge.php', f)
ftp.quit()

print(requests.get('https://jubokantha.org/purge.php').text)
