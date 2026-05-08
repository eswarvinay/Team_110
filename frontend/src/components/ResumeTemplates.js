import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';

// ATS-Friendly Template (Optimized for parsing)
export const ATSFriendlyTemplate = ({ data }) => (
  <Box style={{ 
    padding: '40px', 
    backgroundColor: '#ffffff', 
    fontFamily: 'Arial, Calibri, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    color: '#000',
    lineHeight: '1.5'
  }}>
    <Typography variant="h5" style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>
      {data.name || 'Your Name'}
    </Typography>
    <Typography variant="body2" style={{ marginBottom: '15px', color: '#333' }}>
      Full Stack Developer
    </Typography>

    <Box style={{ marginBottom: '20px' }}>
      <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        PROFESSIONAL SUMMARY
      </Typography>
      <Typography variant="body2" style={{ color: '#333' }}>
        Results-driven developer with expertise in full-stack development using modern technologies.
      </Typography>
    </Box>

    <Box style={{ marginBottom: '20px' }}>
      <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        TECHNICAL SKILLS
      </Typography>
      <Typography variant="body2" style={{ color: '#333' }}>
        JavaScript, React, Node.js, MongoDB, Express, HTML, CSS, REST APIs, Git
      </Typography>
    </Box>

    {data.certifications && data.certifications.length > 0 && (
      <Box style={{ marginBottom: '20px' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
          CERTIFICATIONS
        </Typography>
        {data.certifications.map((cert, i) => (
          <Typography key={i} variant="body2" style={{ color: '#333' }}>
            {cert}
          </Typography>
        ))}
      </Box>
    )}

    {data.profiles && (
      <Box>
        <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
          PROFILES
        </Typography>
        {data.profiles.github && <Typography variant="body2">GitHub: {data.profiles.github}</Typography>}
        {data.profiles.linkedin && <Typography variant="body2">LinkedIn: {data.profiles.linkedin}</Typography>}
        {data.profiles.leetcode && <Typography variant="body2">LeetCode: {data.profiles.leetcode}</Typography>}
      </Box>
    )}
  </Box>
);

// Fresher/Student Template
export const FresherTemplate = ({ data }) => (
  <Box style={{
    padding: '40px',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    <Box style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', marginBottom: '20px' }}>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
        {data.name || 'Your Name'}
      </Typography>
      <Typography variant="body2" style={{ color: '#666', marginTop: '5px' }}>
        Fresh Graduate | Tech Enthusiast
      </Typography>
    </Box>

    <Box style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '15px' }}>
      <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
        👨‍🎓 ABOUT ME
      </Typography>
      <Typography variant="body2" style={{ color: '#555' }}>
        Enthusiastic fresher eager to apply technical skills and contribute to innovative projects. Quick learner with strong fundamentals in web development.
      </Typography>
    </Box>

    <Box style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '15px' }}>
      <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
        💻 SKILLS
      </Typography>
      <Typography variant="body2" style={{ color: '#555' }}>
        React • JavaScript • HTML/CSS • Node.js • MongoDB • Git • Problem Solving
      </Typography>
    </Box>

    {data.certifications && data.certifications.length > 0 && (
      <Box style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '15px' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
          🏆 CERTIFICATIONS
        </Typography>
        <Box component="ul" style={{ margin: 0, paddingLeft: '20px' }}>
          {data.certifications.map((cert, i) => (
            <Typography component="li" key={i} variant="body2" style={{ color: '#555' }}>
              {cert}
            </Typography>
          ))}
        </Box>
      </Box>
    )}

    {data.profiles && (
      <Box style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
          🔗 PROFILES & LINKS
        </Typography>
        <Box style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {data.profiles.github && (
            <Typography variant="body2" style={{ color: '#1e40af' }}>
              🔹 GitHub: {data.profiles.github}
            </Typography>
          )}
          {data.profiles.linkedin && (
            <Typography variant="body2" style={{ color: '#1e40af' }}>
              🔹 LinkedIn: {data.profiles.linkedin}
            </Typography>
          )}
        </Box>
      </Box>
    )}
  </Box>
);

