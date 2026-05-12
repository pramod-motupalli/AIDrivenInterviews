import os
from django.conf import settings
import uuid

try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    print("WARNING: Supabase package not found. Using mock for local development.")
    def create_client(url, key):
        return None
    class Client:
        pass

class SupabaseService:
    def __init__(self):
        self.url = getattr(settings, "SUPABASE_URL", None)
        self.key = getattr(settings, "SUPABASE_KEY", None)
        if not self.url or not self.key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in Django settings")
        
        if SUPABASE_AVAILABLE:
            self.client: Client = create_client(self.url, self.key)
        else:
            self.client = None
            if "dummy.supabase.co" not in self.url:
                raise ValueError("Supabase package is missing and cannot connect to real Supabase instance.")

    def upload_file(self, file_obj, bucket_name: str, remote_path: str):
        """
        Uploads a file object to Supabase Storage.
        Returns the public URL of the uploaded file.
        """
        if "dummy.supabase.co" in self.url:
            print("DEBUG: Bypassing Supabase upload (dummy credentials detected).")
            return f"{self.url}/storage/v1/object/public/{bucket_name}/{remote_path}"

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
        if "dummy.supabase.co" in self.url:
            print("DEBUG: Bypassing Supabase DB insert (dummy credentials detected).")
            return {"id": "dummy-id", **data}

        response = self.client.table("screenings").insert(data).execute()
        return response.data

supabase_service = SupabaseService()
