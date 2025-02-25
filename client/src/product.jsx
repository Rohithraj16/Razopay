import React from "react";
import s24Image from "./images/s24.jpeg";
function Product() {
	const amount = 500;
	const currency = "INR";
	const receiptId = "receipt_no1";
	const paymentHandler = async (e) => {
		const response = await fetch("http://localhost:5000/order", {
			method: "POST",
			body: JSON.stringify({
				amount,
				currency,
				receipt: receiptId,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const order = await response.json();
		console.log(order);
		var options = {
			key: "",
			amount,
			currency,
			name: "Acme Corp",
			description: "Test Transaction",
			image: "https://example.com/your_logo",
			order_id: order.id,
			handler: async function (response) {
				const body = {
					...response,
				};
				const validateRes = await fetch(
					"http://localhost:5000/order/validate",
					{
						method: "POST",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				const jsonRes = await validateRes.json();
				console.log(jsonRes);
			},
			prefill: {
				name: "Integrating the Razorpayin React",
				email: "abcd@example.com",
				contact: "9000900000",
			},
			notes: {
				address: "Razorpay Corporate Office",
			},
			theme: {
				color: "#3399cc",
			},
		};
		var rzp1 = new Razorpay(options);
		rzp1.on("payment.failed", function (response) {
			alert(response.error.code);
			alert(response.error.description);
			alert(response.error.source);
			alert(response.error.step);
			alert(response.error.reason);
			alert(response.error.metadata.order_id);
			alert(response.error.metadata.payment_id);
		});
		rzp1.open();
		e.preventDefault();
	};
	return (
		<div className="product">
			<h2>Samsung S24 ultra</h2>
			<p>256GB, Phantom Black - 200MP Camera, Snapdragon 8 Gen 2</p>
			<p>Amount :₹125000</p>
			<img src={s24Image} alt="" />
			<br />
			<button onClick={paymentHandler}>Pay</button>
		</div>
	);
}

export default Product;
