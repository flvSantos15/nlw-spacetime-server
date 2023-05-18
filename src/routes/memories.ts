import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().uuid()
})

const bodySchema = z.object({
  content: z.string(),
  coverUrl: z.string(),
  isPublic: z.coerce.boolean().default(false)
})

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...')
      }
    })
  })

  app.get('/memories/:id', async (req) => {
    const { id } = paramsSchema.parse(req.params)

    const memory = await prisma.memory.findFirstOrThrow({
      where: {
        id
      }
    })

    return memory
  })

  app.post('/memories', async (req) => {
    const { content, isPublic, coverUrl } = bodySchema.parse(req.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: 'd00edea9-aa87-4ed9-a535-1763d731a7c3'
      }
    })

    return memory
  })

  app.put('/memories/:id', async (req) => {
    const { id } = paramsSchema.parse(req.params)
    const { content, isPublic, coverUrl } = bodySchema.parse(req.body)

    const memory = await prisma.memory.update({
      where: {
        id
      },
      data: {
        content,
        coverUrl,
        isPublic
      }
    })

    return memory
  })

  app.delete('/memories/:id', async (req) => {
    const { id } = paramsSchema.parse(req.params)

    await prisma.memory.delete({
      where: {
        id
      }
    })
  })
}
