**Otvaranje projekta**
1. Klonirati projekat u željeni direktorijum komandom git clone
2. Otvoriti projekat u editoru (VSC)
3. Pokrenuti MySQL workbench ili MySQL XAMPP modul

**Pokretanje aplikacije**
1. Instalirati composer komandom: composer install
2. Kopirati env dokument komandom: cp .env.example .env
3. Konfigurisati podatke o bazi u novonastalom .env dokumentu
4. Pokrenuti migracije komandom: php artisan migrate
5. Pokrenuti seedere komandom: php artisan db:seed
6. Pokrenuti aplikaciju komandom: php artisan serve
