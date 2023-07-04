import axios from 'axios'
import { hideLoader, showLoader } from '../components/common_functions'
import { toast } from 'react-toastify'

const paths = {
    all_movies: '/content'
}
var allMovieData = []

// All Movies Fetch
const getAllMovies = async () => {
    showLoader()
    const user = localStorage.getItem('access')
    var headers = {}
    if (user) {
        headers.Authorization = user
    }
    return await axios.get(process.env.REACT_APP_BACKEND_URL + paths.all_movies, { headers: headers }).then(res => {
        hideLoader()
        allMovieData = res.data.content
        return res
    }).catch(er => {
        hideLoader()
        toast.error(er.response.data)
        console.log(er)
    })
}

const getSingleMovie = async (id) => {
    showLoader()
    const movie = allMovieData.find((o, i) => { return o._id == id })
    if (movie) {
        hideLoader()
        return movie
    } else {
        return await axios.get(process.env.REACT_APP_BACKEND_URL + paths.all_movies + '/' + id,).then(res => {
            hideLoader()
            return res.data
        }).catch(er => {
            hideLoader()
            toast.error(er.response.data)
            console.log(er)
        })
    }
}
const getRecentlyWatched = async (param) => {
    showLoader()
    const user = localStorage.getItem('access')
    var headers = {}
    if (user) {
        headers.Authorization = user
    }
    return await axios.get(process.env.REACT_APP_BACKEND_URL + paths.all_movies, { headers: headers }).then(res => {
        hideLoader()
        allMovieData = res.data.content
        return res.data[param]
    }).catch(er => {
        hideLoader()
        console.log(er)
        return -1
    })
}
export { getAllMovies, getSingleMovie, getRecentlyWatched }