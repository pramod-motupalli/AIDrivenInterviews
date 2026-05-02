from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.core.files.storage import default_storage
from rest_framework.permissions import IsAuthenticated

class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok", "message": "API is running"}, status=status.HTTP_200_OK)

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # 5MB limit
        if file_obj.size > 5 * 1024 * 1024:
            return Response({'error': 'File size exceeds 5MB limit'}, status=status.HTTP_400_BAD_REQUEST)

        # PDF validation (Only check extension for MVP)
        if not file_obj.name.lower().endswith('.pdf'):
            return Response({'error': 'Only PDF files are allowed for resumes'}, status=status.HTTP_400_BAD_REQUEST)

        file_path = default_storage.save(f'uploads/{file_obj.name}', file_obj)
        file_url = default_storage.url(file_path)

        return Response({'url': file_url}, status=status.HTTP_201_CREATED)
