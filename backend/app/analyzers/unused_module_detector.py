def find_unused_modules(graph):

    unused_modules = []

    for node in graph.nodes():

        # in_degree = how many files import this file
        # out_degree = how many files this file imports

        if graph.in_degree(node) == 0 and graph.out_degree(node) == 0:
            unused_modules.append(node)

    return unused_modules