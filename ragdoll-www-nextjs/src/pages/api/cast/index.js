import fs from 'fs';
import path from 'path';

export default async function (req, res) {
  const {
    authorSlug = '',
    castSlug = ''
  } = req.body;

  if (!authorSlug || !castSlug) {
    res
      .status(200)
      .json({
        status: 400,
        ok: false,
        message: `Invalid ${invalidParam}.`,
        dolls
      });

    return;
  }

  const castPath = path.join(process.cwd(), `/src/data/${authorSlug}/${castSlug}/cast.json`);
  const castFile = fs.readFileSync(castPath);
  const cast = JSON.parse(castFile);

  res
    .status(200)
    .json({
      status: 200,
      ok: true,
      cast: {
        name: cast.name,
        author: cast.author,
        description: cast.description,
        rating: 0,
        imageURL: cast.dolls[0].avatarURL,
        unitCount: cast.dolls.length,
        createdAt: cast.createdAt
      }
    });
}
