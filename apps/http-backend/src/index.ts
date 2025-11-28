import express from "express";
import jwt  from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middelware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client"
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json()); 

app.post("/signup",async (req, res) => {
    // db call

    const data = CreateUserSchema.safeParse(req.body);
    if(!data.success) {
        return res.status(400).json({
        message: "Invalid input"
      });
    }

    const { email, username, password } = data.data

    try {

        const userExist = await prismaClient.user.findUnique({
            where: { email },
        });

        if(userExist) {
            return res.status(400).json({
            message:"Email already registered"
        });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        
        const user = await prismaClient.user.create({
        data: {
            email,
            name:username, // Full name
            password: hashedPassword,
        },
        });

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }

});

app.post("/signin",async (req, res) => {

    const data = SigninSchema.safeParse(req.body);
    if(!data.success) {
        return res.json({
            message: "Incorrect input"
        });
    }

    const { email, password } = data.data;

    try {
        const user = await prismaClient.user.findUnique({
            where: { email },
        });

        if(!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, user.password);

        if(!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({userId : user.id},JWT_SECRET,{expiresIn: "7d"});
        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }

});

app.post("/room", middleware,async (req, res) => {
    // db call

    const data = CreateRoomSchema.safeParse(req.body);
    // console.log(data);
    if(!data.success) {
        return res.json({
            message: "Incorrect input"
        }); 
    }

    try {

        const userId = req.userId;

        const room = await prismaClient.room.create({
            data: {
                slug: data.data.name,
                adminId: userId,
            }
        });

        return res.json({
            message: "room created successfully",
            roomId: room.id,
            name: room.slug
        });
    } catch(err) {
        return res.status(401).json({message: "exist name"});
    }

});

app.get("/chat/:roomId", async (req, res) => {

    try {
        const roomId = req.params.roomId;

        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: Number(roomId)
            },
            take: 50,
            orderBy: {
                id: 'desc'
            }
        });

        return res.json({ 
            messages
        });
    } catch(err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/room/:slug", async (req, res) => {

    const slug = req.params.slug;

    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    return res.json({ 
        room
    });
});

app.listen(3003);