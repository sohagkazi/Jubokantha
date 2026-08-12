<?php
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
?>