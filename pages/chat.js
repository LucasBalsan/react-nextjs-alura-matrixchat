import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'
import { ButtonSendGif } from '../src/components/ButtonSendGif'

const supabase = createClient(appConfig.utilities.Supabase.Url, appConfig.utilities.Supabase.AnnonKey)

function sincronizaMensagensRealTime(adicionaMensagem) {
  return supabase
    .from('chat')
    .on('INSERT', (novaMensagem) => {
      adicionaMensagem(novaMensagem.new)
    })
    .subscribe()
}


export default function PaginaChat() {
  const useRotas = useRouter()
  const usuarioLogado = useRotas.query.username
  const [mensagem, setMensagem] = React.useState('')
  const [chat, setChat] = React.useState([])

  React.useEffect(() => {
    supabase
      .from('chat')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setChat(data)
      })

    sincronizaMensagensRealTime((novaMensagem) => {
      // handleNovaMensagem(novaMensagem)
      setChat((valorAtualChat) => {
        return [novaMensagem, ...valorAtualChat]
      })
    })
  }, [])

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      from: usuarioLogado,      
      text: novaMensagem      
    }
    supabase
      .from('chat')
      .insert([mensagem])
      .then(({ data }) => {

      })
    setMensagem('')
  }

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: appConfig.theme.colors.primary[800],
        backgroundRepear: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply', color: appConfig.theme.colors.primary[900],
        // backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',
      }}
    >
      <Box
        styleSheet={{
          display: 'flex', flexDirection: 'column', flex: 1, boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)', borderRadius: '5px', height: '100%',
          maxWidth: '95%', MaxHeight: '95vh', padding: '32px', backgroundColor: appConfig.theme.colors.neutrals[500],
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative', display: 'flex', flex: 1, height: '80%', backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column', borderRadius: '5px', padding: '16px',
          }}>

          <MessageList chat={chat} />

          <Box
            as="form"
            styleSheet={{
              display: 'flex', alignItems: 'center',
            }}
          >
            <TextField
              placeholder='Digite algo....'
              type='textarea'
              styleSheet={{
                width: '100%', border: '0', resize: 'none', borderRadius: '5px', padding: '6px 8px', marginRight: '12px',
                backgroundColor: appConfig.theme.colors.neutrals[800], color: appConfig.theme.colors.neutrals[200],
              }}
              value={mensagem}
              onChange={(event) => {
                setMensagem(event.target.value)
              }}
              onKeyPress={(event) => {
                if (event.key == 'Enter') {
                  event.preventDefault()
                  handleNovaMensagem(event.target.value)
                }
              }}
            >
            </TextField>
            <ButtonSendGif
              onStickerClick={(gif) => {
                handleNovaMensagem(`:gif:${gif}`)
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='negative'
          label='Logout'
          href='/'
          styleSheet={{
            backgroundColor: appConfig.theme.colors.primary[800],
            color: appConfig.theme.colors.neutrals[800],
          }}
        >
        </Button>
      </Box>
    </>
  )
}

function MessageList(props) {
  return (
    <Box
      tag='ul'
      styleSheet={{ overflow: 'auto', display: 'flex', flexDirection: 'column-reverse', flex: 1, marginBottom: '16px', color: appConfig.theme.colors.neutrals['000'], }}
    >
      {props.chat.map((mensagem) => {
        return (
          <Text
            tag='li'
            key={mensagem.id}
            styleSheet={{ borderRadius: '5px', padding: '6px', marginBottom: '12px', hover: { backgroundColor: appConfig.theme.colors.neutrals[700] } }}
          >
            <Box styleSheet={{ marginBottom: '8px', }}>
              <Image
                styleSheet={{ width: '20px', height: '20px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}
                src={`https://github.com/${mensagem.from}.png`}
              />
              <Text tag='strong'>
                {mensagem.from}
              </Text>
              <Text
                styleSheet={{ fontSize: '10px', marginLeft: '8px', color: appConfig.theme.colors.neutrals[300], }}
                tag='span'
              >               
               {new Date(mensagem.created_at).toLocaleDateString()} às {(new Date(mensagem.created_at).toLocaleTimeString())}               
              </Text>
            </Box>
            {mensagem.text.startsWith(':gif:') ? (<Image src={mensagem.text.replace(':gif:', '')} />) : (mensagem.text)}
          </Text>
        )
      })}
    </Box>
  )
}