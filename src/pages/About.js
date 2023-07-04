import { Box } from '@mui/material'
import React from 'react'
import '../styles/about.css'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import WorkIcon from '@mui/icons-material/Work';


export default function About() {
    const details = {
        name: 'Sai Prudhvi Dappu',
        designation: 'Software Freelancer',
        phone: '+91 630 312 5378',
        mail: 'dspsaiprudhvi007@gmail.com',
        profile_img: '/Images/profile.jpg'
    }
    const features = {
        'User Accounts': [
            'Sign up and login using email IDs and passwords.',
            'User profile displaying account information.',
            'Update preferences.'
        ],
        'Dashboard': [
            'Browse titles using horizontally scrollable carousels.',
            'Categorized content by categories.'
        ],
        'Title View': [
            'View detailed information about a selected title.',
            'Synopsis, rating, release date, and description.',
        ],
        'Search': [
            'Search for various types of content like web series, movies, short films, documentaries.',
            'Integration with a third- party API like themoviedb.org for obtaining content data.'],
        'Watchlist': [
            'Add programs to a watchlist for later viewing.',
            'Autoplay feature for continuous watching.',
        ],
        'Rating': [
            'Allow users to rate programs with upvotes.'
        ],
        'Video Player': [
            'Play selected content on the platform.',
            'Skip intro feature.'
        ],
        'Payment and Subscription': [
            'Subscribe for accessing all app features.',
            'Provide a Pay Now button.'
        ],
        'About Us': [
            'Information about the features, and help desk details.'
        ]
    }
    const handleLink = (link) => {
        window.open(link)
    }
    return (
        <Box sx={{
            minHeight: '100vh',
            color: 'white',
            p: '5vh',
            pt: '15vh',
        }}>
            <Box sx={{ display: 'flex' }}>
                <Box className='about-profile-section' sx={{ width: '30%' }}>
                    <Box sx={{ fontSize: '3vh', opacity: '0.7' }}>Developed By</Box>
                    <Box className='about-profile-img'>
                        <img className='about-profile-img-blur' src={details.profile_img} />
                        <img className='about-profile-img-org' src={details.profile_img} />
                    </Box>
                    <Box sx={{ fontSize: '3vh' }}>{details.name}</Box>
                    <Box sx={{ cursor: 'unset' }} className='about-profile-links'><WorkIcon /> {details.designation}</Box>
                    <Box onClick={() => { handleLink('mailto:' + details.mail) }} className='about-profile-links'><AlternateEmailIcon /> {details.mail}</Box>
                    <Box onClick={() => { handleLink('tel:' + details.phone.replaceAll(' ', '')) }} className='about-profile-links'><CallIcon /> {details.phone}</Box>
                </Box>
                <Box sx={{ width: '70%' }}>
                    <Box sx={{ fontSize: '2.5vh', opacity: '0.8', py: '3vh' }}>Features</Box>
                    <Box sx={{ fontSize: '2vh' }}>{Object.keys(features).map(fet => {
                        return <Box>
                            <Box>{fet} :</Box>
                            <Box sx={{ fontSize: '1.7vh', opacity: '0.8', ml: '2vh' }}>{features[fet].map(sfet => <Box> • {sfet}</Box>)}</Box>
                        </Box>
                    })}</Box>
                </Box>
            </Box>
        </Box>
    )
}
