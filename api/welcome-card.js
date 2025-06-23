const { createCanvas, loadImage } = require('@napi-rs/canvas');
const axios = require('axios');

module.exports = async (req, res) => {
  const { username = 'Guest', avatar } = req.query;

  if (!avatar) {
    res.status(400).send('Missing avatar parameter');
    return;
  }

  const width = 800;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#23272A';
  ctx.fillRect(0, 0, width, height);

  try {
    // Load avatar
    const response = await axios.get(avatar, { responseType: 'arraybuffer' });
    const avatarImg = await loadImage(response.data);

    const avatarSize = 150;
    const avatarX = width / 2 - avatarSize / 2;
    const avatarY = 50;

    // Draw avatar (circle)
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // Draw debug rectangle where text should go (optional, for testing)
    ctx.strokeStyle = '#ff0000';
    ctx.strokeRect(width / 2 - 200, avatarY + avatarSize + 10, 400, 80);

    // Draw username text
    ctx.fillStyle = '#ffffff';
    ctx.font = '60px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`Welcome ${username}`, width / 2, avatarY + avatarSize + 10);

    // Output image
    res.setHeader('Content-Type', 'image/png');
    res.send(canvas.toBuffer('image/png'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate card');
  }
};
