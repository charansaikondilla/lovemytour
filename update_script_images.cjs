const fs = require('fs');

let content = fs.readFileSync('d:/backup/lovemytour/script.js', 'utf8');

// Remove tashkent from categoryFlagMap
content = content.replace(/,\s*tashkent:\s*"[^"]+"/g, '');

// Update destinationImageMap
const mapping = {
  andaman: 'assets/packages-images/Andaman.png',
  bali: 'assets/packages-images/bali.png',
  goa: 'assets/packages-images/goa.png',
  maldives: 'assets/packages-images/maldives.png',
  mauritius: 'assets/packages-images/mauritius.png',
  seychelles: 'assets/packages-images/seychelles.png',
  thailand: 'assets/packages-images/thailand.png'
};

for (const [key, val] of Object.entries(mapping)) {
  const regex = new RegExp(`(?<=^\\s*)${key}:\\s*"[^"]+"`, 'gm');
  if (regex.test(content)) {
      content = content.replace(regex, `${key}: "${val}"`);
  } else {
      // If seychelles wasn't there, we can add it? 
      // Actually seychelles was not in destinationImageMap in script.js line 790. We should probably add it.
  }
}

// Remove tashkent from destinationImageMap
content = content.replace(/,\s*tashkent:\s*"[^"]+"/g, '');

fs.writeFileSync('d:/backup/lovemytour/script.js', content);
console.log("Updated script.js");
