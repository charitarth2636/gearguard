import os

base = "backend/app"
dirs = ["models", "schemas", "services", "middlewares", "routes"]

# Adjust base path for Windows execution context if needed
# But cwd is d:\projects\backend_new hackathon

for d in dirs:
    path = os.path.join(base, d)
    if not os.path.exists(path):
        print(f"Skipping {path}")
        continue
    for f in os.listdir(path):
        if f.endswith(".py") and f.count(".") > 1: # user.model.py has 2 dots
            # user.model.py -> user_model.py
            # logic: replace all dots except the last one with underscore
            name_parts = f.split(".")
            # parts = ['user', 'model', 'py']
            new_name = "_".join(name_parts[:-1]) + "." + name_parts[-1]
            
            old_p = os.path.join(path, f)
            new_p = os.path.join(path, new_name)
            print(f"Renaming {f} to {new_name}")
            try:
                os.rename(old_p, new_p)
            except Exception as e:
                print(f"Error renaming {f}: {e}")
