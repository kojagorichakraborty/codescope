import os

def scan_project(path):
    files = []

    for root, dirs, filenames in os.walk(path):
        for file in filenames:
            if file.endswith(".py"):
                files.append(file)

    return files