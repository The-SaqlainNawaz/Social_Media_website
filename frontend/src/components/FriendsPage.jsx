/* eslint-disable jsx-a11y/anchor-is-valid */
import { Container, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function FriendsPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [friends, setFriends] = useState([])
  const [fproflie, setfProfile] = useState(false)
  const [id, setId] = useState(0)

  useEffect(() => {
    setfProfile(false)
    const items = JSON.parse(localStorage.getItem('items'))
    if (items) {
      setItems(items)
    }
    axios
      .get('http://localhost:5000/user/' + items.id + '/friends')
      .then((response) => {
        console.log(response.data.friends)
        setFriends(response.data.friends)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  function navigateToProfile(id) {
    setfProfile(true)
    setId(id)
    console.log(id)
    const data = { fid: id }
    navigate('/friendsprofile', { state: data })
  }
  return (
    <>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <Container
            key={friend.id}
            onClick={() => navigateToProfile(friend.friend.id)}
          >
            <Row className='d-flex justify-content-center  mt-4'>
              <Col md={8}>
                <div className='people-nearby '>
                  {/* one card */}
                  <div className='nearby-user bg-dark px-5 rounded-4'>
                    <Row className='d-flex align-items-center'>
                      <Col md={2} sm={2}>
                        <img
                          src='https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?w=740&t=st=1679665820~exp=1679666420~hmac=399b3bc6faa5169d653632ed5b2b6bf9dc6572f353617f1a14d44489b57ce46a'
                          alt='user'
                          className='profile-photo-lg'
                        />
                      </Col>
                      <Col md={7} sm={7}>
                        <h5  style={{paddingLeft: "30px"}}>
                          <a
                           
                            className='profile-link text-white text-decoration-none'
                          >
                            {friend.friend.name}
                          </a>
                        </h5>
                      </Col>
                    </Row>
                  </div>
                  {/* ends */}
                </div>
              </Col>
            </Row>
          </Container>
        ))
      ) : (
        <h1 className='d-flex justify-content-center mt-5'>No friends found</h1>
      )}
    </>
  )
}

export default FriendsPage
