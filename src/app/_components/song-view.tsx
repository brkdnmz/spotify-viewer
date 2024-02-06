/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import React, { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6";
import { type RouterOutputs } from "~/trpc/shared";

export default function SongView({
  song,
}: {
  song: RouterOutputs["spotify"]["getSongData"];
}) {
  const [copiedTitle, setCopiedTitle] = useState(false);

  if (!song) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-2 pt-5">
      <h1 className="flex max-w-[75%] gap-2 text-center text-xl font-bold">
        <Link href={song.url} target="_blank">
          {song.title}
        </Link>
        <button
          className="text-green-200 opacity-75 transition hover:opacity-100"
          onClick={() =>
            navigator.clipboard
              .writeText(`${song.musicians.join(", ")} - ${song.title}`)
              .then(() => setCopiedTitle(true))
          }
          title={'Copy "Artist(s) - Title" to clipboard'}
        >
          {copiedTitle ? <FaCheck /> : <FaCopy />}
        </button>
      </h1>

      <div className="aspect-square w-[320px] overflow-hidden rounded-3xl ring-2 ring-green-600">
        <Link href={song.album} target="_blank" title="Go to album">
          <img src={song.coverImage} alt="Cover" width="100%" />
        </Link>
      </div>

      <h2 className="text-lg text-green-200">
        {song.musicians.map((musician, musicianIndex) => (
          <React.Fragment key={musician}>
            <Link href={song.musicianUrls[musicianIndex]!} target="_blank">
              {musician}
            </Link>
            {musicianIndex + 1 !== song.musicians.length && ", "}
          </React.Fragment>
        ))}
      </h2>
      <h3 className="text-xs font-light text-green-400">
        {new Date(song.releaseDate).toLocaleDateString("en-US")}
      </h3>
      {/* {song?.album} */}
      {/* <h2 className="text-sm font-light">{song?.description}</h2> */}
    </div>
  );
}
