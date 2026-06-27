def analyze_coupling(graph, threshold=3):

    highly_coupled = []

    for node in graph.nodes():

        outgoing_dependencies = graph.out_degree(node)

        if outgoing_dependencies > threshold:

            highly_coupled.append(
                {
                    "module": node,
                    "dependency_count": outgoing_dependencies
                }
            )

    return highly_coupled