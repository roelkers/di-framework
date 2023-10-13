import "reflect-metadata";

function Injectable() {
  return function (target: any) {
    Reflect.defineMetadata("injectable", true, target);
  };
}

@Injectable()
class MyLowerDependency {
  doSomething() {
    console.log("MyLowerDependency is doing something");
  }
}

@Injectable()
class MyDependency {
  doSomething() {
    console.log("MyDependency is doing something");
  }
}

@Injectable()
class MyService {
  constructor(readonly _dependency: MyDependency, readonly _other_dependency: MyLowerDependency) {}

  doSomething() {
    this._dependency.doSomething();
    this._other_dependency.doSomething();
  }
}

class DependencyInjection {
  static get<T>(target: any): T {
    const isInjectable = Reflect.getMetadata("injectable", target);
    if (!isInjectable) {
      throw new Error("Target is not injectable");
    }

    const dependencies = Reflect.getMetadata("design:paramtypes", target) || [];
    const instances = dependencies.map((dep: any) => DependencyInjection.get(dep));
    return new target(...instances);
  }
}

const myService: MyService = DependencyInjection.get(MyService);
myService.doSomething(); // "MyDependency is doing something"
