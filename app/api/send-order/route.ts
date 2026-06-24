import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    const { 
      id, 
      customerName, 
      customerPhone, 
      customerAddress, 
      items, 
      totalAmount 
    } = orderData;

    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const managerNumber = process.env.MANAGER_WHATSAPP_NUMBER;

    if (!token || !phoneNumberId || !managerNumber) {
      console.error("Missing WhatsApp configuration");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Format items list
    const itemsList = items.map((i: any) => `- ${i.quantity}x ${i.title} (₹${i.price})`).join('\n');

    // Format message matching user requirements
    const message = `🛒 *New Order!*\n\n*Customer:* ${customerName}\n*Phone:* ${customerPhone}\n*Address:* ${customerAddress}\n\n*Items:*\n${itemsList}\n\n*Total:* ₹${totalAmount}\n*Order ID:* ${id}\n*Time:* ${new Date().toLocaleString()}`;

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: managerNumber,
        type: "text",
        text: {
          preview_url: false,
          body: message
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", data);
      return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: response.status });
    }

    return NextResponse.json({ success: true, messageId: data.messages?.[0]?.id });

  } catch (error) {
    console.error("Send Order API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
