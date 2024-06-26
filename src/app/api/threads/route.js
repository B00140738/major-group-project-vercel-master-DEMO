import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from 'mongodb';

const url = 'mongodb+srv://dylaneddie:ubfPiolp4ndPs495@cluster0.ybwuby1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'forums';

export async function GET(request) {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const modulesCollection = db.collection('modules');
    const threadsCollection = db.collection('threads');

    const searchParams = new URL(request.url).searchParams;
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId query parameter is required' }, { status: 400 });
    }

    const module = await modulesCollection.findOne({ _id: new ObjectId(moduleId) });
    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const threads = await threadsCollection.find({ moduleId }).toArray();

    return NextResponse.json({ module, threads });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
