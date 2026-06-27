from app.analyzers.dependency_graph import build_graph


dependencies = {
    "app.py": ["utils", "db"],
    "auth.py": ["db"]
}


graph = build_graph(dependencies)

print("Nodes:")
print(list(graph.nodes()))

print("\nEdges:")
print(list(graph.edges()))