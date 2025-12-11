### Inefficient method binding in templates
Angular provides two main change detection strategies to manage how and when the view is updated in response to state changes: The Default strategy, which checks the entire component tree, and the OnPush strategy, which limits checks to components with changed inputs or triggered events.

```tsx
<div>
    <p>Total: {{ calculateTotal() }}</p>
</div>
```

```tsx
@Component({
  selector: 'app-cart',
  templateUrl: './app-cart.component.html'
})
export class CartComponent {
  items = [{ price: 10 }, { price: 15 }, ...];

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}
```

A commonly reported case by the practitioners involves binding methods directly in templates under the default strategy. In the above example, _calculateTotal()_ is re-evaluated every time Angular runs change detection, even if item is not changed. This happens because the framework does not cache the return value of the method, as it is not a pure function. Since Angular cannot determine whether the method is free of side effects or consistently returns the same output, it executes the method on every cycle to ensure correctness.

### Overusing Any Type

In Angular, developers tend to use the type any, a type annotation that effectively disables type checking, allowing a variable to accept any value without restrictions. When a variable is declared with any, the TypeScript compiler bypasses type verification, providing maximum flexibility while eliminating the fundamental benefits of static typing.

Practitioners report that excessive use of the any type compromises type safety, one of TypeScript's primary advantages, allowing type errors to pass undetected during compilation and manifest only at runtime. Additionally, extensive use of any can mask design and architectural issues, creating a false sense of simplicity that results in more fragile and error-prone code.

```tsx
@Component({
  selector: 'app-user-profile',
  templateUrl: './app-user-profile.component.html'
})
export class UserProfileComponent {
  user: any;
  users: any[] = [];
  
  constructor(private userService: UserService) {}
  
  loadUser(id: any): void {
    this.userService.getUser(id).subscribe((data: any) => {
      this.user = data;
      this.processUserData(data);
    });
  }
}
```

The _UserProfileComponent_ have multiple instances of any. The component declares the user property and users array with any types, eliminating compile-time type checking for these critical data structures. The loadUser method accepts an any parameter, which could lead to runtime errors if an invalid type is passed. Furthermore, the HTTP response from _userService.getUser_ is typed as any, preventing the compiler from validating the structure of the received data. The processUserData method compounds the issue by accepting any input and returning any output, creating a cascade of type safety violations throughout the component's data flow.

### Excessive parent-to-child communication

Component-based architectures encourage a modular and decoupled structure where communication between components occurs through well-defined and constrained mechanisms. However, some developers report the excessive use of `@ViewChild`, a feature that allows a parent component to access a child component's public interface directly, as a source of architectural degradation.

This anti-pattern introduces a strong dependency between the parent and the internal implementation of the child. As a result, changes to the child component may propagate to the parent, as in the example below:

```ts
@Component({
  selector: 'app-child',
  template: `<p>{{ message }} - {{ count }}</p>`
})
export class ChildComponent {
  message = 'Init';
  count = 0;

  update(msg: string) {
    this.message = msg;
    this.count++;
  }

  reset() {
    this.message = 'Init';
    this.count = 0;
  }

  /* ... */
}

@Component({
  selector: 'app-parent',
  template: `
    <app-child></app-child>
    <button (click)="init()">Init</button>
    <button (click)="activate()">Activate</button>
    <button (click)="disable()">Disable</button>
    <button (click)="increment()">Increment</button>
    <button (click)="reset()">Reset</button>
  `
})
export class ParentComponent {
  @ViewChild(ChildComponent) child!: ChildComponent;

  updateChild() {
    this.child.update('Updated by parent');
  }

  resetChild() {
    this.child.reset();
  }

  /* ... */
}
```

The parent directly alters the child's state by invoking its method. This implementation compromises component independence and hinders unit testing, as child components can no longer operate in isolation. Moreover, this tight coupling may escalate over time, leading to rigid component hierarchies.

### Coupled Services

When a single service become responsible for handling multiple unrelated concerns, they introduce tight coupling. This violates the principle of **Separation of Concerns** and makes the service difficult to maintain, test, or reuse.  

In the example below, the `AppService` handles both user and item logic, and is injected into components with unrelated responsibilities.

