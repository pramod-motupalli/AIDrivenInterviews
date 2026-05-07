import os
from supabase import create_client, Client
from django.conf import settings
import uuid

class SupabaseService:
    def __init__(self):
        self.url = getattr(settings, "SUPABASE_URL", None)
        self.key = getattr(settings, "SUPABASE_KEY", None)
        if not self.url or not self.key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in Django settings")
        self.client: Client = create_client(self.url, self.key)

    def upload_file(self, file_obj, bucket_name: str, remote_path: str):
        """
        Uploads a file object to Supabase Storage.
        Returns the public URL of the uploaded file.
        """
        # Ensure the bucket exists or is handled
        # Note: bucket creation is usually done manually, but we try to upload
        
        # Reset file pointer to start
        file_obj.seek(0)
        
        file_content = file_obj.read()
        
        # Get content type if available (Django UploadedFile has it)
        content_type = getattr(file_obj, 'content_type', 'application/octet-stream')
        
        response = self.client.storage.from_(bucket_name).upload(
            path=remote_path,
            file=file_content,
            file_options={
                "upsert": "true",
                "content-type": content_type
            }
        )
        
        # Get public URL
        public_url = self.client.storage.from_(bucket_name).get_public_url(remote_path)
        return public_url

    def save_screening_metadata(self, data: dict):
        """
        Saves screening metadata to the 'screenings' table.
        """
        response = self.client.table("screenings").insert(data).execute()
        return response.data

supabase_service = SupabaseService()
