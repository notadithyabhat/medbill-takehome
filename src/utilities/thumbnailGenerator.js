const axios = require('axios');
const sharp = require('sharp');

async function generateThumbnail(fileUrl, outputPath, width = 200) {
  console.log('Current working directory:', process.cwd());
  try {
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    console.log(`Generating thumbnail for ${fileUrl}`);

    await sharp(imageBuffer)
      .resize({ width })
      .toFile(outputPath);

    console.log(`Thumbnail saved to ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error generating thumbnail:', error.message);
    throw error;
  }
}

module.exports = { generateThumbnail };
