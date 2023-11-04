/* eslint-disable prettier/prettier */
import { compare, hash } from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { randomInt } from 'node:crypto'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance){
    app.post('/users', async (request, reply) => {
        const bodySchema = z.object({
            name: z.string({
                required_error: "O campo 'nome' é obrigatório!",
            }),
            login: z.string({
                required_error: "O campo 'e-mail' é obrigatório!",
            }).email(),
            password: z.string({
                required_error: "O campo 'senha' é obrigatório!",
            }),
            preferences: z.array(z.number()),
            school: z.number(),
            description: z.string({
                required_error: "O campo 'descrição' é obrigatório!",
            }),
            profilePic: z.string({
                required_error: "O campo 'imagem de perfil' é obrigatório!",
            }),
            isPublic: z.coerce.boolean().default(true)
        })

        const { name, login, password, preferences, profilePic, description, school, isPublic } = bodySchema.parse(request.body)

        let user = await prisma.users.findUnique({
            where: {
              login,
            },
            include: {
                Preferences: true,
                School: true
            }
          })

        if (!user) {
            const randomSalt = randomInt(10, 16)
            const passwordHash = await hash(password, randomSalt)
            user = await prisma.users.create({
                data: {
                    login,
                    name,
                    password: passwordHash,
                    profilePic,
                    description,
                    Preferences: {
                        connect: preferences.map(preferenceId => ({ id: preferenceId })),
                    },
                    schoolsId: school,
                    isPublic
                },
                include: {
                    Preferences: true,
                    School: true
                }
            });
            
        }
        const token = app.jwt.sign(
            {
                name: user.name,
                school: user.School.name,
                createdAt: user.createdAt,
                profilePic: user.profilePic,
                preferences: user.Preferences,
                description: user.description
            },
            {
                sub: user.id,
                expiresIn: '15 days'
            }
        )
        return {token}
    });

    app.post('/login', async (request, reply) => {
        const bodySchema = z.object({
            login: z.string({
                required_error: "O campo 'e-mail' é obrigatório!",
            }).email(),
            password: z.string({
                required_error: "O campo 'senha' é obrigatório!",
            })
        })

        const { login, password } = bodySchema.parse(request.body)

        let user = await prisma.users.findUnique({
            where: {
              login,
            }, include: {
                School: true,
                Preferences: true
            }
          })
          if (user) {

            const isValidPassword = await compare(password, user.password)
            if (isValidPassword) {
                const token = app.jwt.sign(
                    {
                        name: user.name,
                        school: user.School.name,
                        createdAt: user.createdAt,
                        profilePic: user.profilePic,
                        preferences: user.Preferences
                    },
                    {
                        sub: user.id,
                        expiresIn: '15 days'
                    }
                )
                return {token}
            } else {
                reply.status(401).send('Login ou senha informados incorretamente')
            }
          }
    })
}