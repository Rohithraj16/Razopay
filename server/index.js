const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.post("/order", async (req, res) => {
	try {
		const razorpay = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_SECRET,
		});
		const options = req.body;
		const order = await razorpay.orders.create(options);
		if (!order) {
			return res.status(500).send("Error");
		}
		res.json(order);
	} catch (err) {
		console.error("Razorpay Order Error:", err);
		res.status(500).json({ error: err.message });
	}
});

app.post("/order/validate", async (req, res) => {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
		req.body;
	const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
	sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
	const digest = sha.digest("hex");
	if (digest !== razorpay_signature) {
		return res.status(400).json({ msg: "Transaction is not legit" });
	}
	const responseData = {
		msg: "success",
		order_Id: razorpay_order_id,
		payment_Id: razorpay_payment_id,
	};
	console.log("Sending response:", responseData);

	res.json(responseData);
});
app.listen(PORT, () => {
	console.log("Listening to the port", PORT);
});
