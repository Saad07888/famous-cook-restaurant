const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

const createPaymentOrder = async (req, res) => {
    try {
        const {
            amount,
            customerName,
            customerPhone,
        } = req.body;

        // Basic validation
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid payment amount is required.",
            });
        }

        if (!customerName || !customerPhone) {
            return res.status(400).json({
                success: false,
                message: "Customer name and phone are required.",
            });
        }

        // Convert rupees to paise
        const amountInPaise = Math.round(Number(amount) * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `fc_${Date.now()}`,
        };

        console.log("=================================");
        console.log("CREATING RAZORPAY ORDER");
        console.log("Amount:", amount);
        console.log("Amount in paise:", amountInPaise);
        console.log("Customer:", customerName);
        console.log("=================================");

        const razorpayOrder = await razorpay.orders.create(options);

        console.log("Razorpay Order Created:", razorpayOrder.id);

        return res.status(200).json({
            success: true,
            message: "Razorpay order created successfully.",
            keyId: process.env.RAZORPAY_KEY_ID,
            order: razorpayOrder,
        });

    } catch (error) {
        console.error("=================================");
        console.error("RAZORPAY ORDER CREATION FAILED");
        console.error("Message:", error.message);
        console.error("Status:", error.statusCode);
        console.error("Code:", error.error?.code);
        console.error("Description:", error.error?.description);
        console.error("=================================");

        return res.status(500).json({
            success: false,
            message: "Unable to create Razorpay order.",
        });
    }
};


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Make sure Razorpay sent everything
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification data is missing.",
            });
        }

        // Generate signature on SERVER
        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        // Compare signatures
        const isValid =
            generatedSignature === razorpay_signature;

        if (!isValid) {
            console.error("Invalid Razorpay payment signature.");

            return res.status(400).json({
                success: false,
                message: "Payment verification failed.",
            });
        }

        console.log("=================================");
        console.log("RAZORPAY PAYMENT VERIFIED");
        console.log("Razorpay Order ID:", razorpay_order_id);
        console.log("Razorpay Payment ID:", razorpay_payment_id);
        console.log("=================================");

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully.",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
        });

    } catch (error) {
        console.error(
            "Razorpay payment verification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Payment verification failed.",
        });
    }
};


module.exports = {
    createPaymentOrder,
    verifyPayment,
};