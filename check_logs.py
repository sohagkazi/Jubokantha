import ftplib

FTP_HOST = "server214.web-hosting.com"
FTP_USER = "piectvoy"
FTP_PASS = "BsNNmUm3CIoa"

def read_ftp():
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        print("Connected. Current directory:", ftp.pwd())
        
        # Go to app directory
        ftp.cwd('jubokantha-app')
        print("Contents of jubokantha-app:")
        lines = []
        ftp.retrlines('LIST', lines.append)
        for line in lines:
            print(line)
            
        print("\nChecking for log files...")
        log_files = [f for f in lines if f.endswith('.log') or 'log' in f.lower()]
        for file_info in log_files:
            filename = file_info.split()[-1]
            print(f"\n--- Reading {filename} ---")
            try:
                content = []
                ftp.retrlines(f'RETR {filename}', content.append)
                print('\n'.join(content[-50:])) # print last 50 lines
            except Exception as e:
                print(f"Could not read {filename}: {e}")
                
        ftp.quit()
    except Exception as e:
        print("FTP Error:", str(e))

if __name__ == "__main__":
    read_ftp()
