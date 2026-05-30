/**
 * Скрипт для создания пользователя в Sanity.
 * Запуск: SANITY_API_TOKEN=xxx node scripts/create-user.mjs
 *
 * Требует переменных: NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_TOKEN
 */

import { createClient } from '@sanity/client'
import bcrypt from 'bcryptjs'
import { createInterface } from 'readline'

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = q => new Promise(res => rl.question(q, res))

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const fullName = await ask('Имя пользователя: ')
const email = await ask('Email: ')
const password = await ask('Пароль: ')
const role = await ask('Роль (client / developer): ')
rl.close()

const passwordHash = await bcrypt.hash(password, 12)

const doc = await client.create({
  _type: 'user',
  fullName,
  email,
  passwordHash,
  role: role.trim() === 'developer' ? 'developer' : 'client',
})

console.log(`\nПользователь создан: ${doc._id}`)
console.log(`Email: ${email}, Роль: ${doc.role}`)
