from PIL import Image, ImageChops

def process_aeroplane_pure_pil():
    print("Processing aeroplane with pure PIL...")
    img = Image.open("aeroplane.png").convert("RGBA")
    pixels = img.load()
    w, h = img.size
    
    # Corner color baseline
    bg_r, bg_g, bg_b, _ = pixels[0, 0]
    
    for x in range(w):
        for y in range(h):
            r, g, b, a = pixels[x, y]
            # Euclidean distance in color space from background corner color
            dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2) ** 0.5
            
            if dist < 22:
                pixels[x, y] = (r, g, b, 0)
            elif dist < 45:
                # Soft edge alpha anti-aliasing
                alpha = int(((dist - 22) / (45 - 22)) * 255)
                pixels[x, y] = (r, g, b, alpha)
            else:
                pixels[x, y] = (r, g, b, 255)
                
    img.save("aeroplane_transparent.png", "PNG")
    print("Saved aeroplane_transparent.png successfully!")

def process_cloud_pure_pil():
    print("Processing cloud overlay with pure PIL...")
    img = Image.open("cloud_overlay.png").convert("RGBA")
    pixels = img.load()
    w, h = img.size
    
    bg_r, bg_g, bg_b, _ = pixels[0, 0]
    bg_lum = (bg_r + bg_g + bg_b) / 3.0
    
    for x in range(w):
        for y in range(h):
            r, g, b, a = pixels[x, y]
            lum = (r + g + b) / 3.0
            
            diff = lum - bg_lum
            if diff <= 0:
                pixels[x, y] = (255, 255, 255, 0)
            else:
                # Scale whiteness to alpha
                alpha = min(255, int((diff / (255 - bg_lum + 1e-5)) * 1.6 * 255))
                pixels[x, y] = (255, 255, 255, alpha)
                
    img.save("cloud_transparent.png", "PNG")
    print("Saved cloud_transparent.png successfully!")

if __name__ == "__main__":
    process_aeroplane_pure_pil()
    process_cloud_pure_pil()
