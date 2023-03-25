import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { Container, Form, Button } from 'react-bootstrap'

const UploadImage = () => {
  const [items, setItems] = useState({ id: '' })
  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [isUploadSuccess, setIsUploadSuccess] = useState(false)

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleCaptionChange = (e) => {
    setCaption(e.target.value)
  }

  // to get the id of the user
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'))
    if (items) {
      setItems(items)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', image)
    formData.append('caption', caption)

    try {
      const res = await axios.post(
        `http://localhost:5000/user/${items.id}/post`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      console.log(res.data)
      setIsUploadSuccess(true) // set isUploadSuccess to true after successful upload
    } catch (error) {
      console.log(error)
    }
  }

  // redirect to home page after successful upload
  if (isUploadSuccess) {
    return <Navigate to='/home' />
  }

  return (
    <Container
      className='d-flex justify-content-center align-items-center'
      style={{ height: '80vh' }}
    >
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor='image'>Upload Image:</Form.Label>
          <Form.Control type='file' id='image' onChange={handleImageChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='caption'>Caption:</Form.Label>
          <Form.Control
            type='text'
            id='caption'
            value={caption}
            onChange={handleCaptionChange}
          />
        </Form.Group>
        <Button variant='primary' type='submit' className='mt-3'>
          Submit
        </Button>
      </Form>
    </Container>
  )
}

export default UploadImage
