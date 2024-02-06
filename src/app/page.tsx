"use client";

import { useEffect, useRef, useState, type FormEventHandler } from "react";
import { LuLoader2, LuSearch } from "react-icons/lu";
import { api } from "~/trpc/react";
import SongView from "./_components/song-view";

export default function Home() {
  const [songUrl, setSongUrl] = useState<string>();
  const { data: song, isLoading } = api.spotify.getSongData.useQuery(
    { url: songUrl ?? "" },
    { refetchOnWindowFocus: false },
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined")
      setSongUrl(localStorage.getItem("last-url") ?? "");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && songUrl) {
      inputRef.current!.value = songUrl;
      localStorage.setItem("last-url", songUrl ?? "");
    }
  }, [songUrl]);

  useEffect(() => {
    const onPaste = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "v") {
        navigator.clipboard
          .readText()
          .then((text) => (inputRef.current!.value = text))
          .catch((e) => console.log(e));
      }
    };

    document.addEventListener("keydown", onPaste);

    return () => document.removeEventListener("keydown", onPaste);
  }, []);

  const onSubmitUrl: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setSongUrl(inputRef.current?.value);
  };

  return (
    <form
      onSubmit={onSubmitUrl}
      className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#428d5b] to-[#021b0b] text-white"
    >
      <div className="container flex flex-col items-center px-8 pt-32">
        <div className="relative w-1/2 text-center">
          <input
            type="text"
            placeholder="Enter the song's URL..."
            className="w-full rounded-full bg-black/10 px-4 py-4 pr-10 font-mono text-sm font-extralight text-green-300 outline-none transition placeholder:text-green-300 focus:bg-black/20 focus:ring focus:ring-green-700 max-lg:w-full"
            ref={inputRef}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-3 text-green-300 transition hover:text-green-500"
          >
            <LuSearch size={20} />
          </button>
        </div>

        {song && <SongView song={song} />}

        {isLoading && songUrl && (
          <div className="flex h-[400px] animate-spin items-center justify-center text-green-300">
            <LuLoader2 size={50} />
          </div>
        )}
      </div>
    </form>
  );
}
