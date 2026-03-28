
import { Box, Typography, IconButton, Divider } from "@mui/material";
import { Facebook, Instagram, Pinterest, LocationOn, MailOutline, Phone } from "@mui/icons-material";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import XIcon from '@mui/icons-material/X';
import Image from 'next/image';

export default function Footer() {
  return (
    <Box
      sx={{
        background: '#13CBA0',
        minHeight: 180,
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0',
        marginTop: 'auto',
      }}
    >
      <Box
        sx={{
          background: '#FCF6DE',
          borderRadius: '56px 56px 0 0',
          marginTop: '40px',
          width: 'clamp(70%, 95%, 80%))',
          minHeight: 160,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: { xs: '32px 16px', sm: '40px 32px', md: '48px 54px' },
          gap: { xs: 3, md: 0 },
        }}
      >
        {/* Logo Section */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          gap: 2,
          flex: { xs: 'none', sm: 7 },
          width: { xs: '100%', sm: 'auto' },
        }}>
          {/* Sun SVG Logo */}
          <Box sx={{
            width: { xs: 100, sm: 120, md: '10vw' },
            mr: { xs: 1, md: 2 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image 
              src="/Logo_sun.svg" 
              alt="Logo" 
              width={120} 
              height={120}
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
          {/* Logo Text */}
          <Typography
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem', md: 'clamp(3rem, 10vw, 11.5rem)' },
              fontFamily: "var(--font-syncopate)",
              fontWeight: 700,
              color: '#13CBA0',
              letterSpacing: 2,
              userSelect: 'none',
            }}
          >
            kard
          </Typography>
        </Box>

        {/* Divider - Vertical for sm+ */}
        <Divider orientation="vertical" flexItem sx={{ borderColor: '#F48CA0', borderRightWidth: 2, mx: 4, alignSelf: 'stretch', display: { xs: 'none', sm: 'block' } }} />

        {/* Divider - Horizontal for xs */}
        <Divider sx={{ borderColor: '#F48CA0', borderBottomWidth: 2, width: '80%', display: { xs: 'block', sm: 'none' } }} />

        {/* Contact & Social Section (column) */}
        <Box sx={{
          flex: { xs: 'none', sm: 3 },
          width: { xs: '100%', sm: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Contact Section */}
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 1, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' } }}>
            CONTACT US
          </Typography>
          <Box sx={{
            width: 'fit-content',
            minWidth: { xs: 'auto', sm: 260 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            mx: 'auto',
            gap: { xs: 1.5, sm: 2 },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationOn sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, color: '#222', mt: '2px' }} />
              <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' }, color: '#222', fontWeight: 'bold' }}>
                1 Thanon Chalong Krung,<br />Khwaeng Lam Prathew,<br />Lat Krabang, Bangkok 10520
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MailOutline sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, color: '#222' }} />
              <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' }, color: '#222', fontWeight: 'bold' }}>
                okard.support@okard.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, color: '#222' }} />
              <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' }, color: '#222', fontWeight: 'bold' }}>
                02-539-3541
              </Typography>
            </Box>
          </Box>
          {/* Social Section */}
          <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 1 } }}>
            <IconButton sx={{ color: '#3b5998' }} href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookRoundedIcon fontSize="medium" />
            </IconButton>
            <IconButton sx={{ color: '#222' }} href="https://www.x.com" target="_blank" rel="noopener noreferrer">
              <XIcon fontSize="medium" />
            </IconButton>
            <IconButton sx={{ color: '#E4405F' }} href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram fontSize="medium" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
