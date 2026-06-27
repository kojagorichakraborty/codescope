import os

from app.analyzers.project_scanner import scan_project
from app.analyzers.dependency_extractor import extract_dependencies
from app.analyzers.dependency_graph import build_graph
from app.analyzers.cycle_detector import detect_cycles
from app.analyzers.unused_module_detector import find_unused_modules
from app.analyzers.coupling_analyzer import analyze_coupling


def analyze_repository(project_path):

    python_files = scan_project(project_path)

    dependencies = {}

    for file_path in python_files:

        imports = extract_dependencies(file_path)

        file_name = os.path.basename(file_path)

        dependencies[file_name] = imports

    graph = build_graph(dependencies)

    cycles = detect_cycles(graph)

    unused_modules = find_unused_modules(graph)

    highly_coupled = analyze_coupling(graph)

    return {
        "total_python_files": len(python_files),
        "dependencies": dependencies,
        "cycles": cycles,
        "unused_modules": unused_modules,
        "highly_coupled": highly_coupled
    }