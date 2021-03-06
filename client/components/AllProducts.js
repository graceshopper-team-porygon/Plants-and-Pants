import React from "react";
import { connect } from "react-redux";
import { fetchProducts, fetchDeleteProduct } from "../store/products";
import { fetchAllUsers } from "../store/users";
import {me} from '../store/auth'
import { Link } from "react-router-dom";
import { addToCart, getCartItems, updateCart } from "../store/cartItems";
import {
  Card,
  Grid,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  withStyles,
  Select,
  MenuItem,
} from "@material-ui/core";
import { HighlightOff, Edit } from "@material-ui/icons";

const useStyles = () => ({
  root: {
    maxWidth: 345,
    maxHeight: 445,
    margin: "auto",
  },
  media: {
    height: 200,
    width: "100%",
  },
  centerButtons: {
    display: "flex",
    "justify-content": "space-around",
  },
});

export class AllProducts extends React.Component {
  constructor() {
    super();
this.state = ({category: 'all'})
    this.addClickHandler = this.addClickHandler.bind(this);
    this.categoryChange = this.categoryChange.bind(this)
  }

  componentDidMount() {
    this.props.getProducts('all');
    this.props.getCartItems();
    this.props.me()
  }
categoryChange(e){
  this.setState({category: e.target.value})
  this.props.getProducts(e.target.value)
}
  addClickHandler(product) {
    const isItemInCart = this.props.cartItems.filter(
      (item) => item.productId === product.id
    );

    if (isItemInCart.length !== 1) {
      this.props.addToCart(product);
    } else {
      this.props.updateCart(product.id);
    }
  }

  render() {
    const { classes, isAdmin, fetchDeleteProduct } = this.props;

    return (
      <div>
        <div className = 'category-selector'>
          <Select value = {this.state.category}onChange = {this.categoryChange}>
          <MenuItem value = 'all'>Plants & Pants</MenuItem>
            <MenuItem value = 'pant'>Pants</MenuItem>
            <MenuItem value = 'plant'>Plants</MenuItem>
          </Select>
        </div>
        <Grid container spacing={3} justifyContent="center">
          {this.props.products.map((product) => (
            <Grid item key={product.id} xs={12} md={6} lg={4}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.media}
                  component="img"
                  image={product.imageUrl}
                  alt={product.name}
                />

                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    Price: ${(product.price / 100).toFixed(2)}
                  </Typography>
                </CardContent>

                {!isAdmin ? (
                  // IF USER ISNT ADMIN, THESE BUTTON WILL RENDER
                  <CardActions>
                    <Link to={`/products/${product.id}`}>
                      <Button size="small">Learn More</Button>
                    </Link>
                    <Button
                      onClick={() => this.addClickHandler(product)}
                      size="small"
                    >
                      Add To Cart
                    </Button>
                  </CardActions>
                ) : (
                  // IF USER IS ADMIN, THESE BUTTON WILL RENDER
                  <CardActions className={classes.centerButtons}>
                    <Button
                      onClick={() => this.addClickHandler(product)}
                      size="small"
                    >
                      Add To Cart
                    </Button>
                    <Button>
                      <Link
                        to={`/products/${product.id}`}
                        className={("link", "visited")}
                      >
                        <Edit />
                      </Link>
                    </Button>
                    <Button>
                      <HighlightOff
                        onClick={() => fetchDeleteProduct(product.id)}
                      />
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    products: state.products,
    cartItems: state.cartItems,
    users: state.users,
    isAdmin: state.auth.isAdmin,
    order: state.order,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getProducts: (category) => dispatch(fetchProducts(category)),
    addToCart: (item) => dispatch(addToCart(item)),
    getCartItems: () => dispatch(getCartItems()),
    updateCart: (productId, qty = 1) => dispatch(updateCart(productId, qty)),
    fetchDeleteProduct: (id) => dispatch(fetchDeleteProduct(id)),
    me: ()=> dispatch(me())
  };
};

export default connect(
  mapState,
  mapDispatch
)(withStyles(useStyles)(AllProducts));
