import ftplib
ftp = ftplib.FTP('server214.web-hosting.com')
ftp.login('piectvoy', 'BsNNmUm3CIoa')
with open('.htaccess_temp', 'wb') as f:
    ftp.retrbinary('RETR jubokantha.org/.htaccess', f.write)
ftp.quit()
