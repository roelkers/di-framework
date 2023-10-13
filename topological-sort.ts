export type ListNode<T> = T & {
  id: string
}

export type TNode<T> = T & {
  edges: string[] 
  id: string
}

export class TopologicalSort<T> {
  constructor() {
    this.adjacancyList = new Map() 
    this.sortedList = []
  }
  private adjacancyList: Map<string,TNode<T>>
  private sortedList: ListNode<T>[]

  addNode(id: string, payload: T) {
    this.adjacancyList.set(id, { ...payload, id, edges: [] })
  }

  addEdge(id: string, target: string) {
    const node = this.adjacancyList.get(id)
    if(node) {
      node.edges.push(target)
    } else {
      throw new Error('TPLS: Node not found.')
    }
  }

  sort() {
    const visited: string[] = []
    for(const node of this.adjacancyList.values()) {
      if(!visited.find((id) => id === node.id)) {
        this.sortRecursive(node,visited) 
      }
    }
  }

  private sortRecursive(node: TNode<T>, visited: string[]) {
    visited.push(node.id)
    for(const edgeTarget of node.edges) {
      const newNode = this.adjacancyList.get(edgeTarget)
      if(!newNode) {
        throw new Error('directed edge without target node!')
      }
      if(!visited.find((id) => id === newNode.id)) {
        this.sortRecursive(newNode, visited)
      }
    }
    const { id, edges, ...payload } = node
    this.sortedList.push({ id, ...payload as T })
  }

  getSortedList() {
    return this.sortedList
  }
}
