with open('interviews/views.py', 'r') as f:
    lines = f.readlines()
with open('interviews/views.py', 'w') as f:
    f.writelines(lines[:855] + lines[1050:])
