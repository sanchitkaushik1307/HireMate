@echo off
"C:\Users\Sanchit Kaushik\pgsql\pgsql\bin\pg_ctl.exe" status -D "C:\Users\Sanchit Kaushik\pgsql\data" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Starting PostgreSQL server...
    "C:\Users\Sanchit Kaushik\pgsql\pgsql\bin\pg_ctl.exe" start -D "C:\Users\Sanchit Kaushik\pgsql\data" -l "C:\Users\Sanchit Kaushik\pgsql\data\server.log"
) else (
    echo PostgreSQL server is already running.
)
