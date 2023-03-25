import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
// import { useHistory } from 'react-router-dom'

import axios from 'axios'
import hero from '../assets/hero.png'

const SignupPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  // const history = useHistory()

  useEffect(() => {
    setError('')
  }, [email, username, password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      await axios
        .post('http://localhost:5000/signup', {
          email,
          username,
          password,
        })
        .then((res) => {
          window.location.href = '/login'
          console.log(res.data)
          if (res.data.status === 200) {
            alert('User created successfully')
            setFormSubmitted(true)

            // history.push('/login')
            // return <Navigate to='/login' />
          }
        })
        .catch((err) => {
          console.log(err)
        })

      // Handle successful signup here (e.g. show a success message, redirect the user, etc.)
    } catch (error) {
      setError(error.message)
    }
  }
  if (formSubmitted) return <Navigate to='/login' />

  return (
    <Container className='mt-1'>
      <Row>
        <Col md={6} className='d-flex align-items-center'>
          <div>
            <img src={hero} alt='' className='img-fluid' />
          </div>
        </Col>
        <Col md={6} className='bg-white  mt-4'>
          <div className='p-5'>
            <Form onSubmit={handleSubmit} className='d-flex flex-column'>
              {error && <p className='text-danger mb-3'>{error}</p>}
              <Form.Group controlId='formBasicEmail'>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  className='mb-3'
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicUsername'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  className='mb-3'
                  type='text'
                  placeholder='Enter username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  className='mb-3'
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId='formBasicConfirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  className='mb-3'
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant='primary' type='submit' className='mt-3'>
                Sign Up
              </Button>
              <p className='mt-3'>
                Already have an account? <Link to='/login'>Login In!</Link>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default SignupPage
