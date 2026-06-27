import networkx as nx


def build_graph(dependencies):

    graph = nx.DiGraph()

    for file_name, imported_modules in dependencies.items():

        graph.add_node(file_name)

        for module in imported_modules:
            graph.add_edge(file_name, module)

    return graph