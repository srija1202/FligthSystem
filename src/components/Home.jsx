/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen glass">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="text-4xl font-bold">Flight Booking and Reservation System</h1>
              <p className="mt-2 text-lg">Find and book flights easily with our comprehensive flight booking system.</p>
            </Col>
            <Col md={6} className="text-center">
              <img src="/images/plane.svg" alt="Airplane" className="mx-auto w-3/4 md:w-1/2" />
            </Col>
          </Row>
        </Container>
      </header>

      {/* Information Section */}
      <section className="py-12">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">Welcome to Our Flight Booking System</h2>
                <p className="text-gray-700">
                  Our flight booking and reservation system offers a seamless and user-friendly experience to search, compare, and book flights. 
                  Whether you're planning a business trip or a vacation, our platform provides access to the best flight options and deals. 
                  Enjoy real-time flight updates, secure payment processing, and 24/7 customer support to ensure a smooth travel experience. 
                  Start your journey with us and discover how easy and convenient booking flights can be.
                </p>
                <div className="text-center mt-6">
                  <Button variant="primary" href="/search" className="w-full">Start Searching</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <div className="p-6 bg-blue-100 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Fast Booking</h3>
                <p>Book flights quickly and easily with our user-friendly interface.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-6 bg-blue-100 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p>Enjoy secure and hassle-free payment options with Stripe and PayPal.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-6 bg-blue-100 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
                <p>Get real-time flight updates and status notifications.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6">
        <Container>
          <Row className="text-center">
            <Col>
              <p>&copy; {new Date().getFullYear()} Flight Booking and Reservation System. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