```ts
@Injectable({ providedIn: 'root' })
export class AppService {
  getUser() { /* ... */ }
  getItems() { /* ... */ }
}

@Component({ /* ... */ })
export class HeaderComponent {
  user = this.appService.getUser();
  constructor(private appService: AppService) {}
}

@Component({ /* ... */ })
export class ListComponent {
  items = this.appService.getItems();
  constructor(private appService: AppService) {}
}
```

### Large component

A large component refers to a component that contains excessive code, handles multiple responsibilities, or encompasses too many features, violating the single responsibility principle. The developers advocates for component decomposition as a fundamental practice, where complex or reusable UI portions should be extracted into separate, focused components.

### Direct DOM manipulation

In web development, the Document Object Model (DOM) represents the structure of a web page as a tree of objects that can be programmatically accessed and modified. As usual in **Angular**, developers can access DOM elements through the `ViewChild` decorator and manipulate them using the `ElementRef` class. While this approach may seem convenient, it bypasses Angular's declarative and reactive paradigms.  

In the example below, the `ElementRef` is used to directly alter an element's style:

```ts
@Component({
  selector: 'app-alert',
  template: `<div #alertBox>Alert message</div>`
})
export class AlertComponent {
  @ViewChild('alertBox') alertBox!: ElementRef;

  ngAfterViewInit() {
    this.alertBox.nativeElement.style.backgroundColor = 'red';
  }
}
```

### Inheritance instead of composition

While Angular supports both inheritance and composition, some developers heavily rely on class inheritance to share logic across components, often by creating abstract base classes. However, this approach can introduce tight coupling between components and reduce maintainability.  

As illustrated in the example below, a base class encapsulates shared functionality:

```ts
export abstract class BasePageComponent {
  abstract pageTitle: string;

  initPage() {
    console.log(`Initializing page: ${this.pageTitle}`);
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent extends BasePageComponent {
  pageTitle = 'Home Page';
}
```

Moreover, developers report that subclasses frequently require behavior not anticipated in the base class, leading to abstract methods tailored to specific cases. This results in logic being spread across the hierarchy, which hampers modularity, flexibility, and ease of testing.

### Too many inputs

The `@Input` decorator is used to define properties that allow a child component to receive data from its parent. However, relying on an excessive number of external inputs can be problematic. It often indicates that the component is overly complex or tightly coupled to its parent, which undermines modularity.

```ts
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html'
})
export class UserCardComponent {
  @Input() userName!: string;
  @Input() userAge!: number;
  @Input() userEmail!: string;
  @Input() userRole!: string;
  @Input() isActive!: boolean;
  @Input() showAvatar!: boolean;
  @Input() highlight!: boolean;
  /* ... */
}
```

### Prop drilling

**Prop Drilling** arises when data must be passed from a parent component to a deeply nested child component through multiple intermediary components that do not use the data themselves. This smell typically occurs through successive declarations of `@Input` properties, resulting in tightly coupled component hierarchies and reduced maintainability.

Consider a scenario where the `ParentComponent` holds an object named `data`, intended solely for use in `ChildComponentC`. However, since `ChildComponentC` is nested within `ChildComponentB`, which in turn is nested in `ChildComponentA`, the `data` must be passed through each intermediary component via `@Input()` bindings, even though none of them utilize it directly.  

Furthermore, the inverse can occur when a deeply nested child component needs to emit an event to its ancestor. In this case, multiple intermediary components must define `@Output()` event bindings to propagate the emitted event upward in the hierarchy.

### Large file

In Angular, large files commonly emerge when developers embed templates directly within component classes using inline templates, combine multiple service implementations, or co-locate related but distinct functionalities without proper separation. This anti-pattern violates the principle of single responsibility at the file level, creating monolithic structures that become increasingly difficult to navigate and modify as the codebase evolves.

### Duplicated component

**Duplicated Component** manifests when multiple Angular components within a project share highly similar or identical structure, logic, or functionality. Consequently, such duplication leads to redundancy in the codebase. Furthermore, the presence of duplicated components suggests insufficient abstraction and poor reuse of common functionalities.

---