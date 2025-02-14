

export  const order = {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
      {
        name: 'firstName',
        title: 'First Name',
        type: 'string',
      },
      {
        name: 'lastName',
        title: 'Last Name',
        type: 'string',
      },
      {
        name: 'address',
        title: 'Address',
        type: 'string',
      },
      {
        name: 'city',
        title: 'City',
        type: 'string',
      },
      {
        name: 'zipcode',
        title: 'Zip Code',
        type: 'string',
      },
      {
        name: 'phone',
        title: 'Contact No.',
        type: 'string',
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string',
      },
      {
        name: 'cartItem',
        title: 'Cart Items',
        type: 'array',
        of:[{type : 'reference', to: {type : 'product'}}]
      },
      {
        name: 'total',
        title: 'Total',
        type: 'number',
      },
      {
        name: 'status',
        title: 'Order Status',
        type: 'string',
        options : {
            list :[
                {title : 'Pending ' ,value : 'pending'},
                {title : 'Success' ,value : 'success'},
                {title : 'Dispatch ' ,value : 'dispatch'},
            ],
            layout : 'radio'
        },
        initialvalue : 'pending'
      },
    
    ],
  }