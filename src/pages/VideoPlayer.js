import { Box, Button } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import '../styles/VideoPlayer.css'
import { getSingleMovie } from '../apis/Home';
import { addRecentlyWatched } from '../apis/SingleMovie';
const VideoPlayer = () => {
    const videoRef = useRef(null);
    const [currentSrc, setCurrentSrc] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [qualityChanged, setQualityChanged] = useState(-1);
    const [skipedIntro, setSkipIntro] = useState(false);
    const [videoData, setVideoData] = useState({})
    const [videos, setVideos] = useState([
        {
            type: 'low 360p',
            url: ''
        },
        {
            type: 'medium 480p',
            url: ''
        },
        {
            type: 'high 720p',
            url: ''
        },
    ])
    const handleQualityChange = (event) => {
        const quality = event.target.value;
        if (quality === 'low') {
            setCurrentSrc(videos[0].url);
        } else if (quality === 'medium') {
            setCurrentSrc(videos[1].url);
        } else if (quality === 'high') {
            setCurrentSrc(videos[2].url);
        }
        setCurrentTime(videoRef.current.currentTime);
        setQualityChanged(!qualityChanged)
    };
    const handleTimeSkip = (value) => {
        const time = parseInt(value, 10);
        setCurrentTime(time);
        videoRef.current.currentTime = time;
    };

    const handleLoadedMetadata = () => {
        console.log(currentTime)
        videoRef.current.currentTime = currentTime;
    };
    const handlePlay = () => {
        videoRef.current.play();
    };
    const changeSource = (vid_url, res) => {
        vid_url = vid_url.split('.')
        vid_url[0] = vid_url[0].slice(0, -4)
        if (vid_url[0][vid_url[0].length - 1] != '_')
            vid_url[0] += '_'
        vid_url[0] += res
        vid_url = vid_url.join('.')
        return vid_url
    }
    const handleControlsShow = () => {
        const divs = document.getElementsByClassName('video-controls-visibility')
        for (let i of divs) {
            i.classList.add('show-controls')
        }
    }
    const handleControlsHide = () => {
        const divs = document.getElementsByClassName('video-controls-visibility')
        for (let i of divs) {
            i.classList.remove('show-controls')
        }
    }
    const setPauseIcon = (cond) => {
        const div = document.getElementById('pause-icon')
        if (cond) {
            div.classList.add('show-controls')
        } else {
            div.classList.remove('show-controls')
        }
    }
    useEffect(() => {
        if (qualityChanged !== -1)
            handlePlay()
    }, [qualityChanged])

    useEffect(() => {
        let id = window.location.href.split('/').pop()
        getSingleMovie(id).then(dat => {
            let vid_url = dat.videoUrl
            const high = { type: 'high 720p', url: changeSource(vid_url, '720p') }
            const mid = { type: 'medium 480p', url: changeSource(vid_url, '480p') }
            const low = { type: 'low 360p', url: changeSource(vid_url, '360p') }
            console.log(low, mid, high)
            setVideos([low, mid, high])
            setCurrentSrc(high.url)
            setVideoData({ ...dat })
        })
        addRecentlyWatched(id)
        let nav = document.getElementsByClassName('nav-container')[0]
        nav.style.display = 'none'
        return () => {
            nav.style.display = 'flex'
        }
    }, [])
    return (
        <div>
            <Box className='video-player-container' sx={{ height: '100vh', width: '100vw' }}>
                <Box className='video-controls-visibility video-player-name'>
                    Now Playing : <span className='video-name-span'>{videoData.title}</span> (sample video for real netflix experince)
                </Box>
                <video onPause={() => { setPauseIcon(true); console.log('video paused') }} onPlay={() => { setPauseIcon(false) }} onMouseEnter={handleControlsShow} onMouseLeave={handleControlsHide} style={{ width: '100%', maxHeight: '90vh' }} className='video-player' ref={videoRef} src={currentSrc} controls
                    onLoadedMetadata={handleLoadedMetadata}>
                    Your browser does not support the video tag.
                </video>
                <Box onClick={handlePlay} id='pause-icon' className='video-player-pause-icon'><img src='/Images/PauseIcon.png'></img></Box>
                <div onMouseEnter={handleControlsShow} className='video-player-buttons video-controls-visibility'>
                    <select className='video-player-quality-options' id="quality" defaultValue={'high'} onChange={handleQualityChange}>
                        <option value="low">Low 360p</option>
                        <option value="medium">Medium 480p</option>
                        <option value="high">High 720p</option>
                    </select>
                </div>
                {!skipedIntro &&
                    <Button onMouseEnter={handleControlsShow} className='auth-button video-player-buttons skip-intro-button video-controls-visibility' onClick={() => { handleTimeSkip('60'); setSkipIntro(true) }}>
                        Skip Intro
                    </Button>}
            </Box>
        </div>
    );
};

export default VideoPlayer;