// Developer-Focused Template
export const DeveloperTemplate = ({ data }) => (
  <Box style={{
    padding: '40px',
    backgroundColor: '#1e1e1e',
    fontFamily: '"Courier New", monospace',
    maxWidth: '800px',
    margin: '0 auto',
    color: '#e0e0e0'
  }}>
    <Box style={{ borderBottom: '2px solid #00ff00', paddingBottom: '20px', marginBottom: '25px' }}>
      <Typography variant="h3" style={{ fontWeight: 'bold', margin: 0, color: '#00ff00' }}>
        {data.name || 'Your Name'}
      </Typography>
      <Typography variant="body2" style={{ color: '#888', marginTop: '5px' }}>
        &gt; Full Stack Developer | Open Source Enthusiast
      </Typography>
    </Box>

    <Box style={{ marginBottom: '25px' }}>
      <Typography variant="h6" style={{ color: '#00ff00', fontWeight: 'bold', marginBottom: '10px' }}>
        $ cat skills.txt
      </Typography>
      <Typography variant="body2" style={{ color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
        Languages: JavaScript, Python, TypeScript{'\n'}
        Frontend: React, Redux, HTML5, CSS3{'\n'}
        Backend: Node.js, Express, MongoDB{'\n'}
        Tools: Git, Docker, REST APIs, GraphQL{'\n'}
        Platforms: GitHub, Linux, AWS
      </Typography>
    </Box>

    {data.certifications && data.certifications.length > 0 && (
      <Box style={{ marginBottom: '25px' }}>
        <Typography variant="h6" style={{ color: '#00ff00', fontWeight: 'bold', marginBottom: '10px' }}>
          $ ls certifications/
        </Typography>
        {data.certifications.map((cert, i) => (
          <Typography key={i} variant="body2" style={{ color: '#e0e0e0' }}>
            • {cert}
          </Typography>
        ))}
      </Box>
    )}

    {data.profiles && (
      <Box>
        <Typography variant="h6" style={{ color: '#00ff00', fontWeight: 'bold', marginBottom: '10px' }}>
          $ connect --social
        </Typography>
        <Box style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {data.profiles.github && (
            <Typography variant="body2" style={{ color: '#00ff00' }}>
              github.com/{data.profiles.github}
            </Typography>
          )}
          {data.profiles.linkedin && (
            <Typography variant="body2" style={{ color: '#00ff00' }}>
              linkedin.com/in/{data.profiles.linkedin}
            </Typography>
          )}
          {data.profiles.leetcode && (
            <Typography variant="body2" style={{ color: '#00ff00' }}>
              leetcode.com/u/{data.profiles.leetcode}
            </Typography>
          )}
        </Box>
      </Box>
    )}
  </Box>
);

// Data Analyst Template
export const DataAnalystTemplate = ({ data }) => (
  <Box style={{
    padding: '40px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    <Box style={{
      background: 'linear-gradient(90deg, #1e40af 0%, #dc2626 100%)',
      color: 'white',
      padding: '25px',
      borderRadius: '8px',
      marginBottom: '30px'
    }}>
      <Typography variant="h4" style={{ fontWeight: 'bold', margin: 0 }}>
        {data.name || 'Your Name'}
      </Typography>
      <Typography variant="body2" style={{ marginTop: '5px', opacity: 0.9 }}>
        Data Analyst | Business Intelligence | Analytics
      </Typography>
    </Box>

    <Box style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
      <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
        📊 ANALYTICAL EXPERTISE
      </Typography>
      <Typography variant="body2" style={{ color: '#555' }}>
        Data Analysis • SQL Queries • Python • Tableau • Power BI • Excel • Dashboard Creation • Business Intelligence
      </Typography>
    </Box>

    <Box style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
      <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
        💼 TOOLS & TECHNOLOGIES
      </Typography>
      <Typography variant="body2" style={{ color: '#555' }}>
        SQL • Python • R • Tableau • Power BI • Excel • Google Analytics • Data Visualization
      </Typography>
    </Box>

    {data.certifications && data.certifications.length > 0 && (
      <Box style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
          🏅 CERTIFICATIONS
        </Typography>
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {data.certifications.map((cert, i) => (
            <Box key={i} style={{
              backgroundColor: '#f0f4f8',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #1e40af',
              color: '#1e40af',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              ✓ {cert}
            </Box>
          ))}
        </Box>
      </Box>
    )}

    {data.profiles && (
      <Box style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '10px' }}>
          🔗 PROFESSIONAL LINKS
        </Typography>
        <Box style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {data.profiles.linkedin && (
            <Typography variant="body2" style={{ color: '#1e40af', textDecoration: 'underline' }}>
              LinkedIn
            </Typography>
          )}
          {data.profiles.github && (
            <Typography variant="body2" style={{ color: '#1e40af', textDecoration: 'underline' }}>
              GitHub
            </Typography>
          )}
        </Box>
      </Box>
    )}
  </Box>
);

// Modern Template
export const ModernTemplate = ({ data }) => (
  <Box style={{ 
    padding: '40px', 
    backgroundColor: '#f8f9fa', 
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    {/* Header */}
    <Box style={{ 
      borderLeft: '5px solid #667eea',
      paddingLeft: '20px',
      marginBottom: '30px'
    }}>
      <Typography variant="h3" style={{ fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>
        {data.name || 'Your Name'}
      </Typography>
      <Typography variant="h6" style={{ color: '#667eea', margin: 0 }}>
        Full Stack Developer
      </Typography>
    </Box>

    {/* Professional Summary */}
    <Box style={{ marginBottom: '30px' }}>
      <Typography variant="h5" style={{ 
        fontWeight: 'bold', 
        color: '#333', 
        borderBottom: '2px solid #667eea',
        paddingBottom: '10px',
        marginBottom: '15px'
      }}>
        PROFESSIONAL SUMMARY
      </Typography>
      <Typography variant="body1" style={{ color: '#555', lineHeight: '1.6' }}>
        Results-driven developer with expertise in building modern web applications using cutting-edge technologies. Passionate about creating user-friendly solutions and continuous learning.
      </Typography>
    </Box>

    {/* Technical Skills */}
    <Box style={{ marginBottom: '30px' }}>
      <Typography variant="h5" style={{ 
        fontWeight: 'bold', 
        color: '#333', 
        borderBottom: '2px solid #667eea',
        paddingBottom: '10px',
        marginBottom: '15px'
      }}>
        TECHNICAL SKILLS
      </Typography>
      <Box style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px' 
      }}>
        <div>
          <Typography variant="body2" style={{ fontWeight: 'bold', color: '#333' }}>Frontend</Typography>
          <Typography variant="body2" style={{ color: '#666' }}>React, JavaScript, HTML, CSS</Typography>
        </div>
        <div>
          <Typography variant="body2" style={{ fontWeight: 'bold', color: '#333' }}>Backend</Typography>
          <Typography variant="body2" style={{ color: '#666' }}>Node.js, Express, MongoDB</Typography>
        </div>
      </Box>
    </Box>

    {/* Certifications */}
    {data.certifications && data.certifications.length > 0 && (
      <Box style={{ marginBottom: '30px' }}>
        <Typography variant="h5" style={{ 
          fontWeight: 'bold', 
          color: '#333', 
          borderBottom: '2px solid #667eea',
          paddingBottom: '10px',
          marginBottom: '15px'
        }}>
          CERTIFICATIONS
        </Typography>
        <Box component="ul" style={{ margin: 0, paddingLeft: '20px' }}>
          {data.certifications.map((cert, i) => (
            <Typography component="li" key={i} variant="body2" style={{ color: '#555', marginBottom: '5px' }}>
              {cert}
            </Typography>
          ))}
        </Box>
      </Box>
    )}

    {/* Professional Profiles */}
    {data.profiles && (
      <Box style={{ marginBottom: '30px' }}>
        <Typography variant="h5" style={{ 
          fontWeight: 'bold', 
          color: '#333', 
          borderBottom: '2px solid #667eea',
          paddingBottom: '10px',
          marginBottom: '15px'
        }}>
          PROFILES
        </Typography>
        <Box style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {data.profiles.github && (
            <Box>
              <Typography variant="body2" style={{ fontWeight: 'bold', color: '#333' }}>GitHub</Typography>
              <Typography variant="body2" style={{ color: '#667eea' }}>{data.profiles.github}</Typography>
            </Box>
          )}
          {data.profiles.linkedin && (
            <Box>
              <Typography variant="body2" style={{ fontWeight: 'bold', color: '#333' }}>LinkedIn</Typography>
              <Typography variant="body2" style={{ color: '#667eea' }}>{data.profiles.linkedin}</Typography>
            </Box>
          )}
          {data.profiles.leetcode && (
            <Box>
              <Typography variant="body2" style={{ fontWeight: 'bold', color: '#333' }}>LeetCode</Typography>
              <Typography variant="body2" style={{ color: '#667eea' }}>{data.profiles.leetcode}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    )}

    <Typography variant="caption" style={{ color: '#999' }}>
      Generated with AI Resume Video Builder
    </Typography>
  </Box>
);

// Professional Template
export const ProfessionalTemplate = ({ data }) => (
  <Box style={{
    padding: '50px',
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    fontFamily: 'Georgia, serif',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    {/* Header */}
    <Box style={{ textAlign: 'center', marginBottom: '40px' }}>
      <Typography variant="h2" style={{ fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 10px 0' }}>
        {data.name || 'Your Name'}
      </Typography>
      <Divider style={{ margin: '20px 0', backgroundColor: '#1a1a1a' }} />
      <Typography variant="body2" style={{ color: '#666', letterSpacing: '2px' }}>
        FULL STACK DEVELOPER | SOFTWARE ENGINEER
      </Typography>
    </Box>

    {/* About */}
    <Box style={{ marginBottom: '40px' }}>
      <Typography variant="h6" style={{ 
        fontWeight: 'bold', 
        color: '#1a1a1a',
        marginBottom: '15px',
        textTransform: 'uppercase',
        fontSize: '14px',
        letterSpacing: '1px'
      }}>
        Professional Profile
      </Typography>
      <Typography variant="body2" style={{ color: '#555', lineHeight: '1.8' }}>
        Dedicated software developer with strong foundation in modern web technologies. Experienced in full-stack development with focus on clean code and user experience.
      </Typography>
    </Box>

    {/* Core Competencies */}
    <Box style={{ marginBottom: '40px' }}>
      <Typography variant="h6" style={{ 
        fontWeight: 'bold', 
        color: '#1a1a1a',
        marginBottom: '15px',
        textTransform: 'uppercase',
        fontSize: '14px',
        letterSpacing: '1px'
      }}>
        Core Competencies
      </Typography>
      <Typography variant="body2" style={{ color: '#555', lineHeight: '1.8' }}>
        JavaScript • React • Node.js • MongoDB • Express • HTML/CSS • RESTful APIs • Database Design
      </Typography>
    </Box>

    {/* Certifications */}
    {data.certifications && data.certifications.length > 0 && (
      <Box style={{ marginBottom: '40px' }}>
        <Typography variant="h6" style={{ 
          fontWeight: 'bold', 
          color: '#1a1a1a',
          marginBottom: '15px',
          textTransform: 'uppercase',
          fontSize: '14px',
          letterSpacing: '1px'
        }}>
          Certifications & Achievements
        </Typography>
        <Box component="ul" style={{ margin: 0, paddingLeft: '30px' }}>
          {data.certifications.map((cert, i) => (
            <typography component="li" key={i} variant="body2" style={{ color: '#555', marginBottom: '8px' }}>
              {cert}
            </typography>
          ))}
        </Box>
      </Box>
    )}

    {/* Professional Links */}
    {data.profiles && (
      <Box style={{ marginBottom: '40px' }}>
        <Typography variant="h6" style={{ 
          fontWeight: 'bold', 
          color: '#1a1a1a',
          marginBottom: '15px',
          textTransform: 'uppercase',
          fontSize: '14px',
          letterSpacing: '1px'
        }}>
          Professional Links
        </Typography>
        <Typography variant="body2" style={{ color: '#555', lineHeight: '1.8' }}>
          {[
            data.profiles.github && `GitHub: ${data.profiles.github}`,
            data.profiles.linkedin && `LinkedIn: ${data.profiles.linkedin}`,
            data.profiles.leetcode && `LeetCode: ${data.profiles.leetcode}`
          ].filter(Boolean).join(' | ')}
        </Typography>
      </Box>
    )}
  </Box>
);

// Creative Template
export const CreativeTemplate = ({ data }) => (
  <Box style={{
    padding: '40px',
    backgroundColor: '#fafafa',
    fontFamily: 'Verdana, sans-serif',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    {/* Header with gradient-like background */}
    <Box style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '10px',
      marginBottom: '30px',
      textAlign: 'center'
    }}>
      <Typography variant="h2" style={{ fontWeight: 'bold', margin: 0, color: 'white' }}>
        {data.name || 'Your Name'}
      </Typography>
      <Typography variant="body1" style={{ marginTop: '10px', color: 'rgba(255,255,255,0.9)' }}>
        Creative Developer | Problem Solver
      </Typography>
    </Box>

    {/* Overview */}
    <Box style={{ 
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '30px'
    }}>
      <Card style={{ boxShadow: '0 2px 8px rgba(102,126,234,0.2)' }}>
        <CardContent style={{ padding: '20px' }}>
          <Typography variant="h6" style={{ color: '#667eea', fontWeight: 'bold', marginBottom: '10px' }}>
            🎯 Focus Areas
          </Typography>
          <Typography variant="body2" style={{ color: '#555' }}>
            Frontend Development, User Experience, Full Stack Solutions
          </Typography>
        </CardContent>
      </Card>

      <Card style={{ boxShadow: '0 2px 8px rgba(102,126,234,0.2)' }}>
        <CardContent style={{ padding: '20px' }}>
          <Typography variant="h6" style={{ color: '#667eea', fontWeight: 'bold', marginBottom: '10px' }}>
            💻 Tech Stack
          </Typography>
          <Typography variant="body2" style={{ color: '#555' }}>
            React, Node.js, MongoDB, JavaScript
          </Typography>
        </CardContent>
      </Card>
    </Box>

    {/* Highlights */}
    <Box style={{ marginBottom: '30px' }}>
      <Typography variant="h5" style={{ 
        color: '#667eea',
        fontWeight: 'bold',
        marginBottom: '15px',
        fontSize: '18px'
      }}>
        ⭐ Key Highlights
      </Typography>
      <Box style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid #667eea'
      }}>
        <Typography variant="body2" style={{ color: '#555', lineHeight: '1.8' }}>
          Passionate developer committed to continuous learning and delivering high-quality software solutions. Experienced in building responsive web applications with modern technologies.
        </Typography>
      </Box>
    </Box>

    {/* Certifications */}
    {data.certifications && data.certifications.length > 0 && (
      <Box style={{ marginBottom: '30px' }}>
        <Typography variant="h5" style={{ 
          color: '#667eea',
          fontWeight: 'bold',
          marginBottom: '15px',
          fontSize: '18px'
        }}>
          🏆 Certifications
        </Typography>
        <Box style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {data.certifications.map((cert, i) => (
            <Box key={i} style={{
              backgroundColor: 'white',
              padding: '10px 15px',
              borderRadius: '20px',
              border: '1px solid #667eea',
              color: '#667eea',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {cert}
            </Box>
          ))}
        </Box>
      </Box>
    )}

    {/* Social Links */}
    {data.profiles && (
      <Box style={{ marginBottom: '20px' }}>
        <Typography variant="h5" style={{ 
          color: '#667eea',
          fontWeight: 'bold',
          marginBottom: '15px',
          fontSize: '18px'
        }}>
          🔗 Connect
        </Typography>
        <Box style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          {data.profiles.github && (
            <Box style={{
              backgroundColor: '#333',
              padding: '8px 15px',
              borderRadius: '5px',
              color: 'white',
              fontSize: '12px'
            }}>
              GitHub: {data.profiles.github}
            </Box>
          )}
          {data.profiles.linkedin && (
            <Box style={{
              backgroundColor: '#0077b5',
              padding: '8px 15px',
              borderRadius: '5px',
              color: 'white',
              fontSize: '12px'
            }}>
              LinkedIn: {data.profiles.linkedin}
            </Box>
          )}
          {data.profiles.leetcode && (
            <Box style={{
              backgroundColor: '#ffa116',
              padding: '8px 15px',
              borderRadius: '5px',
              color: 'white',
              fontSize: '12px'
            }}>
              LeetCode: {data.profiles.leetcode}
            </Box>
          )}
        </Box>
      </Box>
    )}
  </Box>
);

// Minimalist Template
export const MinimalistTemplate = ({ data }) => (
  <Box style={{
    padding: '35px',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: '1.6'
  }}>
    {/* Name */}
    <Typography variant="h4" style={{ 
      fontWeight: '300',
      color: '#2c3e50',
      margin: '0 0 5px 0',
      fontSize: '36px',
      letterSpacing: '0.5px'
    }}>
      {data.name || 'Your Name'}
    </Typography>

    {/* Title */}
    <Box style={{
      height: '2px',
      backgroundColor: '#3498db',
      marginBottom: '25px',
      width: '100px'
    }}></Box>

    {/* Intro */}
    <Typography variant="body2" style={{ color: '#555', marginBottom: '30px' }}>
      Dedicated full-stack developer focused on creating elegant, performant applications.
    </Typography>

    {/* Skills */}
    <Box style={{ marginBottom: '30px' }}>
      <Typography style={{ 
        fontWeight: 'bold', 
        color: '#2c3e50',
        marginBottom: '10px',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Skills
      </Typography>
      <Typography variant="body2" style={{ color: '#555' }}>
        React • JavaScript • Node.js • MongoDB • Express • Full-stack Development
      </Typography>
    </Box>

    {/* Certifications */}
    {data.certifications && data.certifications.length > 0 && (
      <Box style={{ marginBottom: '30px' }}>
        <Typography style={{ 
          fontWeight: 'bold', 
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Certifications
        </Typography>
        <Box component="ul" style={{ margin: 0, paddingLeft: '20px' }}>
          {data.certifications.map((cert, i) => (
            <Typography component="li" key={i} variant="body2" style={{ color: '#555', marginBottom: '5px' }}>
              {cert}
            </Typography>
          ))}
        </Box>
      </Box>
    )}

    {/* Links */}
    {data.profiles && (
      <Box>
        <Typography style={{ 
          fontWeight: 'bold', 
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Links
        </Typography>
        <Box style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {data.profiles.github && (
            <Typography variant="body2" style={{ color: '#3498db' }}>
              github.com/{data.profiles.github}
            </Typography>
          )}
          {data.profiles.linkedin && (
            <Typography variant="body2" style={{ color: '#3498db' }}>
              linkedin.com/in/{data.profiles.linkedin}
            </Typography>
          )}
          {data.profiles.leetcode && (
            <Typography variant="body2" style={{ color: '#3498db' }}>
              leetcode/{data.profiles.leetcode}
            </Typography>
          )}
        </Box>
      </Box>
    )}
  </Box>
);
