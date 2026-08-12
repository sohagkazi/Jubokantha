import os
import sys
from PIL import Image

def generate_icons(source_image_path):
    if not os.path.exists(source_image_path):
        print(f"Error: {source_image_path} not found.")
        return False
        
    try:
        img = Image.open(source_image_path)
        
        # Paths for output
        app_dir = os.path.join("src", "app")
        os.makedirs(app_dir, exist_ok=True)
        
        favicon_path = os.path.join(app_dir, "favicon.ico")
        icon_path = os.path.join(app_dir, "icon.png")
        apple_icon_path = os.path.join(app_dir, "apple-icon.png")
        
        # Generate favicon.ico (usually 32x32)
        img.resize((32, 32)).save(favicon_path, format="ICO")
        print(f"Generated {favicon_path}")
        
        # Generate icon.png (usually 192x192 or 512x512)
        img.resize((512, 512)).save(icon_path, format="PNG")
        print(f"Generated {icon_path}")
        
        # Generate apple-icon.png (usually 180x180)
        img.resize((180, 180)).save(apple_icon_path, format="PNG")
        print(f"Generated {apple_icon_path}")
        
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

if __name__ == "__main__":
    source = sys.argv[1] if len(sys.argv) > 1 else os.path.join("public", "logo.jpg")
    print(f"Using source image: {source}")
    generate_icons(source)
