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
        cast
      });

    return;
  }

  const castPath = path.join(process.cwd(), `/public/.casts/${authorSlug}/${castSlug}/cast.json`);

  res
    .status(200)
    .send(castPath);
}
