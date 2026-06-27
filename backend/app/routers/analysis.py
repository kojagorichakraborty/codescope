from fastapi import APIRouter

from app.analyzers.dependency_graph import build_graph
from app.analyzers.cycle_detector import detect_cycles
from app.analyzers.unused_module_detector import find_unused_modules
from app.analyzers.coupling_analyzer import analyze_coupling

router = APIRouter()


@router.post("/analyze")
def analyze_project():

    dependencies = {
        "A.py": ["B.py"],
        "B.py": ["C.py"],
        "C.py": ["A.py"],
        "main.py": [
            "utils.py",
            "db.py",
            "auth.py",
            "config.py",
            "logger.py"
        ],
        "helper.py": []
    }

    graph = build_graph(dependencies)

    cycles = detect_cycles(graph)

    unused_modules = find_unused_modules(graph)

    highly_coupled = analyze_coupling(graph)

    return {
        "cycles": cycles,
        "unused_modules": unused_modules,
        "highly_coupled": highly_coupled
    }