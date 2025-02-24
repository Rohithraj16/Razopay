import React from "react";
import TshirtImg from "./tshirt.svg";
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
			handler: function (response) {
				alert(response.razorpay_payment_id);
				alert(response.razorpay_order_id);
				alert(response.razorpay_signature);
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
			<h2>Tshirt</h2>
			<p>SOLID BLUE COTTON SHIRT</p>
			<img src={TshirtImg} alt="" />
			<br />
			<button onClick={paymentHandler}>Pay</button>
		</div>
	);
}

export default Product;
