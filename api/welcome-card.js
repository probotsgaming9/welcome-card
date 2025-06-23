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

  ctx.fillStyle = '#23272A';
  ctx.fillRect(0, 0, width, height);

  try {
    const response = await axios.get(avatar, { responseType: 'arraybuffer' });
    const avatarImg = await loadImage(response.data);

    const avatarSize = 150;
    const avatarX = width / 2 - avatarSize / 2;
    const avatarY = 50;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Welcome ${username}`, width / 2, avatarY + avatarSize + 50);

    res.setHeader('Content-Type', 'image/png');
    res.send(canvas.toBuffer('image/png'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate card');
  }
};
