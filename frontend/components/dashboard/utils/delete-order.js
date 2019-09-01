import React, {useState} from 'react';
import {Alert, Button} from '@blueprintjs/core';
import {useMutation} from '@apollo/react-hooks';
import PropTypes from 'prop-types';

import {DELETE_ORDER, GET_ORDERS} from '../../api';
import showToaster from './show-toaster';

const DeleteOrder = ({key, orderId}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [id, setId] = useState('');
	const [deleteOrder, {loading, error}] = useMutation(
		DELETE_ORDER,
		{
			update(cache, {data: {deleteOrder}}) {
				const {orders} = cache.readQuery({query: GET_ORDERS});

				const result = orders.reverse().filter(el => (deleteOrder.id.indexOf(el.id) === -1));

				cache.writeQuery({
					query: GET_ORDERS,
					data: {orders: result}
				});
			}
		}
	);

	return (
		<>
			<Button
				style={{margin: '5px'}}
				icon="trash"
				intent="danger"
				loading={loading}
				key={key}
				data-order-id={orderId}
				onClick={e => {
					setId(e.currentTarget.attributes['data-order-id'].value);
					setIsOpen(true);
				}}
			>
      Delete
			</Button>
			<Alert
				cancelButtonText="Cancel"
				confirmButtonText="Delete"
				icon="trash"
				intent="danger"
				isOpen={isOpen}
				onCancel={() => {
					setIsOpen(false);
				}}
				data-order-id={orderId}
				onConfirm={async () => {
					await deleteOrder({variables: {id}});
					await setIsOpen(false);
					await setId('');

					showToaster('Order deleted!', error);
				}}
			>
				<p>
              Are you sure you want delete this order? You will not be able to restore it later.
				</p>
			</Alert>
			{error && <p>Error :( Please try again</p>}
		</>
	);
};

DeleteOrder.propTypes = {
	key: PropTypes.string.isRequired,
	orderId: PropTypes.string.isRequired
};

export default DeleteOrder;