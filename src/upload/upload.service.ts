import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { fileDTO } from './upload.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  async upload(file: fileDTO) {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseKEY = process.env.SUPABASE_KEY;

    const supabase = createClient(supabaseURL, supabaseKEY, {
      auth: {
        persistSession: false,
      },
    });

    const { data, error } = await supabase.storage
      .from('users-images')
      .upload(file.originalname, file.buffer, {
        upsert: true,
      });

    if (error) {
      throw new Error('Failed to upload');
    }

    const imageURL = await supabase.storage
      .from('users-images')
      .createSignedUrl(data.path, 31536000 * 2000);

    try {
      return imageURL.data.signedUrl;
    } catch (error) {
      throw new HttpException('Failed to upload:', HttpStatus.CONFLICT);
    }
  }
}
