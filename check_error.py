import ftplib
try:
    ftp = ftplib.FTP('server214.web-hosting.com')
    ftp.login('piectvoy', 'BsNNmUm3CIoa')
    ftp.cwd('jubokantha-app')
    files = ftp.nlst()
    if 'error_log.txt' in files:
        with open('error_log.txt', 'wb') as f:
            ftp.retrbinary('RETR error_log.txt', f.write)
        with open('error_log.txt', 'r') as f:
            print("ERROR LOG CONTENT:\n" + f.read())
    else:
        print('No error_log.txt found.')
        
    # Check if stderr.log exists
    if 'stderr.log' in files:
        with open('stderr.log', 'wb') as f:
            ftp.retrbinary('RETR stderr.log', f.write)
        with open('stderr.log', 'r') as f:
            print("STDERR LOG CONTENT:\n" + f.read())
    else:
        print('No stderr.log found.')
        
    ftp.quit()
except Exception as e:
    print(f"Error: {e}")
