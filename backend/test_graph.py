from app.analyzers.dependency_graph import build_graph
from app.analyzers.cycle_detector import detect_cycles
from app.analyzers.unused_module_detector import find_unused_modules


dependencies = {
    "A.py": ["B.py"],
    "B.py": ["C.py"],
    "C.py": ["A.py"],
    "main.py": ["utils.py"],
    "helper.py": []
}


graph = build_graph(dependencies)

print("Nodes:")
print(list(graph.nodes()))

print("\nEdges:")
print(list(graph.edges()))

cycles = detect_cycles(graph)

print("\nCircular Dependencies:")

if cycles:
    for cycle in cycles:
        print(cycle)
else:
    print("No cycles found")

unused_modules = find_unused_modules(graph)

print("\nUnused Modules:")

if unused_modules:
    for module in unused_modules:
        print(module)
else:
    print("No unused modules found")