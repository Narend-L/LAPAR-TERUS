import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM orders', (err, rows) => {
      if (err) {
        reject(NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 }));
      } else {
        resolve(NextResponse.json(rows));
      }
    });
  });
}