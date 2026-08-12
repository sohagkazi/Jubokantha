import ftplib
import time

FTP_HOST = "server214.web-hosting.com"
FTP_USER = "piectvoy"
FTP_PASS = "BsNNmUm3CIoa"

def try_fix():
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        print("Connected.")
        
        ftp.cwd('jubokantha-app')
        
        # List files
        files = []
        ftp.retrlines('LIST', files.append)
        print("Files in jubokantha-app:")
        for f in files:
            if 'server.js' in f or 'app.js' in f or '.js' in f:
                print(f)
                
        # Let's rename server.js to break the crash loop
        try:
            ftp.rename('server.js', 'server.js.bak')
            print("Renamed server.js to server.js.bak to stop crash loop.")
        except Exception as e:
            print("Could not rename server.js:", e)
            
        # Also touch restart.txt to force Passenger to reload the missing file
        try:
            ftp.cwd('tmp')
        except:
            ftp.mkd('tmp')
            ftp.cwd('tmp')
            
        with open('restart.txt', 'w') as f:
            f.write(str(time.time()))
        with open('restart.txt', 'rb') as f:
            ftp.storbinary('STOR restart.txt', f)
        print("Touched tmp/restart.txt")
            
        ftp.quit()
    except Exception as e:
        print("FTP Error:", str(e))

if __name__ == "__main__":
    try_fix()
