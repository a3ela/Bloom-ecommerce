import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice.js";
import Loader from "../components/Spinner.jsx";

const Home = () => {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  return (
    <>
    {isLoading ? (
      <Loader />
    ) : isError ? (
      <h2>Error occurred while fetching products.</h2>
    ) : (
      <>
       <h1>Latest Products</h1>
      <Row>
        {products.map((product) => [
          <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>,
        ])}
      </Row>
      </>
    )  }
     
    </>
  );
};

export default Home;
