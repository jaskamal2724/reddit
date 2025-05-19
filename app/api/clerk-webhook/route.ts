import type { WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const headerPayload = headers()
  const svix_id = (await headerPayload).get("svix-id")
  const svix_timestamp = (await headerPayload).get("svix-timestamp")
  const svix_signature = (await headerPayload).get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify webhook signature
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (!webhookSecret) {
    return new NextResponse("Webhook secret not configured", { status: 500 })
  }

  try {
    const event = payload as WebhookEvent

    // Handle user creation
    if (event.type === "user.created") {
      const { id, email_addresses, username } = event.data

      await db.user.create({
        data: {
          id: id,
          email: email_addresses[0].email_address,
          username: username || `user${Math.floor(Math.random() * 10000)}`,
        },
      })
    }

    // Handle user update
    if (event.type === "user.updated") {
      const { id, email_addresses, username } = event.data

      await db.user.update({
        where: { id },
        data: {
          email: email_addresses[0].email_address,
          username: username || `user${Math.floor(Math.random() * 10000)}`,
        },
      })
    }

    // Handle user deletion
    if (event.type === "user.deleted") {
      const { id } = event.data

      await db.user.delete({
        where: { id },
      })
    }

    return new NextResponse("Webhook received", { status: 200 })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new NextResponse("Error processing webhook", { status: 500 })
  }
}
