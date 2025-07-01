@echo off
echo [INFO] Create folder src\zod if not exist...
if not exist src\zod (
  mkdir src\zod
)

echo [INFO] Start convert file .ts from src\types to Zod schemas...
for %%f in (src\types\*.ts) do (
  echo [ZOD] Chuyển %%f -> src\zod\%%~nf.zod.ts
  npx ts-to-zod src\types\%%~nxf src\zod\%%~nf.zod.ts
)

echo [DONE] ✅ Done
