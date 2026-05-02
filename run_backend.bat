@echo off
cd backend
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Starting Django server...
python manage.py runserver
pause
