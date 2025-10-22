import { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating.jsx";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useGetProductByIdQuery } from "../slices/productsApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from '../components/Message.jsx';
import { addToCart } from '../slices/cartSlice.js';
import { useDispatch } from 'react-redux';

const ProductPage = () => {
  const  [qty, setQty] = useState(1);
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

 const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

 const addToCartHandler = () => {
  dispatch(addToCart({...product, qty}));
  navigate('/cart')
  }

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        <IoMdArrowRoundBack />
      </Link>

      {isLoading ? (
        <Loader />
      ) : isError ? (
      <Message variant='danger'>{isError?.data?.message}</Message>
      ) : (
        <>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid></Image>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>{product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
        </>
      )}
    </>
  );
};

export default ProductPage;
