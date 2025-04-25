// إذا تستخدم ES Module، استخدم import
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// خلي ملفات Vite الجاهزة داخل dist تشتغل
app.use(express.static(path.join(__dirname, 'dist')))

// أي مسار يرجع index.html (حتى تشتغل الراوتات بشكل صحيح)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// خليه يسمع على البورت من Render أو 5000 افتراضيًا
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغّال على http://localhost:${PORT}`)
})
