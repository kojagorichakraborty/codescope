import networkx as nx


def detect_cycles(graph):

    cycles = list(nx.simple_cycles(graph))

    return cycles