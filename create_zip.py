import os
import shutil
import subprocess
import sys

def create_zip():
    root_dir = os.path.abspath(r'.next\standalone')

    # Copy static assets to standalone directory
    print("Copying public assets...")
    if os.path.exists('public'):
        shutil.copytree('public', os.path.join(root_dir, 'public'), dirs_exist_ok=True)
    if os.path.exists(r'.next\static'):
        shutil.copytree(r'.next\static', os.path.join(root_dir, '.next', 'static'), dirs_exist_ok=True)
    if os.path.exists(r'.next\static'):
        shutil.copytree(r'.next\static', os.path.join(root_dir, '.next', 'static'), dirs_exist_ok=True)
    if os.path.exists(r'.env.local'):
        shutil.copy(r'.env.local', os.path.join(root_dir, '.env'))

    # Next.js standalone tracing might miss @google/genai, so copy it manually
    if os.path.exists(r'node_modules\@google\genai'):
        shutil.copytree(r'node_modules\@google\genai', os.path.join(root_dir, 'node_modules', '@google', 'genai'), dirs_exist_ok=True)
        # Also need @google/genai dependencies if they are missing, but usually only the main package is missed.
        # Let's copy all of node_modules/@google just in case
        if os.path.exists(r'node_modules\@google'):
            shutil.copytree(r'node_modules\@google', os.path.join(root_dir, 'node_modules', '@google'), dirs_exist_ok=True)

    # Write correct app.js that uses standalone server.js
    app_js_content = (
        "const fs = require('fs');\n"
        "const path = require('path');\n"
        "const envPath = path.join(__dirname, '.env');\n"
        "if (fs.existsSync(envPath)) {\n"
        "  const envConfig = fs.readFileSync(envPath, 'utf8').split('\\n');\n"
        "  envConfig.forEach(line => {\n"
        "    const match = line.match(/^([^=]+)=(.*)$/);\n"
        "    if (match) {\n"
        "      const key = match[1].trim();\n"
        "      let val = match[2].trim();\n"
        "      if (val.startsWith('\"') && val.endsWith('\"')) val = val.slice(1, -1);\n"
        "      if (val.startsWith(\"'\") && val.endsWith(\"'\")) val = val.slice(1, -1);\n"
        "      process.env[key] = val;\n"
        "    }\n"
        "  });\n"
        "}\n"
        "process.on('uncaughtException', (err) => {\n"
        "  fs.writeFileSync(__dirname + '/error_log.txt', err.stack || err.toString());\n"
        "});\n"
        "require('./server.js');\n"
    )
    with open(os.path.join(root_dir, 'app.js'), 'w') as f:
        f.write(app_js_content)
    print("app.js written to standalone.")

    # Remove old zip if exists
    zip_path = os.path.abspath('Jubokantha_Bundle.zip')
    if os.path.exists(zip_path):
        os.remove(zip_path)

    print("Creating zip with python shutil (handles slashes correctly)...")
    shutil.make_archive('Jubokantha_Bundle', 'zip', root_dir)

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"Zip created! Size: {size_mb:.2f} MB")

create_zip()
