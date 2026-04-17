import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { connectDB } from "@/lib/db";


export async function POST(req:Request) {
    try {
        await connectDB()
        const { name, email, password } = await req.json()
        const userExists = await User.findOne({ email })
        if(userExists) {
            return NextResponse.json({ error: "User already exists"}, { status: 400})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({ name, email, password: hashedPassword})

        return NextResponse.json({ message: "User registered successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Server error"}, { status: 500})
    }
}