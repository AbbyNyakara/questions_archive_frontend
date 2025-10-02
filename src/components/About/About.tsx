import './about.css'
import { Card, CardContent, CardHeader, Typography, Grid } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'

const About = () => {
  return (
    <section className='about'>
      <h2 className='about-intro'>Welcome to the Questions Library</h2>
      <p className='about-description'>
        A centralized collection of survey questions and past questionnaires,
        covering research and data collection efforts from rounds 1 through 10.
      </p>

      <Grid className='about-features' container spacing={2}>
        <Card
          className='feature-card'
          sx={{
            background: '#fff',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
            },
          }}
        >
          <CardHeader
            sx={{ margin: 'auto', display: 'block' }}
            className='feature-card-icon'
            avatar={
              <SearchIcon
                sx={{ fontSize: 45, margin: 'auto', display: 'block' }}
              />
            }
          />
          <CardContent>
            <Typography
              className='card-heading'
              variant='h6'
              sx={{
                fontFamily: "'Oswald', Helvetica, sans-serif",
                fontWeight: 'bold',
              }}
            >
              Easy Search
            </Typography>
            <Typography
              variant='body2'
              sx={{ fontFamily: "'Montserrat', Helvetica, sans-serif" }}
            >
              Find questions quickly with our search and filtering
              tools.
            </Typography>
          </CardContent>
        </Card>

        <Card
          className='feature-card'
          sx={{
            background: '#fff',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
            },
          }}
        >
          <CardHeader
            sx={{ margin: 'auto', display: 'block' }}
            className='feature-card-icon'
            avatar={
              <DownloadIcon
                sx={{ fontSize: 40, margin: 'auto', display: 'block' }}
              />
            }
          />
          <CardContent>
            <Typography
              className='card-heading'
              variant='h6'
              sx={{
                fontFamily: "'Oswald', Helvetica, sans-serif",
                fontWeight: 'bold',
              }}
            >
              Export Options
            </Typography>
            <Typography
              variant='body2'
              sx={{ fontFamily: "'Montserrat', Helvetica, sans-serif" }}
            >
              Download questions in various formats for your research needs.
            </Typography>
          </CardContent>
        </Card>

        <Card
          className='feature-card'
          sx={{
            background: '#fff',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
            },
          }}
        >
          <CardHeader
            sx={{ margin: 'auto', display: 'block' }}
            className='feature-card-icon'
            avatar={
              <ShareIcon
                sx={{ fontSize: 40, margin: 'auto', display: 'block' }}
              />
            }
          />
          <CardContent>
            <Typography
              className='card-heading'
              variant='h6'
              sx={{
                fontFamily: "'Oswald', Helvetica, sans-serif",
                fontWeight: 'bold',
              }}
            >
              Share
            </Typography>
            <Typography
              variant='body2'
              sx={{ fontFamily: "'Montserrat', Helvetica, sans-serif" }}
            >
              Share question sets with your team and collaborate in real-time.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </section>
  )
}

export default About

// NOTE TO SELF 
// Check out the paper component in mui - THE TYPOGRAPHY