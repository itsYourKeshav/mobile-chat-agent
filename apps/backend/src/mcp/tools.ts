import { query } from '../db/client';
import { Phone } from '@repo/shared-types';

export interface SearchParams {
  maxPrice?: number;
  brand?: string;
  features?: string[];
  minCameraMp?: number;
  minBattery?: number;
}

export const tools = {
  searchPhones: async (params: SearchParams): Promise<Phone[]> => {
    let sql = 'SELECT * FROM phones WHERE 1=1';
    const values: any[] = [];
    let paramIndex = 1;

    if (params.maxPrice) {
      sql += ` AND price <= $${paramIndex++}`;
      values.push(params.maxPrice);
    }
    if (params.brand) {
      sql += ` AND brand ILIKE $${paramIndex++}`;
      values.push(params.brand);
    }
    if (params.minCameraMp) {
      sql += ` AND camera_mp >= $${paramIndex++}`;
      values.push(params.minCameraMp);
    }
    if (params.minBattery) {
      sql += ` AND battery_mah >= $${paramIndex++}`;
      values.push(params.minBattery);
    }
    // Simple feature support (e.g., has_ois)
    if (params.features && params.features.includes('OIS')) {
        sql += ` AND has_ois = true`;
    }

    sql += ' ORDER BY price DESC LIMIT 5'; // Default sort

    const res = await query(sql, values);
    return res.rows;
  },

  comparePhones: async (phoneIds: string[]): Promise<Phone[]> => {
    if (!phoneIds.length) return [];
    
    // Create placeholders like $1, $2, $3
    const placeholders = phoneIds.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `SELECT * FROM phones WHERE id IN (${placeholders})`;
    
    const res = await query(sql, phoneIds);
    return res.rows;
  },

  explainConcept: async (topic: string): Promise<string> => {
    // Static dictionary for high fidelity, fallback to generic if unknown
    const concepts: Record<string, string> = {
      'OIS': 'Optical Image Stabilization (OIS) physically moves the camera lens to compensate for hand shake, reducing blur in photos and videos, especially in low light.',
      'EIS': 'Electronic Image Stabilization (EIS) uses software to crop and stabilize video footage. It is less effective than OIS in low light but good for daylight video.',
      'Fast Charging': 'Fast charging allows a battery to charge at a higher wattage (e.g., 25W, 65W, 120W), significantly reducing the time to reach a full charge.',
      'Battery Health': 'Battery health refers to the maximum capacity of the battery compared to when it was new. It degrades over time with charge cycles.',
      'AMOLED': 'AMOLED displays offer higher contrast, deeper blacks, and better battery efficiency compared to traditional LCD screens because each pixel lights up individually.',
      'Refresh Rate': 'Refresh rate (e.g., 60Hz, 120Hz) is how many times per second the screen updates. Higher rates make scrolling and animations look smoother.'
    };

    const key = Object.keys(concepts).find(k => k.toLowerCase() === topic.toLowerCase());
    return key ? concepts[key] : `I don't have a specific pre-written explanation for "${topic}", but generally, mobile specs define performance and usability.`;
  }
};
