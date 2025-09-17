@echo off
echo Starting local web server...
echo.
echo Your website will be available at:
echo http://localhost:8000/landing-detailed.html
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "C:\Luba Website"
python -m http.server 8000