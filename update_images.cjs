const fs = require('fs');

let content = fs.readFileSync('d:/backup/lovemytour/packagesData.js', 'utf8');

const mapping = {
  andaman: 'assets/packages-images/Andaman.png',
  bali: 'assets/packages-images/bali.png',
  goa: 'assets/packages-images/goa.png',
  maldives: 'assets/packages-images/maldives.png',
  mauritius: 'assets/packages-images/mauritius.png',
  seychelles: 'assets/packages-images/seychelles.png',
  thailand: 'assets/packages-images/thailand.png'
};

for (const [country, imgPath] of Object.entries(mapping)) {
  const regex2 = new RegExp(`(?:^|\\n)\\s*"?${country}"?:\\s*\\{([\\s\\S]*?)(?=\\n\\s*"?(?:[a-z-]+)"?:\\s*\\{|\\n\\s*\\}$|\\n\\s*\\}\\n\\})`, 'g');
  let match2 = regex2.exec(content);
  if (match2) {
    let block = match2[1];
    block = block.replace(/banner:\s*["'][^"']+["']/g, `banner: "${imgPath}"`);
    block = block.replace(/image:\s*["'][^"']+["']/g, `image: "${imgPath}"`);
    content = content.replace(match2[1], block);
    console.log("Updated country: " + country);
  } else {
    console.log("Could not find country: " + country);
  }
}

// Remove tashkent entirely
const tashkentRegex = /\n\s*"tashkent":\s*\{[\s\S]*?(?=\n\s*"[a-z-]+":\s*\{|\n\s*\})/g;
let replaced = content.replace(tashkentRegex, '');
if (replaced !== content) {
    console.log("Removed Tashkent from packagesData.js");
}
content = replaced;

// Clean up trailing commas if any
content = content.replace(/,\s*\}/g, '\n}');

fs.writeFileSync('d:/backup/lovemytour/packagesData.js', content);
