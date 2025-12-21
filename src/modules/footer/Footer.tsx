
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
        //   minWidth: 1000,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: { xs: '16px', md: '36px 54px' },
          gap: { xs: 2, md: 0 },
        }}
      >
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 7 }}>
          {/* Sun SVG Logo */}
          <Box sx={{ width: {xs:140, md:'10vw'}, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="Logo_sun.svg" alt="Logo" />
          </Box>
          {/* Logo Text */}
          <Typography
            sx={{
              fontSize: 'clamp(1rem, 10vw, 11.5rem)',
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

        {/* Divider */}
        <Divider orientation="vertical" flexItem sx={{ borderColor: '#F48CA0', borderRightWidth: 2, mx: 4, alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }} />

        {/* Contact & Social Section (column) */}
        <Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Contact Section */}
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 1, fontSize: {xs: '0.8rem' ,md:'1.2rem'} }}>
            CONTACT US
          </Typography>
          <Box sx={{
            width: 'fit-content',
            minWidth: 260,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            mx: 'auto',
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationOn sx={{ fontSize: "1.25rem", color: '#222', mt: '2px' }} />
              <Typography sx={{ fontSize: {xs: '0.7rem' ,md:'0.95rem'}, color: '#222', fontWeight: 'bold' }}>
                1 Thanon Chalong Krung,<br />Khwaeng Lam Prathew,<br />Lat Krabang, Bangkok 10520
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MailOutline sx={{ fontSize: "1.25rem", color: '#222' }} />
              <Typography sx={{ fontSize: {xs: '0.7rem' ,md:'0.95rem'}, color: '#222', fontWeight: 'bold' }}>
                okard.support@okard.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: "1.25rem", color: '#222' }} />
              <Typography sx={{ fontSize: {xs: '0.7rem' ,md:'0.95rem'}, color: '#222', fontWeight: 'bold' }}>
                02-539-3541
              </Typography>
            </Box>
          </Box>
          {/* Social Section */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
