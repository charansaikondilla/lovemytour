from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
import os
import sys

def process_aeroplane():
    print("Processing aeroplane background removal...")
    try:
        from rembg import remove
        input_img = Image.open("aeroplane.png")
        output_img = remove(input_img)
        output_img.save("aeroplane_transparent.png")
        print("Aeroplane processed with AI rembg into aeroplane_transparent.png")
        return
    except Exception as e:
        print("Rembg error/not ready, fallback algorithm:", e)

    # Color difference fallback for aeroplane
    img = Image.open("aeroplane.png").convert("RGBA")
    data = np.array(img, dtype=float)
    
    # corner color estimate
    bg_color = data[0, 0, :3]
    diff = np.sqrt(np.sum((data[:, :, :3] - bg_color) ** 2, axis=2))
    
    alpha = np.clip((diff - 20) * 8, 0, 255).astype(np.uint8)
    data[:, :, 3] = alpha
    
    res = Image.fromarray(data.astype(np.uint8))
    res.save("aeroplane_transparent.png")
    print("Aeroplane processed with color thresholding into aeroplane_transparent.png")

def process_cloud():
    print("Processing cloud background removal...")
    # Cloud processing: White clouds on dark/grey background.
    # Convert brightness/luminance or color difference to alpha channel!
    img = Image.open("cloud_overlay.png").convert("RGBA")
    data = np.array(img, dtype=float)
    
    # Calculate luminance / whiteness: max of RGB or distance from background
    # Background in corner is approx [182, 184, 183]
    bg_color = data[0, 0, :3]
    bg_bright = np.mean(bg_color)
    
    # Cloud whiteness relative to background
    brightness = np.mean(data[:, :, :3], axis=2)
    whiteness = np.clip((brightness - bg_bright + 15) / (255 - bg_bright + 15), 0, 1)
    
    # Soft alpha gradient
    alpha = (whiteness ** 1.5 * 255).astype(np.uint8)
    
    # Set RGB to pure white (#ffffff) for cloud body so transparency reveals background smoothly
    cloud_rgba = np.zeros_like(data, dtype=np.uint8)
    cloud_rgba[:, :, 0] = 255
    cloud_rgba[:, :, 1] = 255
    cloud_rgba[:, :, 2] = 255
    cloud_rgba[:, :, 3] = alpha
    
    res = Image.fromarray(cloud_rgba)
    res.save("cloud_transparent.png")
    print("Cloud overlay processed into cloud_transparent.png")

if __name__ == "__main__":
    process_cloud()
    process_aeroplane()
