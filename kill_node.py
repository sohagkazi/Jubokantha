import ftplib
import requests

FTP_HOST = "server214.web-hosting.com"
FTP_USER = "piectvoy"
FTP_PASS = "BsNNmUm3CIoa"

PHP_SCRIPT = """<?php
echo "Killing Node processes...<br>";
exec('pkill -f node', $output, $return_var);
echo "Result: " . $return_var . "<br>";
print_r($output);

echo "<br>Killing npm processes...<br>";
exec('pkill -f npm', $output2, $return_var2);
echo "Result: " . $return_var2 . "<br>";
print_r($output2);
?>"""

def main():
    try:
        print("Connecting to FTP...")
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.cwd('public_html')
        
        with open('kill.php', 'w') as f:
            f.write(PHP_SCRIPT)
            
        with open('kill.php', 'rb') as f:
            ftp.storbinary('STOR kill.php', f)
            
        ftp.quit()
        print("kill.php uploaded. Executing...")
        
        response = requests.get("http://piecornit.com/kill.php", timeout=30)
        print("Response:", response.text)
        
        response2 = requests.get("http://jubokantha.org/kill.php", timeout=30)
        print("Response 2:", response2.text)
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    main()
