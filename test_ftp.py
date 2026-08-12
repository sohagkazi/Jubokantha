import ftplib
import os

FTP_HOST = "server214.web-hosting.com"
FTP_USER = "piectvoy"
FTP_PASS = "BsNNmUm3CIoa"

def test_ftp():
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        print("FTP Login Successful!")
        print("Current directory:", ftp.pwd())
        print("Directory listing:")
        ftp.retrlines('LIST')
        ftp.quit()
    except Exception as e:
        print("FTP Error:", str(e))

if __name__ == "__main__":
    test_ftp()
