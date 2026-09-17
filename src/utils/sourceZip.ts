import JSZip from 'jszip';
import { SOURCE_FILES } from './sourceFilesData';

/**
 * Generates and downloads the full application source code as a ZIP directly in the browser.
 * This runs 100% client-side and does NOT depend on server file hosting or external URLs.
 */
export async function downloadSourceCodeZip(): Promise<void> {
  const zip = new JSZip();

  // 1. Add all source and configuration files
  for (const [filePath, content] of Object.entries(SOURCE_FILES)) {
    zip.file(filePath, content);
  }

  // 2. Add README instructions
  const readmeContent = `# Livre d'Or de Mariage - Katia & Jean-François
Date du mariage : 25 Juillet 2026
Contact : k.jf.mariage@gmail.com

---

## Guide d'installation et de lancement

### Prérequis
- Node.js (version 18 ou plus récente) disponible sur https://nodejs.org

### Instructions
1. Décompressez cette archive ZIP dans un dossier sur votre ordinateur.
2. Ouvrez un terminal (Invite de commande sur Windows, ou Terminal sur macOS/Linux) dans ce dossier.
3. Installez les dépendances :
   \`\`\`bash
   npm install
   \`\`\`
4. Lancez l'application en local :
   \`\`\`bash
   npm run dev
   \`\`\`
5. Ouvrez votre navigateur sur l'adresse affichée dans le terminal (par exemple http://localhost:3000 ou http://localhost:5173).

---
Félicitations aux mariés Katia & Jean-François ! 🍋🍕
`;
  zip.file('README.md', readmeContent);

  // 3. Try to fetch the wedding photo and include it in public folder
  try {
    const photoResponse = await fetch('/wedding_group_thank_you.jpg');
    if (photoResponse.ok) {
      const photoBlob = await photoResponse.blob();
      zip.file('public/wedding_group_thank_you.jpg', photoBlob);
      zip.file('src/assets/images/wedding_thank_you_photo_1789626133406.jpg', photoBlob);
    }
  } catch (err) {
    console.warn('Could not fetch wedding group photo for zip:', err);
  }

  // 4. Generate the ZIP as a Blob
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  // 5. Trigger browser download
  const downloadUrl = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = downloadUrl;
  downloadAnchor.download = 'livre-d-or-mariage-code.zip';
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);

  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 2000);
}
