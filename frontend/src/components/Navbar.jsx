import React, { useState, useEffect, Link } from 'react'
import { NavLink, useLocation, Navigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import logo from '../assets/logo.png'
import '../styles/style.css'

function ColorSchemesExample() {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isHomePage = location.pathname === '/'
  const isSignupPage = location.pathname === '/signup'

  const handleLogout = () => {
    window.location.href = '/'
  }

  return (
    <>
      <Navbar bg='dark' variant='dark' className=''>
        <Container className='justify-content-space-between'>
          {/* <Navbar.Brand href='/'> */}
          <Navbar.Brand
            as={NavLink}
            to={!isLoginPage && !isSignupPage && !isHomePage ? 'home' : '#'}
          >
            <img
              alt=''
              src={logo}
              height='50'
              className=' d-inline-block align-top'
            />
            BlueSpace
          </Navbar.Brand>

          {!isLoginPage && !isSignupPage && !isHomePage && (
            <Nav>
              <Button variant='primary' onClick={handleShow}>
                Options
              </Button>
              <Button
                variant='outline-success'
                className='mx-3 text-white'
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Nav>
          )}
        </Container>
      </Navbar>

      <Offcanvas
        placement='end'
        show={show}
        onHide={handleClose}
        className='w-25'
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className='flex-column'>
            <Nav.Item>
              <NavLink
                to='/home'
                className='nav-link'
                onClick={() => setShow(false)} // to dissapear offcanvas
              >
                Home
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to='/friends'
                className='nav-link'
                onClick={() => setShow(false)} // to dissapear offcanvas
              >
                Discover
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to='/profile'
                className='nav-link'
                onClick={() => setShow(false)} // to dissapear offcanvas
              >
                Profile
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to='/discover'
                className='nav-link'
                onClick={() => setShow(false)} // to dissapear offcanvas
              >
                Friend
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to='/messanger'
                className='nav-link'
                onClick={() => setShow(false)} // to dissapear offcanvas
              >
                Messanger
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to='/upload'
                className='nav-link'
                onClick={() => setShow(false)} // to dissapear offcanvas
              >
                Add
              </NavLink>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default ColorSchemesExample
