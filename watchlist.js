 
import { renderMovies } from "./index.js";

document.addEventListener("DOMContentLoaded", function() {
    const movieIDsList = JSON.parse(localStorage.getItem('movieList'));
    if (movieIDsList) {
        renderMovies(movieIDsList)
    }
})