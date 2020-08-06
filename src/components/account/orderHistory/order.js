import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import ProductInOrderCard from './productInOrderCard'
import GetInvoice from './getInvoice'
import store from '../../../redux/store'
import OrderInformation from './orderInformation'
import { GreenButton } from '../../reuseable/materialButtons'
import Swal from 'sweetalert2'

const mapStateToProps = state => ({
  state: state.reducer
})

class Order extends React.Component {
  componentDidMount () {
    axios
      .get('/api/gc/payments/from')
      .then(res =>
        this.setState({
          payments: res.data
        })
      )
      .catch(err => console.log(err))
  }

  printItems = products => {
    const productsWithInfo = products.map(product => {
      const productInfo = this.props.state.products.products.find(
        oneProduct => oneProduct._id === product.productId && !oneProduct.deleted
      )

      return (
        <ProductInOrderCard
          product={product}
          imageData={productInfo ? productInfo.imageData : false}
          key={product.productId}
          available={!!productInfo}
        />
      )
    })
    return productsWithInfo
  }

  redoOrder = async order => {
    let hasAvailableProducts = false;
   await order.products.forEach(product => {
      const allInfo = this.props.state.products.products.find(
        p => p._id === product.productId && !p.deleted
      )
      if (allInfo) {
        if ( this.props.state.cart.find(c => c.product === product.productId)) {
          store.dispatch({
            type: 'UPDATE_CART_ITEM',
            payload: {
              id: product.productId,
              quantity: product.productQuantity,
              name: product.productName
            }
          })
        } else {
          allInfo.product = product.productId;
          allInfo.quantity = product.productQuantity;
          store.dispatch({
            type: 'ADD_TO_CART',
            payload: allInfo
          })
        }
        hasAvailableProducts = true;
      }
    })
    if(hasAvailableProducts)
    {
      //redirect to cart
      const url = '/cart'
      this.props.history.push(url)
    } else {
      Swal.fire('ERROR:', "We are sorry! None of the products in this order is available anymore", 'error')
    }

  }

  organizeTotal = total => {
    const str = total.toString();
    const index = str.length - 2;
    const beforeComma = str.substring(0, index);
    const afterComma = str.substring(index);
    const totalOrganized = beforeComma + "," + afterComma;
    return totalOrganized;
  }

  render () {
    const payment = this.props.history.location.state.payment
    const order = this.props.history.location.state.order
    const total = this.organizeTotal(order.total)
    return (
      <div className='cart_page'>
        <div className='cart'>
          <div className='single_order'>
            <div className='single_order_header_top'>
              <div className='page_header'>Order Details</div>
              <div className='single_order_id'>Order# {order._id}</div>
            </div>
            <div className='single_order_header_bottom'>
              <div className='single_order_buttons'>
                <GetInvoice
                  products={this.props.state.products}
                  payment={payment}
                  order={order}
                />
                <GreenButton
                  variant='contained'
                  className='order_again_button'
                  onClick={() => this.redoOrder(order)}
                >
                  Order Again
                </GreenButton>
              </div>
              <div className='single_order_total'>TOTAL: ${total}</div>
            </div>
            <div className='order_product_fields_container'>
              <div className='order_product_fields'>
                <div className='order_product_field'>Unit Price</div>
                <div className='order_product_field order_product_field_units'>
                  Units
                </div>
                <div className='order_product_field'>Total Price</div>
              </div>
            </div>
            <div className='cart_body'>{this.printItems(order.products)}</div>
          </div>
        </div>

        <OrderInformation payment={payment} order={order} />
      </div>
    )
  }
}
export default connect(mapStateToProps)(Order)