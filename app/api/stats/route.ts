import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Stats from '@/models/Stats';

export async function GET() {
  try {
    await connectToDatabase();
    let stats = await Stats.findOne({ siteId: 'main' });
    
    if (!stats) {
      stats = await Stats.create({ siteId: 'main', views: 0, likes: 0 });
    }
    
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    await connectToDatabase();
    
    let stats = await Stats.findOne({ siteId: 'main' });
    
    if (!stats) {
      stats = await Stats.create({ siteId: 'main', views: 0, likes: 0 });
    }

    if (action === 'increment_view') {
      stats.views += 1;
    } else if (action === 'toggle_like') {
      // For simplicity, we just increment like for now. 
      // In a real app with auth, you'd toggle per user.
      stats.likes += 1;
    }

    await stats.save();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
