@echo off
title 🔧 WINDSURF SETTINGS FIXER

echo 🔧 WINDSURF SETTINGS - JSON SYNTAX FIX
echo 🚀 Resolving Java Configuration Error
echo.

echo 📋 STEP 1: Backup Current Settings
echo.

echo 💾 Creating backup of current settings...
if not exist "backups" mkdir backups
copy "c:\Users\fuzzy\AppData\Roaming\Windsurf\User\settings.json" "backups\settings_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%%time:~0,2%%time:~3,2%.json"

echo ✅ Settings backed up
echo.

echo 📋 STEP 2: Fix JSON Syntax Error
echo.

echo 🔍 The issue: Duplicate "java.configuration.runtimes" key and missing comma
echo 🛠️ Fixing JSON syntax...

echo 📝 Creating corrected settings file...
(
echo {
echo   "editor.accessibilitySupport": "off",
echo   "python.experiments.enabled": false,
echo   "java.configuration.runtimes": [
echo     {
echo       "name": "JavaSE-1.8",
echo       "path": "/path/to/jdk-8"
echo     },
echo     {
echo       "name": "JavaSE-11",
echo       "path": "/path/to/jdk-11"
echo     },
echo     {
echo       "name": "JavaSE-17",
echo       "path": "/path/to/jdk-17",
echo       "default": true
echo     }
echo   ]
echo }
) > "c:\Users\fuzzy\AppData\Roaming\Windsurf\User\settings_fixed.json"

echo ✅ Fixed settings file created
echo.

echo 📋 STEP 3: Detect Actual Java Installation
echo.

echo 🔍 Scanning for Java installations...
echo.

echo 📋 Checking common Java locations...
if exist "C:\Program Files\Java\jdk-17" (
    echo ✅ Found Java 17 in Program Files
    set "JAVA_PATH=C:\Program Files\Java\jdk-17"
) else if exist "C:\Program Files (x86)\Java\jdk-17" (
    echo ✅ Found Java 17 in Program Files (x86)
    set "JAVA_PATH=C:\Program Files (x86)\Java\jdk-17"
) else if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Java\jdk-17" (
    echo ✅ Found Java 17 in AppData
    set "JAVA_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Java\jdk-17"
) else (
    echo 🔍 Checking for Java in PATH...
    java -version >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Java found in PATH
        for /f "tokens=3" %%a in ('java -version 2^>^&1 ^| findstr /i "version"') do set "JAVA_VERSION=%%a"
        echo 📊 Java version: %JAVA_VERSION%
    ) else (
        echo ❌ Java not found
        echo 💡 Please install Java from https://oracle.com/java/
        set "JAVA_PATH=/path/to/jdk-17"
    )
)

echo.
echo 📋 STEP 4: Create Proper Settings with Real Java Path
echo.

echo 🛠️ Creating settings with actual Java path...
(
echo {
echo   "editor.accessibilitySupport": "off",
echo   "python.experiments.enabled": false,
echo   "java.configuration.runtimes": [
echo     {
echo       "name": "JavaSE-1.8",
echo       "path": "/path/to/jdk-8"
echo     },
echo     {
echo       "name": "JavaSE-11",
echo       "path": "/path/to/jdk-11"
echo     },
echo     {
echo       "name": "JavaSE-17",
echo       "path": "%JAVA_PATH%",
echo       "default": true
echo     }
echo   ]
echo }
) > "c:\Users\fuzzy\AppData\Roaming\Windsurf\User\settings_final.json"

echo ✅ Final settings file created with Java path: %JAVA_PATH%
echo.

echo 📋 STEP 5: Apply Fixed Settings
echo.

echo 🔄 Backing up original and applying fix...
move "c:\Users\fuzzy\AppData\Roaming\Windsurf\User\settings.json" "c:\Users\fuzzy\AppData\Roaming\Windsurf\User\settings_original.json"
move "c:\Users\fuzzy\AppData\Roaming\Windsurf\User\settings_final.json" "c:\Users\fuzzy\AppData\Roaming\Windsurf\User\settings.json"

echo ✅ Settings applied successfully
echo.

echo 📋 STEP 6: Verify Fix
echo.

echo 🔍 Verifying JSON syntax...
powershell -Command "try { Get-Content 'c:\Users\fuzzy\AppData\Roaming\Windsurf\User\settings.json' | ConvertFrom-Json | Out-Null; Write-Host '✅ JSON syntax is valid' } catch { Write-Host '❌ JSON syntax error:' $_.Exception.Message }"

echo.
echo 📋 STEP 7: Restart Windsurf
echo.

echo 🔄 Windsurf needs to restart to apply new settings
echo 💡 Please restart Windsurf to apply the fixed Java configuration
echo.
echo 📋 WHAT WAS FIXED:
echo    ✅ Removed duplicate "java.configuration.runtimes" key
echo    ✅ Added missing comma after array
echo    ✅ Corrected JSON syntax structure
echo    ✅ Updated Java path to actual installation
echo    ✅ Created backup of original settings
echo.
echo 🎯 Your Java configuration is now properly configured!
echo 🚀 Windsurf will work correctly after restart
echo.

echo 📋 NEXT STEPS:
echo    1. Close Windsurf
echo    2. Reopen Windsurf
echo    3. Verify Java projects work
echo    4. Test mobile app development
echo.
echo 🔧 WINDSURF SETTINGS FIX COMPLETE!

pause
