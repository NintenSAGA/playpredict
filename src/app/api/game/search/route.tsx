import { HowLongToBeatService } from 'howlongtobeat'
import { NextResponse } from 'next/server'

const howLongToBeatService = new HowLongToBeatService()

export async function POST(request : Request) {
  const data : ReqData = await request.json()
  const entries = await howLongToBeatService.search(data.content)
  return NextResponse.json(entries[0])
}