import os
import shutil
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AI_ENGINE_DIR = os.path.join(BASE_DIR, 'ai_engine')

APPS_TO_MERGE = ['users', 'jobs', 'interviews', 'reports', 'notifications']

FOLDERS = ['models', 'views', 'serializers', 'urls']

def setup_directories():
    for f in FOLDERS:
        os.makedirs(os.path.join(AI_ENGINE_DIR, f), exist_ok=True)
        init_file = os.path.join(AI_ENGINE_DIR, f, '__init__.py')
        if not os.path.exists(init_file):
            with open(init_file, 'w') as fh:
                fh.write('')

def fix_imports(content):
    for app in APPS_TO_MERGE + ['ai_engine']:
        content = re.sub(rf'from {app}\.models( import| )', rf'from ai_engine.models.{app}_models\1', content)
        content = re.sub(rf'from {app}\.models\.([^ ]+) import', rf'from ai_engine.models.{app}_models import', content)
        
        content = re.sub(rf'from {app}\.serializers( import| )', rf'from ai_engine.serializers.{app}_serializers\1', content)
        content = re.sub(rf'from {app}\.views( import| )', rf'from ai_engine.views.{app}_views\1', content)
        
        content = re.sub(rf'from {app} import models', rf'from ai_engine.models import {app}_models as models', content)
        content = re.sub(rf"'{app}\.([A-Z][a-zA-Z0-9_]*)'", rf"'ai_engine.\1'", content)
        content = re.sub(rf'"{app}\.([A-Z][a-zA-Z0-9_]*)"', rf'"ai_engine.\1"', content)

    content = re.sub(r'from \.models import', r'from ai_engine.models.ai_engine_models import', content)
    content = re.sub(r'from \.serializers import', r'from ai_engine.serializers.ai_engine_serializers import', content)
    
    return content

def inject_app_label(content):
    lines = content.split('\n')
    out = []
    in_meta = False
    for line in lines:
        if re.match(r'^class .*\(.*models\.Model.*\):', line) or re.match(r'^class .*\(.*AbstractUser.*\):', line) or re.match(r'^class .*\(.*AbstractBaseUser.*\):', line):
            out.append(line)
        elif re.match(r'^    class Meta:', line):
            out.append(line)
            out.append("        app_label = 'ai_engine'")
            in_meta = True
        else:
            out.append(line)
    return '\n'.join(out)

def move_files():
    for app in APPS_TO_MERGE + ['ai_engine']:
        app_dir = os.path.join(BASE_DIR, app)
        if not os.path.exists(app_dir):
            continue
        
        for folder in FOLDERS:
            src_file = os.path.join(app_dir, f"{folder}.py")
            if os.path.exists(src_file):
                dest_file = os.path.join(AI_ENGINE_DIR, folder, f"{app}_{folder}.py")
                with open(src_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                content = fix_imports(content)
                if folder == 'models':
                    content = inject_app_label(content)
                    
                with open(dest_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                if app != 'ai_engine':
                    os.remove(src_file)
            elif app == 'ai_engine' and folder in ['models', 'views', 'serializers', 'urls']:
                pass
                
        admin_src = os.path.join(app_dir, "admin.py")
        if os.path.exists(admin_src):
            with open(admin_src, 'r', encoding='utf-8') as f:
                content = f.read()
            content = fix_imports(content)
            
            main_admin = os.path.join(AI_ENGINE_DIR, "admin.py")
            mode = 'a' if os.path.exists(main_admin) else 'w'
            with open(main_admin, mode, encoding='utf-8') as f:
                f.write(f"\n# From {app}\n")
                f.write(content)
            
            if app != 'ai_engine':
                os.remove(admin_src)

def build_init_files():
    models_init = os.path.join(AI_ENGINE_DIR, 'models', '__init__.py')
    with open(models_init, 'w', encoding='utf-8') as f:
        for app in APPS_TO_MERGE + ['ai_engine']:
            f.write(f"try:\n    from .{app}_models import *\nexcept ImportError:\n    pass\n")

def consolidate_urls():
    main_urls = os.path.join(AI_ENGINE_DIR, 'urls.py')
    with open(main_urls, 'w', encoding='utf-8') as f:
        f.write("from django.urls import path, include\n\n")
        f.write("urlpatterns = [\n")
        for app in APPS_TO_MERGE + ['ai_engine']:
            f.write(f"    path('{app}/', include('ai_engine.urls.{app}_urls')),\n")
        f.write("]\n")

if __name__ == "__main__":
    setup_directories()
    move_files()
    build_init_files()
    consolidate_urls()
    print("Consolidation complete.")
