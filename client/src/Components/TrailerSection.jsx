import React, { useState } from 'react'
import ReactPlayer from "react-player";
import { dummyTrailers } from '../assets/assets'
import { PlayCircleIcon } from 'lucide-react'
import BlurCircle from './BlurCircle'

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </p>

      {/* MAIN TRAILER */}
      <div className="relative mt-6">
        <BlurCircle top="-120px" right="-120px" className="z-0" />

        <div className="relative z-10 mx-auto max-w-[960px] h-[540px] rounded-xl overflow-hidden bg-black">
          <ReactPlayer
            key={currentTrailer.videoUrl}
            url={currentTrailer.videoUrl}
            light={currentTrailer.image}
            controls
            width="100%"
            height="100%"
          />
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="mt-8 flex gap-4 justify-center">
        {dummyTrailers.map((trailer) => (
          <button
            key={trailer.videoUrl}
            onClick={() => setCurrentTrailer(trailer)}
            className={`relative w-40 h-24 rounded-lg overflow-hidden transition
              ${currentTrailer.videoUrl === trailer.videoUrl
                ? 'ring-2 ring-red-500 scale-105'
                : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
          >
            <img
              src={trailer.image}
              alt="trailer"
              className="w-full h-full object-cover"
            />
            <PlayCircleIcon
              className="absolute inset-0 m-auto w-8 h-8 text-white"
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default TrailerSection
