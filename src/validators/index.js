import { z } from 'zod'

export const userRegistrationValidator = z.object({
    body: z.object({
        email: z.string().email().nonempty(),
        username: z.string().nonempty(),
        password: z.string().min(6).nonempty(),
        fullname: z.string().min(3).nonempty()
    })
})

export const userLoginValidator = z.object({
    body: z.object({
        email: z.string().email().nonempty(),
        password: z.string().min(6).nonempty()
    })
})
