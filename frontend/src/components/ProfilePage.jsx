import { Card, Button } from 'react-bootstrap'
import '../styles/style.css'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

function SocialMediaPost() {
  const [userprofile, setUserprofile] = useState(0)
  const [items, setItems] = useState([])
  const [imageUrl, setImageUrl] = useState([])
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'))
    if (items) {
      setItems(items)
    }
    axios
      .get('http://localhost:5000/user/' + items.id)
      .then((response) => {
        setUserprofile(response.data)
        setPosts(response.data.posts)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  const imageUrls = posts.map((post) => post.image_url)
  let imageName = imageUrls.map((url) => url.split('\\').pop())
  let relativeUrls = imageName.map(
    (name) => process.env.PUBLIC_URL + '/images/' + name
  )

  return (
    <div className='d-flex justify-content-center my-5'>
      <Card className='mx-auto ' style={{ width: '65rem' }}>
        <Card.Body>
          <div
            className='mt-2'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img
              src='https://media.npr.org/assets/img/2020/05/05/gettyimages-693140990_custom-96572767b03e0e649349fdb6d38d649e6ccaed75-s1100-c50.jpg'
              alt='Profile Pic'
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            />
            <h5>{items.name}</h5>
          </div>
          <div className='d-flex justify-content-center'>
            <h3 className='px-3 text'>
              Photo Count: {userprofile.posts_count}
            </h3>
            <h3 className='px-3'>Friends Count: {userprofile.friends_count}</h3>
          </div>

          <section className='mt-3'>
            <div className='row'>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div className='col-lg-4 mb-4 mb-lg-0  mt-3'>
                    <div className='bg-image hover-overlay ripple shadow-1-strong rounded'>
                      <img
                        src={relativeUrls[posts.indexOf(post)]}
                        alt=''
                        className='w-100'
                      />
                      <a
                        href='#!'
                        data-mdb-toggle='modal'
                        data-mdb-target='#exampleModal2'
                      >
                        <div
                          className='mask'
                          style={{
                            backgroundColor: 'rgba(251, 251, 251, 0.2)',
                          }}
                        ></div>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div></div>
              )}
            </div>
          </section>
        </Card.Body>
      </Card>
    </div>
  )
}

export default SocialMediaPost
