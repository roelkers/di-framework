import "reflect-metadata";
import { TNode, TopologicalSort } from "./topological-sort";

interface CClass<T> extends Function { new(...args: any[]) : T } 

type Provider = CClass<{ id: string }>
type Dependency = { cls: CClass<any> }

export function Injectable() {
  return function (target: any) {
    Reflect.defineMetadata("injectable", true, target);
  };
}

export class DependencyContainer {
  constructor () { 
    this.topologicalSort = new TopologicalSort()
    this.providers = []
    this.instanceMap  = new Map()
  }

  topologicalSort: TopologicalSort<Dependency>
  providers: Provider[]
  instanceMap: Map<string,any> 

  get(target: CClass<any>) {
    if(this.instanceMap.size === 0) {
      throw new Error('Please init dependencies first.')
    }
    return this.instanceMap.get(target.name)
  }

  initDependencies(entryPoints: CClass<any>[]) {
    for(const entry of entryPoints) {
      this.constructDependencyGraph(entry)
    }
    this.topologicalSort.sort()
    const providersSorted = this.topologicalSort.getSortedList()

    this.providers = providersSorted.map((target) => {
      const ownDependencies = Reflect.getMetadata("design:paramtypes", target.cls) || [];
      const instance = this.initDependency(target.cls, ownDependencies)
      this.instanceMap.set(target.cls.name, instance)
      return instance
    })

    return this.providers
  }

  initDependency<T> (Target: CClass<T>, dependencies: CClass<any>[]): T {
    const args = dependencies.map(dependency => {
      const instance = this.instanceMap.get(dependency.name)
      if(!instance) {
        throw new Error('Instance not found in map')
      }
      return instance
    })
    const result = new Target(...args)
    return result 
  }

  constructDependencyGraph(target: CClass<any>) {
    const isInjectable = Reflect.getMetadata("injectable", target);
    if (!isInjectable) {
      throw new Error("Target is not injectable");
    }
    const parentId = target.name
    this.topologicalSort.addNode(parentId, { cls: target })
    const dependencies: CClass<any>[] = Reflect.getMetadata("design:paramtypes", target) || [];
    for(const dep of dependencies) {
      this.topologicalSort.addEdge(parentId, dep.name)
      this.constructDependencyGraph(dep)
    }
  }
}
