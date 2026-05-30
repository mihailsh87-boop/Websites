import { userSchema } from './schemas/user'
import { taskSchema } from './schemas/task'

export const schema = { types: [userSchema, taskSchema] }
