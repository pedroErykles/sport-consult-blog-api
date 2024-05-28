import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { fileDTO } from './types/upload.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  async upload(file: fileDTO, bucket: string) {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseKEY = process.env.SUPABASE_KEY;
    const userEmail = process.env.USER_EMAIL;
    const userPassword = process.env.USER_PASSWORD;

    const supabase = createClient(supabaseURL, supabaseKEY);

    await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword,
    });

    const { data, error } = await supabase.storage
      .from(`${bucket}`)
      .upload(file.originalname, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (error) {
      console.log(error);
      throw new Error(`Failed to upload file to supabase project`);
    }

    const imageURL = await supabase.storage
      .from(`${bucket}`)
      .createSignedUrl(data.path, 31536000 * 2000);

    try {
      return imageURL.data.signedUrl;
    } catch (error) {
      throw new HttpException('Failed to upload', HttpStatus.CONFLICT);
    }
  }

  async remove(filePath: string, bucket: string) {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseKEY = process.env.SUPABASE_KEY;
    const userEmail = process.env.USER_EMAIL;
    const userPassword = process.env.USER_PASSWORD;

    const supabase = createClient(supabaseURL, supabaseKEY);

    await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword,
    });

    const data = await supabase.storage
      .from(bucket)
      .remove([filePath])
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Unable to remove file`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return data;
  }
}
