#!/usr/bin/env ts-node
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileTypeFromBuffer } from 'file-type'
import JSZip from 'jszip'

async function main() {
  const zipFile = process.argv[2]
  const courseId = process.argv[3]
  if (!zipFile || !courseId) {
    console.error('Usage: ts-node scripts/import-materials-zip.ts <archive.zip> <course_id>')
    process.exit(1)
  }
  const data = fs.readFileSync(zipFile)
  const zip = await JSZip.loadAsync(data)
  const base = process.env.LOCAL_BASE_URL || 'http://localhost:3000'
  const bucket = process.env.SUPABASE_STORAGE_BUCKET_MATERIALS || 'materials'
  let created = 0
  for (const filename of Object.keys(zip.files)) {
    const entry = zip.files[filename]
    if (entry.dir) continue
    const buff = await entry.async('nodebuffer')
    const type = await fileTypeFromBuffer(buff)
    const lower = filename.toLowerCase()
    let kind: any = 'download'
    if (lower.endsWith('.md') || lower.endsWith('.markdown')) kind = 'markdown'
    else if (lower.endsWith('.pdf')) kind = 'pdf'
    else if (lower.match(/\.(png|jpe?g|gif|webp|svg)$/)) kind = 'image'
    else if (lower.match(/\.(mp3|wav|ogg)$/)) kind = 'audio'
    else if (lower.match(/\.(mp4|webm|mov)$/)) kind = 'video'

    // Upload via signed URL API
    try {
      const uploadReq = await fetch(base + '/api/materials/upload-url', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ filename: path.basename(filename), contentType: type?.mime || 'application/octet-stream', courseId }) })
      const uploadJson = await uploadReq.json()
      if(!uploadReq.ok) throw new Error(uploadJson.error||'upload url fail')
      const { url, token, path: storagePath } = uploadJson
      const put = await fetch(url, { method:'PUT', headers:{ 'x-upsert':'false', 'authorization': `Bearer ${token}` }, body: buff })
      if(!put.ok) throw new Error('upload failed: '+await put.text())
      const materialPayload = { course_id: courseId, kind, title: path.basename(filename), src: storagePath, is_public: false }
      const createRes = await fetch(base + '/api/materials', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(materialPayload) })
      if(!createRes.ok) throw new Error(await createRes.text())
      created++
      console.log('Imported', filename, kind)
    } catch (e:any) {
      console.error('Failed', filename, e.message)
    }
  }
  console.log('Imported total:', created)
}
main()
