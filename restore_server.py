import ftplib
import time
import requests

FTP_HOST = "server214.web-hosting.com"
FTP_USER = "piectvoy"
FTP_PASS = "BsNNmUm3CIoa"

def force_restart():
    try:
        print("Connecting to FTP...")
        ftp = ftplib.FTP()
        ftp.connect(FTP_HOST, 21, timeout=60)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.set_pasv(True)
        print("Connected.")

        # Navigate to jubokantha-app
        try:
            ftp.cwd('jubokantha-app')
        except:
            print("Cannot find jubokantha-app directory")
            ftp.quit()
            return

        # Ensure tmp directory exists
        try:
            ftp.cwd('tmp')
        except:
            try:
                ftp.mkd('tmp')
                ftp.cwd('tmp')
            except Exception as e:
                print("Cannot create tmp dir:", e)

        # Write restart.txt with current timestamp
        import io
        content = str(int(time.time())).encode()
        ftp.storbinary('STOR restart.txt', io.BytesIO(content))
        print("OK: restart.txt updated - server restart triggered.")

        ftp.quit()

        # Wait and check
        print("Waiting 15 seconds for server to restart...")
        time.sleep(15)

        for attempt in range(5):
            try:
                r = requests.get('http://jubokantha.org', timeout=20)
                if r.status_code == 200:
                    print("Site is UP! Status:", r.status_code)
                    return
                else:
                    print("Attempt", attempt+1, ": Status", r.status_code, "retrying...")
            except Exception as e:
                print("Attempt", attempt+1, ": Not reachable, retrying...")
            time.sleep(10)

        print("WARNING: Site still not responding after restart.")

    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    force_restart()
