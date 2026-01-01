const searchBtn = document.getElementById('search-btn')
const movieNameInput = document.getElementById('movie-name-input')
const movieCont = document.getElementById('movie-container')

if (searchBtn) {
    searchBtn.addEventListener("click", async function() {
        let movieName = movieNameInput.value;
        console.log(movieName) 
        const movies = await searchForMovieByTitle(movieName);

        const moviesIds = movies.Search.map(movie => movie.imdbID)
        renderMovies(moviesIds)
    })
}

async function searchForMovieByTitle(title) {
    const url = `http://www.omdbapi.com/?s=${title}&apikey=5446541`
    
    const response = await fetch(url);
    const data = await response.json();

    return data; // a promise to the data
}

export async function  getMovieFullData(movieId) {
    const url = `http://www.omdbapi.com/?i=${movieId}&apikey=5446541`
    const response = await fetch(url);
    const data = await response.json();
    return data;
}




export async function renderMovies(moviesIds) {

    const moviePromise = moviesIds.map(moviedId => getMovieFullData(moviedId));
    // console.log("Movie returend from moviepromise", moviePromise)
    const movieWithDetails = await Promise.all(moviePromise);
    // console.log("movies returned from promise all", movieWithDetails)
    const movieHTML = movieWithDetails.map(movie => {
        // console.log("Movie: ", movie);
        return ` 
        <div id="movie-card-cont" class="movie-card-cont">

                <div class="movie-card">

                    <img src="${movie.Poster}" alt="movie picture">

                    <div class="movie-description">

                        <div class="title-and-rating" >
                            <h2 class="movie-title" >${movie.Title}</h2>
                            <p class="movie-rating" >⭐${movie.imdbRating}</p>
                        </div>
                        

                        <div class="movie-category"> 
                            <p class="duration">${movie.Runtime} m</p>
                            <p>${movie.Genre}</p>

                            <button id="add-to-wathclist-btn" 
                                    class="add-to-wathclist-btn"
                                    data-imdb-id=${movie.imdbID}> <i class="fas fa-plus-circle"></i>    
                            Watchlist
                            </button>
                        </div>

                        <p class="desc-text" >${movie.Plot}</p>

                    </div>
                </div>             
        
        `

    }).join(' ')
        
    
    // console.log("Movies all out: ", moviesHTMl)
    movieCont.innerHTML = movieHTML;
}

async function renderMovies2(movies) {
    let moviesHTMl = '' 
    await movies.forEach(async function(movieToFind) {
        const movie = await getMovieFullData(movieToFind.imdbID);
        console.log(movie)
        let movieHTML = `
                <div id="movie-card-cont" class="movie-card-cont">

                <div class="movie-card">

                    <img src="${movie.Poster}" alt="movie picture">

                    <div class="movie-description">

                        <div class="title-and-rating" >
                            <h2 class="movie-title" >${movie.Title}</h2>
                            <p class="movie-rating" >⭐${movie.imdbRating}</p>
                        </div>
                        

                        <div class="movie-category"> 
                            <p class="duration">${movie.Runtime} m</p>
                            <p>${movie.Genre}</p>

                            <button id="add-to-wathclist-btn" class="add-to-wathclist-btn"> <i class="fas fa-plus-circle"></i>    Watchlist</button>
                        </div>

                        <p class="desc-text" >${movie.Plot}</p>

                    </div>
                </div>             
        
        `
        console.log(movieHTML)
        moviesHTMl += movieHTML;
        console.log("Movies all", moviesHTMl)

    })
    console.log("Movies all out: ", moviesHTMl)
    movieCont.innerHTML = moviesHTMl;
}

document.addEventListener('click', function(event) {
    const movieId = event.target.dataset.imdbId;
    if (movieId) {
        console.log("Id of the movie that added to the watchlist: ", event.target.dataset.imdbId)

        let movieList = JSON.parse(localStorage.getItem('movieList'));

        console.log("Movies that in local storage: ", movieList)

        if (movieList) {
            movieList.push(movieId)
            localStorage.setItem("movieList", JSON.stringify(movieList))
        } else {
            let moviesArr = [movieId];
            localStorage.setItem("movieList", JSON.stringify(moviesArr))
        }
    }
})