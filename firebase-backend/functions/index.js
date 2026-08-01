const { onValueUpdated } = require("firebase-functions/v2/database");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
setGlobalOptions({ region: "asia-southeast1" });

// 📧 Email setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});
// 🔁 COMMON FUNCTION
async function handlePriceDrop(event, category) {
    const productId = event.params.productId;

    const beforeData = event.data.before.val();
    const afterData = event.data.after.val();

    if (!afterData) return;

    // 🔍 Get lowest price
    const getPriceData = (data) => {
        if (!data) return null;

        let options = [];

        if (data.amazon?.price) {
            options.push({
                platform: "Amazon",
                price: Number(data.amazon.price),
                url: data.amazon.url || ""
            });
        }

        if (data.flipkart?.price) {
            options.push({
                platform: "Flipkart",
                price: Number(data.flipkart.price),
                url: data.flipkart.url || ""
            });
        }

        if (options.length === 0) return null;

        options.sort((a, b) => a.price - b.price);
        return options[0];
    };

    const oldData = getPriceData(beforeData);
    const newDataPrice = getPriceData(afterData);

    if (!newDataPrice) return;

    // 🔴 Only trigger if price dropped
    if (oldData && newDataPrice.price >= oldData.price) return;

    // 🔔 Fetch alerts
    const alertsSnapshot = await admin.database().ref("priceAlerts").once("value");

    const emailPromises = []; // ✅ collect promises

    alertsSnapshot.forEach((userSnap) => {
        userSnap.forEach((alertSnap) => {
            const alert = alertSnap.val();

            // ✅ STRICT CHECK (fixes your error)
            if (
                alert &&
                alert.productId === productId &&
                typeof alert.email === "string" &&
                alert.email.includes("@") &&
                newDataPrice.price <= Number(alert.targetPrice)
            ) {
                console.log("Sending email to:", alert.email);

                const mailOptions = {
                    from: "Price Comparison <Your-Email>",
                    to: alert.email,
                    subject: "🔥 Price Drop Alert!",
                    text: `
Good news!

${afterData.name || "Product"}

📝 Description:
${afterData.description || "No description available"}

📦 Category: ${category}

💰 Platform: ${newDataPrice.platform}
Current Price: ₹${newDataPrice.price}
Your Target Price: ₹${alert.targetPrice}

🔗 Buy now:
${newDataPrice.url}

Hurry before price increases!
`
                };

                // ✅ push promise instead of direct call
                emailPromises.push(transporter.sendMail(mailOptions));
            }
        });
    });

    // ✅ wait for all emails
    await Promise.all(emailPromises);
}

// 🔔 TRIGGERS

exports.productsAlert = onValueUpdated("/products/{productId}", (e) =>
    handlePriceDrop(e, "product")
);

exports.laptopAlert = onValueUpdated("/laptop/{productId}", (e) =>
    handlePriceDrop(e, "laptop")
);

exports.smartphoneAlert = onValueUpdated("/smartphones/{productId}", (e) =>
    handlePriceDrop(e, "smartphone")
);

exports.headphonesAlert = onValueUpdated("/headphones/{productId}", (e) =>
    handlePriceDrop(e, "headphones")
);

exports.tabletAlert = onValueUpdated("/tablets/{productId}", (e) =>
    handlePriceDrop(e, "tablet")
);

exports.tvAlert = onValueUpdated("/tv/{productId}", (e) =>
    handlePriceDrop(e, "tv")
);