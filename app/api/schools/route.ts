import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get("name") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const contact = formData.get("contact") as string
    const email_id = formData.get("email_id") as string
    const imageFile = formData.get("image") as File | null

    // Validate required fields
    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    let imagePath = null

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create schoolImages directory if it doesn't exist
      const uploadDir = join(process.cwd(), "public", "schoolImages")
      try {
        await mkdir(uploadDir, { recursive: true })
      } catch (error) {
        // Directory might already exist
      }

      // Generate unique filename
      const timestamp = Date.now()
      const extension = imageFile.name.split(".").pop()
      const filename = `school_${timestamp}.${extension}`
      const filepath = join(uploadDir, filename)

      await writeFile(filepath, buffer)
      imagePath = `/schoolImages/${filename}`
    }

    // Insert into database
    const result = await sql`
      INSERT INTO schools (name, address, city, state, contact, image, email_id)
      VALUES (${name}, ${address}, ${city}, ${state}, ${contact}, ${imagePath}, ${email_id})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating school:", error)

    // Handle unique constraint violation for email
    if (error instanceof Error && error.message.includes("unique")) {
      return NextResponse.json({ error: "A school with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create school" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const schools = await sql`
      SELECT * FROM schools 
      ORDER BY created_at DESC
    `

    return NextResponse.json(schools)
  } catch (error) {
    console.error("Error fetching schools:", error)
    return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 })
  }
}
