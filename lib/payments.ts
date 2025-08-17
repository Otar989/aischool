import { logger } from "@/lib/logger"

interface CheckoutParams {
  orderId: string
  amount: number
  currency: string
  description: string
  customerEmail: string
  returnUrl: string
}

export async function createYooKassaPayment({
  orderId,
  amount,
  currency,
  description,
  customerEmail,
  returnUrl,
}: CheckoutParams): Promise<string> {
  const yookassaApiKey = process.env.YOOKASSA_SECRET_KEY
  const shopId = process.env.YOOKASSA_SHOP_ID

  if (!yookassaApiKey || !shopId) {
    throw new Error("YooKassa credentials not configured")
  }

  const paymentData = {
    amount: {
      value: (amount / 100).toFixed(2),
      currency,
    },
    confirmation: {
      type: "redirect",
      return_url: returnUrl,
    },
    description,
    metadata: {
      order_id: orderId,
    },
    receipt: {
      customer: {
        email: customerEmail,
      },
      items: [
        {
          description,
          quantity: "1.00",
          amount: {
            value: (amount / 100).toFixed(2),
            currency,
          },
          vat_code: 1,
        },
      ],
    },
  }

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${shopId}:${yookassaApiKey}`).toString("base64")}`,
      "Idempotence-Key": orderId,
    },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    logger.error({ err: errorText }, "YooKassa API error")
    throw new Error("Failed to create YooKassa payment")
  }

  const payment = await response.json()
  return payment.confirmation.confirmation_url
}
