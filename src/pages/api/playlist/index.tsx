import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "~/libraries/mongoose.library";
import { PlaylistModel } from "~/models/Playlist.model";
import { DEFAULT_CARD_COLOR } from "~/config/common.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();

  if (req.method === "GET") {
    const playlists = await getPlaylist();
    res.status(200).send({ data: playlists });
  } else if (req.method === "POST") {
    await createPlaylist(req.body);
    const playlists = await getPlaylist();
    const length = playlists.length;
    res.status(201).send({ data: playlists[length - 1] });
  }
}

async function getPlaylist() {
  const result = await PlaylistModel.find();
  return result.map((doc) => {
    const playlist = doc.toObject();
    return {
      name: playlist.name,
      owner: playlist.owner,
      slug: playlist.slug,
      spotifyId: playlist.spotifyId,
      upvote: playlist.upvote,
      color: playlist.color || DEFAULT_CARD_COLOR,
      id: playlist._id.toString(),
    };
  });
}

async function createPlaylist(obj: unknown) {
  const createPlaylist = await PlaylistModel.create(obj);
}

export type Response = any;
