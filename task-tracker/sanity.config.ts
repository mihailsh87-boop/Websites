/**
 * Sanity Studio configuration.
 * Deploy Studio with: npx sanity@latest deploy
 * Access locally with: npx sanity@latest dev
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './sanity/schema'

export default defineConfig({
  name: 'task-tracker',
  title: 'Task Tracker',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('Трекер')
          .items([
            S.listItem().title('Задачи').schemaType('task').child(S.documentTypeList('task').title('Задачи')),
            S.divider(),
            S.listItem().title('Пользователи').schemaType('user').child(S.documentTypeList('user').title('Пользователи')),
          ]),
    }),
  ],
  schema,
})
