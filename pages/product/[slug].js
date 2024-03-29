import Layout from '@/components/Layout';
import Product from '@/models/Product';
import { Store } from '@/utils/Store';
//import data from '@/utils/data';
import db from '@/utils/db';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';

export default function ProductDetails({ product }) {
    const { state, dispatch } = useContext(Store);
    const router = useRouter();
    const { query } = useRouter();
    //const { slug } = query;
    //const product = data.products.find(p => p.slug === slug);
    if(!product) {
        return <Layout title="Product Not Found"><div>Product Not Found</div></Layout>
    }
  const addToCartHandler = async () => {
    const existingItem = state.cart.cartItems.find(x => x.slug === product.slug);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if(data.countInStock < quantity) {
        toast.error('Sorry, Product is out of stock');
        return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity }})
    router.push('/cart');
  }
  return (
    <Layout title={product.name}>
        <div className='py-2'>
            <Link href="/">Back to Products</Link>
        </div>
        <div className='grid md:grid-cols-4 md:gap-3'>
            <div className='md:col-sapn-2'>
                <Image
                    src={product.image}
                    alt={product.name}
                    width={640}
                    height={640}
                    layout='responsive'
                ></Image>
            </div>
            <div>
                <ul>
                    <li>
                        <h1 className='text-lg'>{product.name}</h1>
                    </li>
                    <li>Category: {product.category}</li>
                    <li>Brand: {product.brand}</li>
                    <li>
                        {product.rating} of { product.numReviews } reviews
                    </li>
                    <li>Description: {product.description}</li>
                </ul>
            </div>
            <div>
                <div className='card p-5'>
                    <div className='mb-2 flex justify-between'>
                        <div>Price</div>
                        <div>${product.price}</div>
                    </div>
                    <div className='mb-2 flex justify-between'>
                        <div>Status</div>
                        <div>{product.countInStock > 0 ? 'In Stock' : 'Unavailable'}</div>
                    </div>
                    <button className='primary-button w-full' onClick={addToCartHandler}>Add to cart</button>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();
    return {
        props: {
            product: product ? db.convertDocToObj(product) : null
        }
    }
}
