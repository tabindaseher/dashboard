 /* eslint-disable @typescript-eslint/no-unused-vars */
 /* eslint-disable @typescript-eslint/no-explicit-any */
'use client';


import ProductedRoute from '@/app/components/protected';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  city: string;
  address: string;
  zipcode: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItem: {

    productName: string;
    image: string;
  }[];
}



export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
           _id,
           firstName,
           lastName,
           phone,
           email,
           city,
           address,
           zipcode,
           total,
           discount,
           orderDate,
           status,
           cartItem[]->{
             productName,
             image
           }
         }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.log('error fetching', error));
  }, []);

  const filteredOrders =
    filter === 'All' ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Handle Delete
  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: 'Are You Sure?',
      text: 'You are not able to return this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'blue',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrder) => prevOrder.filter((order) => order._id !== orderId));
      Swal.fire('Deleted', 'Order has been deleted!', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to delete order', 'error');
    }
  };

  // Handle Status Change
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
     
      setOrders((prevOrder) =>
        prevOrder.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (newStatus === 'dispatch') {
        Swal.fire('Order Dispatch', 'Your order has been dispatched', 'success');
      } else if (newStatus === 'success') {
        Swal.fire('Success', 'Your order has been completed', 'success');
      }
    } catch (error) {
        console.log("Error!", "Something went wrong ", error);
        
      Swal.fire('Error!', 'Something wrong', 'error');
    }
  };
  return (
    <ProductedRoute>
    <div className="flex flex-col h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-5 shadow-lg flex justify-between items-center">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <div className="flex space-x-4">
          {['All', 'pending', 'dispatch', 'success'].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === status ? 'bg-gray-50 text-purple-700 font-bold' : 'text-white hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </nav>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Orders</h2>
        <div className="overflow-y-auto bg-gray-50 rounded-lg shadow-lg">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="px-4 py-2 font-semibold text-gray-700">ID</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Address</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Date</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Total</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Status</th>
                <th className="px-4 py-2 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    className="cursor-pointer hover:bg-red-200 transition-all"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.firstName} {order.lastName}</td>
                    <td className="px-4 py-2">{order.address}</td>
                    <td className="px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">$ {order.total}</td>
                    <td className="px-4 py-2">
                      <select
                        value={order.status || ''}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-gray-50 p-2 rounded border border-gray-300"
                      >
                         <option value="pending">Pending</option>
                         <option value="success">Success</option>
                        <option value="dispatch">Dispatch</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order._id);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {selectedOrderId === order._id && (
                    <tr>
                      <td colSpan={7} className="bg-gray-50 p-4">
                        <h4 className="font-bold text-gray-800">Order Details</h4>
                        <p>
                          Phone: <strong>{order.phone}</strong>
                        </p>
                        <p>
                          Email: <strong>{order.email}</strong>
                        </p>
                        <p>
                          City: <strong>{order.city}</strong>
                        </p>
                        <ul className="mt-2">
  {order.cartItem && order.cartItem.length > 0 ? (
    order.cartItem.map((item ,index) => (
      <li
        key={`${order._id}-${index}`}
        className="flex items-center gap-2 mb-2"
      >
        {item.productName}
        {item.image && (
          <Image
            src={urlFor(item.image).url()}
            alt={item.productName}
            width={100}
            height={100}
            className="rounded"
          />
        )}
      </li>
    ))
  ) : (
    <p>No items in this order.</p>
  )}
</ul>

                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </ProductedRoute>
  );
}

