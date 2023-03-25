import React, { useState, useEffect } from 'react'
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap'
import axios from 'axios'

const Messenger = () => {
  const [messages, setMessages] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [items, setItems] = useState([])
  const [chatsList, setChatsList] = useState([])
  const [friendId, setFriendId] = useState('')
  const [flag, setFlag] = useState(false)
  const [myMessage, setmyMessage] = useState('')

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'))
    if (items) {
      setItems(items) 
      axios.get('http://localhost:5000/user/' + items.id + '/friends').then((response) => {
        setChatsList(response.data.friends)
        console.log(response.data);
        console.log(response.data.friends);
      })
      .catch((error) => {
        console.log(error)
      })    
    }

  }, [])
  useEffect(() => {
    if (currentChat) {
      const fetcMessages = async () => {
        await axios.get(`http://localhost:5000/user/${items.id}/chats/${currentChat.friend.id}`).then((response) => {
          setMessages(response.data)
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error)
        })
      }
      fetcMessages()
    }
  }, [currentChat])

  const ids = []
  const names = []
  chatsList.forEach((friend) => {
    ids.push(friend.friend.id)
    names.push(friend.friend.name)
  })
  const chats = ids.map((id, index) => ({
    id: id,
    name: names[index],
  }))

  const handleChatClick = (chat) => {
    setCurrentChat(chat)
    setFriendId(chat.friend.id)
    console.log(chat.friend.id);
    setFlag(!flag)
  }

  const handleMessageSubmit = (e) => {
    e.preventDefault()
    let data=[]
    const message = {
      message: messageInput,
    }
    axios.post(`http://localhost:5000/user/${items.id}/friend/${currentChat.friend.id}/chats`,message)
      .then((response) => {
        if(response){
          setMessageInput('')  
  }})
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <div className='mt-3' style={{ height: '80vh' }}>
      <Container fluid style={{ height: '100%' }}>
        <Row style={{ height: '100%' }}>
          <Col xs={4} className='bg-light' style={{ height: '100%' }}>
            <ListGroup style={{ height: '100%', overflowY: 'auto' }}>
              {chatsList && chatsList.map((chat) => (
                <ListGroup.Item
                  key={chat.friend.id}
                  action
                  active={currentChat && currentChat.id === chat.friend.id}
                  onClick={() => handleChatClick(chat)}
                >
                  {chat.friend.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col xs={8} className='bg-white' style={{ height: '100%' }}>
            <Row style={{ height: '10%' }}>
              <Col>
                {currentChat ? (
                  <h3>{currentChat.friend.name}</h3>
                ) : (
                  <h3>Select a chat to start messaging</h3>
                )}
              </Col>
            </Row>
            <Row style={{ height: '80%' }}>
              <Col style={{ height: '100%' }}>
                {currentChat && (
                  <div style={{ height: '100%', overflowY: 'auto' }}>
                    {messages && messages.map((message, index) => (
                      <div key={index}>
                        {message.friend_id===currentChat.friend.id ? (
                          <div style={{textAlign: 'right', color:'blue'}} className='text-left'>{message.message}</div>
                         
                        ) : (
                          <div className='text-right'>{message.message}</div>
                        )}
                        {(message.friend_id===currentChat.friend.id) &&
                          <div style={{textAlign: 'right', color:'blue'}} className='text-left'>{message.message}</div>
                        }
                        {message.user_id===currentChat.user.id && 
                        <div className='text-right'>{message.message}</div>}
                        {
                         <div style={{textAlign: 'right', color:'blue'}} className='text-left'>{myMessage}</div>}

                      </div>
                    ))}
                  </div>
                )}
              </Col>
            </Row>
            <Row style={{ height: '10%' }}>
              <Col>
                {currentChat && (
                  <Form onSubmit={()=>handleMessageSubmit}>
                    <Form.Group controlId='messageInput'>
                      <Form.Control
                        type='text'
                        placeholder='Type a message...'
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant='primary' type='submit'>
                      Send
                    </Button>
                  </Form>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Messenger

