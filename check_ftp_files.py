import ftplib
try:
    ftp = ftplib.FTP('server214.web-hosting.com')
    ftp.login('piectvoy', 'BsNNmUm3CIoa')
    print('ROOT:', ftp.nlst())
    try:
        print('FILES IN jubokantha.org:', ftp.nlst('jubokantha.org'))
    except Exception as e:
        print('Error:', e)
    ftp.quit()
except Exception as e:
    print('FTP Error:', e)
