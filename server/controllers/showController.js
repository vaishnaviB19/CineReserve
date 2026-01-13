import axios from "axios"
import Movie from "../models/Movie.js";
import Show from '../models/Show.js'
import { err } from "inngest/types";
import { inngest } from "../inngest/index.js";

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req,res)=>{
   try {
    const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
        headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
    })

    const movies = data.results;
    res.json({success: true, movies:movies})
   } catch (error) {
      console.log(error);
      res.json({success: false, message:error.message})
   }
}

//API to add a new show to the database
export const addShow = async (req, res) => {
  try {

    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "TMDB movieId is missing",
      });
    }

    if (!showsInput?.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid showsInput",
      });
    }

    let movie = await Movie.findOne({ tmdbId: movieId });

    if (!movie) {
      const [movieDetailsRes, movieCreditsRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsRes.data;
      const movieCreditsData = movieCreditsRes.data;

if (!movie) {
  movie = await Movie.create({
    tmdbId: movieId,
    title: movieApiData.title,
    overview: movieApiData.overview,
    poster_path: movieApiData.poster_path,
    backdrop_path: movieApiData.backdrop_path,
    genres: movieApiData.genres,
    casts: movieCreditsData.cast,
    release_date: movieApiData.release_date,
    original_language: movieApiData.original_language,
    tagline: movieApiData.tagline || "",
    vote_average: movieApiData.vote_average,
    runtime: movieApiData.runtime,
  });
}

    }

    const showsToCreate = showsInput.map(({ date, time }) => ({
      movie: movie._id,
      showDateTime: new Date(`${date}T${time}`),
      showPrice,
      occupiedSeats: {},
    }));
    
    if(showsToCreate.length >0){
    await Show.insertMany(showsToCreate);
    }

    //trigger inngest event
    await inngest.send({
      name: "app/show.added",
      data:{movieTitle: movie.title}
    })

    res.json({ success: true, message: "Show added successfully" });
  } catch (error) {
    console.error("ADD SHOW ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




//API to get all shows from the database

export const getShows = async (req,res) =>{
   try {
      const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime:1});

      //filter unique shows
      const uniqueShows = new Set(shows.map(show => show.movie))

      res.json({success: true, shows: Array.from(uniqueShows)})

   } catch (error) {
      console.error(error);
      res.json({success: false, message: error.message});
   }
}


//API to get single show from the database
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);

    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) dateTime[date] = [];
      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
