import ftplib
import os
import requests
import time

FTP_HOST = "server214.web-hosting.com"
FTP_USER = "piectvoy"
FTP_PASS = "BsNNmUm3CIoa"
ZIP_FILE = "Jubokantha_Bundle.zip"

PHP_SCRIPT = """<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$appDir = '../jubokantha-app';
$newDir = '../jubokantha-app_new_' . time();
$oldDir = '../jubokantha-app_old_' . time();
$zipFile = '../Jubokantha_Bundle.zip';

// Ensure new dir exists
if (!file_exists($newDir)) {
    mkdir($newDir, 0755, true);
}

$zip = new ZipArchive;
$res = $zip->open($zipFile);
if ($res === TRUE) {
    // Extract to NEW directory
    $extractStatus = $zip->extractTo($newDir . '/');
    $zip->close();
    
    if (!$extractStatus) {
        echo "EXTRACT_FAILED_DURING_EXTRACTTO";
        exit;
    }

    // Move uploads from old appDir to newDir
    $uploadsOld = $appDir . '/public/uploads';
    $uploadsNew = $newDir . '/public/uploads';
    if (!file_exists($uploadsNew)) {
        mkdir($uploadsNew, 0755, true);
    }
    
    if (file_exists($uploadsOld)) {
        // recursively copy uploads
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($uploadsOld, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        foreach ($files as $file) {
            $dest = $uploadsNew . '/' . $files->getSubPathname();
            if ($file->isDir()) {
                if (!file_exists($dest)) mkdir($dest, 0755, true);
            } else {
                copy($file->getPathname(), $dest);
            }
        }
    }

    // Swap directories
    if (file_exists($appDir)) {
        rename($appDir, $oldDir);
    }
    rename($newDir, $appDir);

    // Restart app
    if (!file_exists($appDir . '/tmp')) {
        mkdir($appDir . '/tmp', 0755, true);
    }
    file_put_contents($appDir . '/tmp/restart.txt', time());
    echo "EXTRACT_SUCCESS";
} else {
    echo "EXTRACT_FAILED: " . $res;
}
?>"""

def deploy():
    try:
        print("Connecting to FTP...")
        ftp = ftplib.FTP()
        ftp.connect(FTP_HOST, 21, timeout=120)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.set_pasv(True)
        print("Connected!")
        
        # Upload zip to home directory
        print(f"Uploading {ZIP_FILE}...")
        with open(ZIP_FILE, 'rb') as f:
            ftp.storbinary(f'STOR Jubokantha_Bundle.zip', f, blocksize=65536)
        print("Zip uploaded successfully.")
        
        # Create extract.php
        with open('extract.php', 'w') as f:
            f.write(PHP_SCRIPT)
            
        # Upload extract.php to public_html
        print("Uploading extract.php...")
        ftp.cwd('public_html')
        with open('extract.php', 'rb') as f:
            ftp.storbinary('STOR extract.php', f)
        print("extract.php uploaded.")
        
        ftp.quit()
        
        # Trigger extraction
        print("Triggering extraction via HTTP...")
        url = "http://piecornit.com/extract.php"
        response = requests.get(url, timeout=60)
        print("HTTP Status Code:", response.status_code)
        print("HTTP Response:", response.text)
        
        if "EXTRACT_SUCCESS" in response.text:
            print("Deployment files extracted successfully!")
        else:
            print("Failed to extract via HTTP. Trying jubokantha.org...")
            url2 = "http://jubokantha.org/extract.php"
            try:
                # also upload extract.php to jubokantha.org just in case
                ftp2 = ftplib.FTP(FTP_HOST)
                ftp2.login(FTP_USER, FTP_PASS)
                ftp2.cwd('jubokantha.org')
                with open('extract.php', 'rb') as f:
                    ftp2.storbinary('STOR extract.php', f)
                ftp2.quit()
                
                response2 = requests.get(url2, timeout=60)
                print("HTTP Response 2:", response2.text)
            except Exception as e2:
                print("Fallback failed:", str(e2))
            
    except Exception as e:
        print("Error during deploy:", str(e))

if __name__ == "__main__":
    deploy()
