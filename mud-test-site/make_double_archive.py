from zipfile import ZipFile, ZIP_DEFLATED
from pathlib import Path

base = Path("site/files")
base.mkdir(parents=True, exist_ok=True)

eicar = r'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'

eicar_path = base / "eicar.com"
inner_zip = base / "inner.zip"
double_zip = base / "double_archive.zip"

eicar_path.write_text(eicar, encoding="ascii")

with ZipFile(inner_zip, "w", ZIP_DEFLATED) as z:
    z.write(eicar_path, arcname="eicar.com")

with ZipFile(double_zip, "w", ZIP_DEFLATED) as z:
    z.write(inner_zip, arcname="inner.zip")

print(f"created: {double_zip}")
