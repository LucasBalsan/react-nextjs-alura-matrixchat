import appConfig from '../config.json'
import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import { useRouter } from "next/router";
import React from 'react';

function Title(props) {
  const Tag = props.Tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>

      <style jsx>{`
      ${Tag} {
        color: ${appConfig.theme.colors.primary['500']};
        font-size: 24px;
        font-weight: 600;
      }
      `}</style>
    </>
  )
}

export default function HomePage() {
  const [username, setUserName] = React.useState('')
  const useRotas = useRouter()

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundRepeat: 'no-repeat', 
          backgroundColor: appConfig.theme.colors.primary[900],   
          // backgroundSize: 'auto', 
          // backgroundBlendMode: 'normal',
          // backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',                  
        }}
      >
        <Box
          styleSheet={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '700px', 
            borderRadius: '5px', padding: '32px', margin: '16px', boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)', 
            backgroundColor: appConfig.theme.colors.neutrals[700], flexDirection: { xs: 'column', sm: 'row', },        
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={(event) => {
              event.preventDefault()
              useRotas.push(username ? `./chat?username=${username}` : '/')
            }}
            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>              
            </Text>

            <TextField
              onChange={(event) => {
                setUserName(event.target.value)
              }}
              value={username}
              placeholder='Informe o usuario do Git'
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />

            <Button
              type='submit'
              label='Entrar'
              fullWidth
              buttonColors={{                
                contrastColor: appConfig.theme.colors.neutrals[900],
                mainColor: appConfig.theme.colors.primary[900],                
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[400],                
              }}              
            />
          </Box>
          {/* Formulário */}


          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '200px', padding: '16px', border: '1px solid',
              backgroundColor: appConfig.theme.colors.neutrals[800], borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px', flex: 1, minHeight: '240px',
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%', marginBottom: '16px',
              }}
              src={username ? `https://github.com/${username}.png` : ''}
            />
            <Text
              variant="body4"              
              styleSheet={{
                color: appConfig.theme.colors.primary[900], backgroundColor: appConfig.theme.colors.neutrals[900], 
                padding: '3px 10px', borderRadius: '1000px'
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}